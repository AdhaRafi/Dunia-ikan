<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Models\FishGuide;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ChatbotController extends Controller
{
    public function getHistory(Request $request): JsonResponse
    {
        $sessionToken = $request->input('session_token') ?? $request->session()->getId();
        $user = $request->user();

        $session = ChatSession::where(function ($q) use ($user, $sessionToken) {
            if ($user) {
                $q->where('user_id', $user->id)->orWhere('session_token', $sessionToken);
            } else {
                $q->where('session_token', $sessionToken);
            }
        })->latest()->first();

        if (! $session) {
            return response()->json([
                'messages' => [],
                'session_token' => $sessionToken,
            ]);
        }

        $messages = $session->messages()->with('fishGuides')->get();

        return response()->json([
            'session_id' => $session->id,
            'session_token' => $sessionToken,
            'messages' => $messages,
        ]);
    }

    public function sendMessage(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'session_token' => 'nullable|string|max:100',
            'image' => 'nullable|image|max:3072',
        ]);

        $userMessage = trim($request->input('message'));
        $user = $request->user();
        $sessionToken = $request->input('session_token') ?: ($request->session()->getId() ?: Str::random(32));

        // Ambil atau buat sesi chat
        $session = ChatSession::firstOrCreate(
            ['session_token' => $sessionToken],
            [
                'user_id' => $user?->id,
                'title' => Str::limit($userMessage, 40),
            ]
        );

        if ($user && ! $session->user_id) {
            $session->update(['user_id' => $user->id]);
        }

        // Simpan gambar jika diunggah
        $imagePath = null;
        $imageBase64 = null;
        $imageMime = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $imagePath = $file->store('chat_uploads', 'public');
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
                    $q->orWhere('title', 'like', "%{$term}%")
                        ->orWhere('fish_type', 'like', "%{$term}%")
                        ->orWhere('symptoms', 'like', "%{$term}%")
                        ->orWhere('category', 'like', "%{$term}%");
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
                    $q->orWhere('name', 'like', "%{$term}%")
                        ->orWhereHas('fishDetail', function ($fq) use ($term) {
                            $fq->where('species_name', 'like', "%{$term}%")
                                ->orWhere('morph_trait', 'like', "%{$term}%")
                                ->orWhere('care_level', 'like', "%{$term}%");
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
        $model = config('services.gemini.model', 'gemini-1.5-flash');
        $assistantReply = null;
        $isFallback = false;

        if (! empty($apiKey)) {
            try {
                // Susun konteks panduan database untuk disuntikkan ke prompt Gemini
                $guidesContext = $matchingGuides->map(function ($g) {
                    return "Judul: {$g->title}\nJenis Ikan: {$g->fish_type}\nGejala: {$g->symptoms}\nPenyebab: {$g->possible_causes}\nPenanganan: {$g->care_instructions}\nPencegahan: {$g->prevention}\nSumber: {$g->source}";
                })->implode("\n---\n");

                $systemPrompt = "Anda adalah 'Asisten Dunia Ikan', asisten pintar konsultasi awal kesehatan ikan dan rekomendasi ikan hias untuk marketplace Dunia Ikan.
Pedoman Penting:
1. Konsultasi kesehatan ikan: Jawaban hanya berisi kemungkinan awal dan hal yang perlu diperiksa (kualitas air, suhu, pH, aerasi). BUKAN diagnosis pasti dokter hewan. Jangan meresepkan obat kimia keras atau dosis berbahaya. Untuk gejala berat atau ikan lemas parah, sarankan bantuan ahli kesehatan hewan.
2. Gunakan informasi panduan resmi database berikut jika relevan:
{$guidesContext}
3. Gaya bahasa: Ramah, profesional, solutif, mudah dipahami pemula. Jawab dalam Bahasa Indonesia yang baik.";

                $contents = [];
                $parts = [
                    ['text' => $systemPrompt."\n\nPertanyaan Pembeli:\n".$userMessage],
                ];

                if ($imageBase64 && $imageMime) {
                    $parts[] = [
                        'inline_data' => [
                            'mime_type' => $imageMime,
                            'data' => $imageBase64,
                        ],
                    ];
                }

                $contents[] = ['role' => 'user', 'parts' => $parts];

                $response = Http::timeout(15)->post(
                    "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}",
                    ['contents' => $contents]
                );

                if ($response->successful()) {
                    $json = $response->json();
                    $assistantReply = $json['candidates'][0]['content']['parts'][0]['text'] ?? null;
                } else {
                    Log::warning('Gemini API request failed', ['status' => $response->status(), 'body' => $response->body()]);
                }
            } catch (\Throwable $e) {
                Log::error('Gemini API Exception', ['error' => $e->getMessage()]);
            }
        }

        // Jika Gemini belum dikonfigurasi atau respon gagal, tampilkan pesan transparan + panduan database
        if (! $assistantReply) {
            $isFallback = true;
            if ($matchingGuides->isNotEmpty()) {
                $guideTitles = $matchingGuides->pluck('title')->implode(', ');
                $assistantReply = "Halo! Layanan AI eksternal saat ini sedang offline atau belum dikonfigurasi API key-nya. Namun jangan khawatir, kami menemukan panduan resmi dari basis data Dunia Ikan yang relevan dengan pertanyaan Anda:\n\n";
                foreach ($matchingGuides as $idx => $g) {
                    $assistantReply .= ($idx + 1).". **{$g->title}** ({$g->fish_type})\n";
                    $assistantReply .= "• Gejala: {$g->symptoms}\n";
                    $assistantReply .= "• Penanganan awal: {$g->care_instructions}\n\n";
                }
                $assistantReply .= '*(Catatan: Ini adalah pertolongan pertama, pastikan segera cek parameter air seperti suhu dan amonia).*';
            } elseif ($matchingProducts->isNotEmpty()) {
                $assistantReply = 'Halo! Berikut beberapa rekomendasi produk ikan hias dan perlengkapan aktif yang tersedia di katalog Dunia Ikan sesuai kata kunci Anda:';
            } else {
                $assistantReply = "Halo! Terima kasih telah menghubungi Asisten Dunia Ikan. Layanan Gemini AI sedang offline, silakan jelaskan jenis ikan Anda dan gejala yang terlihat (misal: 'cupang bintik putih' atau 'ikan lemas mengambang') agar sistem kami dapat mencocokkan panduan perawatan yang tersedia di database.";
            }
        }

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
}
