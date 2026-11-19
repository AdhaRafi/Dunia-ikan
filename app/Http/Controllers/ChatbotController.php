<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Models\FishGuide;
use App\Models\Product;
use App\Support\MediaStorage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ChatbotController extends Controller
{
    public function getHistory(Request $request): JsonResponse
    {
        $user = $request->user();
        $sessionToken = $this->resolveSessionToken($request, false);
        $session = $sessionToken
            ? ChatSession::where('session_token', $sessionToken)
                ->when($user, fn ($q) => $q->where('user_id', $user->id))
                ->when(! $user, fn ($q) => $q->whereNull('user_id'))
                ->first()
            : null;

        if (! $session && $user) {
            $session = ChatSession::where('user_id', $user->id)->latest()->first();
            if ($session) {
                $sessionToken = $session->session_token;
            }
        }

        if (! $session) {
            return response()->json([
                'messages' => [],
                'session_token' => $sessionToken ?? $this->ensureBoundSessionToken($request),
            ]);
        }

        $messages = $session->messages()->with('fishGuides')->get();

        return response()->json([
            'session_id' => $session->id,
            'session_token' => $session->session_token,
            'messages' => $messages,
        ]);
    }

    public function newSession(Request $request): JsonResponse
    {
        $user = $request->user();
        $token = Str::random(40);
        $request->session()->put('chat_session_token', $token);

        if ($user) {
            ChatSession::create([
                'session_token' => $token,
                'user_id' => $user->id,
                'title' => 'Percakapan Baru',
            ]);
        }

        return response()->json([
            'session_token' => $token,
            'messages' => [],
        ]);
    }

    public function sendMessage(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'session_token' => 'nullable|string|max:100',
            'image' => 'nullable|file|image|mimes:jpeg,png,jpg,webp|max:3072',
        ]);

        $userMessage = trim($request->input('message'));
        $user = $request->user();
        $sessionToken = $this->resolveSessionToken($request, true);

        // Ambil atau buat sesi chat yang terikat ketat ke pemilik sesi ini
        $session = ChatSession::where('session_token', $sessionToken)->first();

        if ($session && $session->user_id !== null && (! $user || $session->user_id !== $user->id)) {
            return response()->json([
                'message' => 'Akses ke sesi percakapan ditolak.',
            ], 403);
        }

        if (! $session) {
            $session = ChatSession::create([
                'session_token' => $sessionToken,
                'user_id' => $user?->id,
                'title' => Str::limit($userMessage, 40),
            ]);
        } else {
            if ($user && ! $session->user_id) {
                $session->update(['user_id' => $user->id]);
            }

            if ($session->title === 'Percakapan Baru') {
                $session->update(['title' => Str::limit($userMessage, 40)]);
            }
        }

        // Simpan gambar jika diunggah
        $imagePath = null;
        $imageBase64 = null;
        $imageMime = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $imagePath = MediaStorage::store($file, 'chat_uploads');
            $imageBase64 = base64_encode(file_get_contents($file->getRealPath()));
            $imageMime = $file->getMimeType();
        }

        // Simpan pesan user
        $userChat = ChatMessage::create([
            'chat_session_id' => $session->id,
            'sender' => 'user',
            'message' => $userMessage,
            'image_path' => $imagePath,
        ]);

        // 1. Cari panduan kesehatan aktif dari database berdasarkan kata kunci
        $searchTerms = preg_split('/\s+/', strtolower($userMessage));
        $guideQuery = FishGuide::where('is_active', true);

        $guideQuery->where(function ($q) use ($searchTerms) {
            foreach ($searchTerms as $term) {
                if (strlen($term) >= 3) {
                    $q->orWhereLike('title', "%{$term}%")
                        ->orWhereLike('fish_type', "%{$term}%")
                        ->orWhereLike('symptoms', "%{$term}%")
                        ->orWhereLike('category', "%{$term}%");
                }
            }
        });

        $matchingGuides = $guideQuery->take(3)->get();

        // 2. Cari produk ikan hias relevan dari database (stok > 0 dan aktif)
        $productQuery = Product::with(['store', 'category', 'fishDetail'])
            ->where('is_active', true)
            ->where('stock', '>', 0);

        // Filter apakah user menyebut jenis ikan atau kategori
        $productQuery->where(function ($q) use ($searchTerms) {
            foreach ($searchTerms as $term) {
                if (strlen($term) >= 3) {
                    $q->orWhereLike('name', "%{$term}%")
                        ->orWhereHas('fishDetail', function ($fq) use ($term) {
                            $fq->whereLike('species_name', "%{$term}%")
                                ->orWhereLike('morph_trait', "%{$term}%")
                                ->orWhereLike('care_level', "%{$term}%");
                        });
                }
            }
        });

        $matchingProducts = $productQuery->take(4)->get();

        // Jika tidak ada kata kunci spesifik produk ikan, sertakan rekomendasi ikan pemula/populer
        if ($matchingProducts->isEmpty() && (str_contains(strtolower($userMessage), 'rekomendasi') || str_contains(strtolower($userMessage), 'beli') || str_contains(strtolower($userMessage), 'ikan'))) {
            $matchingProducts = Product::with(['store', 'category', 'fishDetail'])
                ->where('is_active', true)
                ->where('stock', '>', 0)
                ->whereHas('category', fn ($q) => $q->where('slug', 'ikan-hias'))
                ->take(3)
                ->get();
        }

        // Siapkan respons AI atau Fallback
        $apiKey = config('services.gemini.api_key');
        $model = config('services.gemini.model', 'gemini-3.5-flash-lite');
        $assistantReply = null;
        $isFallback = false;

        if (! empty($apiKey)) {
            try {
                // Susun konteks panduan database untuk disuntikkan ke prompt Gemini
                $guidesContext = $matchingGuides->map(function ($g) {
                    return "Judul: {$g->title}\nJenis Ikan: {$g->fish_type}\nGejala: {$g->symptoms}\nPenyebab: {$g->possible_causes}\nPenanganan: {$g->care_instructions}\nPencegahan: {$g->prevention}\nSumber: {$g->source}";
                })->implode("\n---\n");

                $systemPrompt = "Anda adalah 'Kiko', asisten pintar resmi marketplace Dunia Ikan.
Pedoman Penting:
1. Konsultasi kesehatan ikan: Jawaban hanya berisi kemungkinan awal dan hal yang perlu diperiksa (kualitas air, suhu, pH, aerasi). BUKAN diagnosis pasti dokter hewan. Jangan meresepkan obat kimia keras atau dosis berbahaya. Untuk gejala berat atau ikan lemas parah, sarankan bantuan ahli kesehatan hewan.
2. Gunakan informasi panduan resmi database berikut jika relevan:
{$guidesContext}
3. Gaya bahasa & format: Langsung jawab inti pertanyaan secara ramah, ringkas, dan solutif dalam Bahasa Indonesia yang baik. JANGAN mengulang perkenalan diri (seperti 'Halo! Saya Kiko, maskot dan asisten pintar Dunia Ikan...') atau basa-basi pembuka ('Pertanyaan yang bagus sekali') pada jawaban pertanyaan — perkenalan diri hanya boleh jika pengguna sekadar menyapa tanpa bertanya. Tulis teks polos bersih tanpa markup Markdown seperti tanda bintang (** atau *), pagar (#), garis ---, atau backtick (`); gunakan daftar angka (1., 2.) atau simbol peluru (•) saja.";

                $recentTurns = ChatMessage::where('chat_session_id', $session->id)
                    ->where('id', '<', $userChat->id)
                    ->orderByDesc('id')
                    ->take(6)
                    ->get()
                    ->reverse()
                    ->map(fn (ChatMessage $m) => ($m->sender === 'user' ? 'Pembeli: ' : 'Kiko: ').$m->message)
                    ->implode("\n");

                $conversationBlock = $recentTurns !== ''
                    ? "\n\nRiwayat Percakapan Sebelumnya:\n{$recentTurns}"
                    : '';

                $parts = [
                    ['text' => $systemPrompt.$conversationBlock."\n\nPertanyaan Pembeli:\n".$userMessage],
                ];

                if ($imageBase64 && $imageMime) {
                    $parts[] = [
                        'inline_data' => [
                            'mime_type' => $imageMime,
                            'data' => $imageBase64,
                        ],
                    ];
                }

                $candidateModels = array_values(array_unique(array_filter([
                    $model,
                    'gemini-2.5-flash',
                    'gemini-2.5-flash-lite',
                ])));

                foreach ($candidateModels as $attemptModel) {
                    $payload = [
                        'contents' => [
                            ['role' => 'user', 'parts' => $parts],
                        ],
                    ];

                    // Limit reasoning latency on Gemini 3.x / 4.x models and keep answers crisp.
                    if (str_starts_with($attemptModel, 'gemini-3') || str_starts_with($attemptModel, 'gemini-4')) {
                        $payload['generationConfig'] = [
                            'thinkingConfig' => [
                                'thinkingLevel' => 'low',
                            ],
                            'maxOutputTokens' => 1024,
                        ];
                    }

                    // Force IPv4 in containerized runtimes to avoid IPv6 egress stalls.
                    $response = Http::withHeaders([
                        'x-goog-api-key' => $apiKey,
                    ])
                        ->withOptions(['force_ip_resolve' => 'v4'])
                        ->connectTimeout(5)
                        ->timeout(25)
                        ->post(
                            "https://generativelanguage.googleapis.com/v1beta/models/{$attemptModel}:generateContent",
                            $payload
                        );

                    if ($response->successful()) {
                        $json = $response->json();
                        $assistantReply = $json['candidates'][0]['content']['parts'][0]['text'] ?? null;
                        if (is_string($assistantReply) && trim($assistantReply) !== '') {
                            break;
                        }
                    }

                    Log::warning('Gemini API request failed', [
                        'model' => $attemptModel,
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);

                    if (! in_array($response->status(), [404, 429, 500, 502, 503, 504], true)) {
                        break;
                    }
                }
            } catch (\Throwable $e) {
                Log::error('Gemini API Exception', ['error' => $e->getMessage()]);
            }
        }

        // Jika Gemini belum dikonfigurasi atau respon gagal, tampilkan pesan transparan + panduan database
        if (! $assistantReply) {
            $isFallback = true;
            if ($matchingGuides->isNotEmpty()) {
                $assistantReply = "Layanan AI eksternal saat ini sedang tidak tersedia. Berikut panduan resmi dari basis data Dunia Ikan yang relevan dengan pertanyaan Anda:\n\n";
                foreach ($matchingGuides as $idx => $g) {
                    $assistantReply .= ($idx + 1).". {$g->title} ({$g->fish_type})\n";
                    $assistantReply .= "• Gejala: {$g->symptoms}\n";
                    $assistantReply .= "• Penanganan awal: {$g->care_instructions}\n\n";
                }
                $assistantReply .= '(Catatan: Ini adalah pertolongan pertama, pastikan segera cek parameter air seperti suhu dan amonia).';
            } elseif ($matchingProducts->isNotEmpty()) {
                $assistantReply = 'Berikut beberapa rekomendasi produk ikan hias dan perlengkapan aktif di katalog Dunia Ikan sesuai kata kunci Anda:';
            } elseif (preg_match('/^(halo|hai|hi|hello|selamat\s+(pagi|siang|sore|malam))(\s+kiko)?[!.?]*$/i', $userMessage)) {
                $assistantReply = 'Halo! Ada yang bisa Kiko bantu terkait ikan hias, perawatan akuarium, atau pilihan produk di Dunia Ikan?';
            } else {
                $assistantReply = "Layanan Gemini AI sedang offline. Silakan jelaskan jenis ikan Anda dan gejala yang terlihat (misal: 'cupang bintik putih' atau 'ikan lemas mengambang') agar panduan perawatan dari database bisa langsung dicocokkan.";
            }
        }

        $assistantReply = $this->stripMarkdown((string) $assistantReply);

        $recommendedProductsData = $matchingProducts->map(function ($p) {
            return [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'price' => $p->price,
                'stock' => $p->stock,
                'image' => $p->image,
                'store_name' => $p->store->name,
                'store_city' => $p->store->city,
                'category' => $p->category->name,
                'species' => $p->fishDetail?->species_name,
                'morph' => $p->fishDetail?->morph_trait,
                'sex' => $p->fishDetail?->sex,
            ];
        })->toArray();

        // Simpan pesan asisten ke database
        $assistantChat = ChatMessage::create([
            'chat_session_id' => $session->id,
            'sender' => 'assistant',
            'message' => $assistantReply,
            'recommended_products' => $recommendedProductsData,
        ]);

        // Hubungkan referensi panduan yang digunakan
        if ($matchingGuides->isNotEmpty()) {
            $assistantChat->fishGuides()->sync($matchingGuides->pluck('id'));
        }

        return response()->json([
            'status' => 'success',
            'session_token' => $sessionToken,
            'user_message' => $userChat,
            'assistant_message' => $assistantChat->load('fishGuides'),
            'matching_guides' => $matchingGuides,
            'recommended_products' => $recommendedProductsData,
            'is_fallback' => $isFallback,
        ]);
    }

    private function resolveSessionToken(Request $request, bool $createIfMissing): ?string
    {
        $user = $request->user();
        $requested = trim((string) $request->input('session_token', ''));
        $bound = (string) $request->session()->get('chat_session_token', '');

        if ($user) {
            if ($requested !== '') {
                $owned = ChatSession::where('session_token', $requested)
                    ->where(function ($q) use ($user, $bound, $requested) {
                        $q->where('user_id', $user->id);
                        if ($bound !== '' && hash_equals($bound, $requested)) {
                            $q->orWhereNull('user_id');
                        }
                    })
                    ->first();

                if ($owned) {
                    $request->session()->put('chat_session_token', $owned->session_token);

                    return $owned->session_token;
                }
            }

            $existingOwned = ChatSession::where('user_id', $user->id)->latest()->first();
            if ($existingOwned) {
                $request->session()->put('chat_session_token', $existingOwned->session_token);

                return $existingOwned->session_token;
            }

            return $createIfMissing ? $this->ensureBoundSessionToken($request) : null;
        }

        if ($bound !== '') {
            return $bound;
        }

        return $createIfMissing ? $this->ensureBoundSessionToken($request) : null;
    }

    private function ensureBoundSessionToken(Request $request): string
    {
        $bound = (string) $request->session()->get('chat_session_token', '');
        if ($bound !== '') {
            return $bound;
        }

        $token = Str::random(40);
        $request->session()->put('chat_session_token', $token);

        return $token;
    }

    /**
     * Strip raw Markdown syntax so assistant replies render cleanly without stray asterisks.
     */
    private function stripMarkdown(string $text): string
    {
        $lines = preg_split("/\r\n|\n|\r/", $text) ?: [$text];
        $cleaned = array_map(static function (string $line): string {
            if (preg_match('/^\s*[-*_]{3,}\s*$/', $line) === 1) {
                return '';
            }

            $line = preg_replace('/^\s*#{1,6}\s*/', '', $line) ?? $line;
            $line = preg_replace('/^\s*[\*\-]\s+/', '• ', $line) ?? $line;

            return $line;
        }, $lines);

        $result = implode("\n", $cleaned);
        $result = preg_replace('/\*\*(.+?)\*\*/s', '$1', $result) ?? $result;
        $result = preg_replace('/\*([^\s*](?:[^*]*[^\s*])?)\*/', '$1', $result) ?? $result;
        $result = str_replace(['**', '`'], '', $result);
        $result = preg_replace("/\n{3,}/", "\n\n", $result) ?? $result;

        return trim($result);
    }
}
