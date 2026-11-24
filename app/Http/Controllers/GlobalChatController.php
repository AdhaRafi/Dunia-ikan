<?php

namespace App\Http\Controllers;

use App\Models\GlobalMessage;
use App\Support\MediaStorage;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class GlobalChatController extends Controller
{
    private const INITIAL_LIMIT = 50;

    private const POLL_LIMIT = 50;

    private const OLDER_LIMIT = 40;

    private const MIGRATION_PATH = 'database/migrations/2026_11_19_054200_create_global_messages_table.php';

    private const CHANNEL_MIGRATION_PATH = 'database/migrations/2026_11_23_162308_add_channel_to_global_messages_table.php';

    /**
     * Render the public Community Global Chat page with all recent messages in one unified room.
     */
    public function index(): Response
    {
        if (! $this->ensureGlobalMessagesTable()) {
            return Inertia::render('Community/Index', [
                'initialMessages' => [],
                'hasMoreOlder' => false,
                'communityStats' => [
                    'totalMessages' => 0,
                    'participantsCount' => 0,
                ],
            ]);
        }

        $recent = GlobalMessage::with([
            'user:id,name,role,avatar',
            'user.store:id,user_id,name,slug,is_active',
            'replyTo:id,user_id,message,image_path',
            'replyTo.user:id,name',
        ])
            ->orderByDesc('id')
            ->take(self::INITIAL_LIMIT + 1)
            ->get();

        $hasMoreOlder = $recent->count() > self::INITIAL_LIMIT;
        $messages = $recent
            ->take(self::INITIAL_LIMIT)
            ->reverse()
            ->values()
            ->map(fn (GlobalMessage $msg): array => $this->formatMessage($msg))
            ->all();

        return Inertia::render('Community/Index', [
            'initialMessages' => $messages,
            'hasMoreOlder' => $hasMoreOlder,
            'communityStats' => [
                'totalMessages' => GlobalMessage::count(),
                'participantsCount' => GlobalMessage::distinct('user_id')->count('user_id'),
            ],
        ]);
    }

    /**
     * Return newer messages after a given ID or older history before a given ID.
     */
    public function messages(Request $request): JsonResponse
    {
        if (! $this->ensureGlobalMessagesTable()) {
            return response()->json([
                'messages' => [],
                'has_more' => false,
                'total_messages' => 0,
                'participants_count' => 0,
            ]);
        }

        $afterId = max(0, (int) $request->query('after_id', 0));
        $beforeId = max(0, (int) $request->query('before_id', 0));

        $baseQuery = GlobalMessage::with([
            'user:id,name,role,avatar',
            'user.store:id,user_id,name,slug,is_active',
            'replyTo:id,user_id,message,image_path',
            'replyTo.user:id,name',
        ]);

        if ($beforeId > 0) {
            $batch = $baseQuery
                ->where('id', '<', $beforeId)
                ->orderByDesc('id')
                ->take(self::OLDER_LIMIT + 1)
                ->get();

            $hasMore = $batch->count() > self::OLDER_LIMIT;
            $messages = $batch
                ->take(self::OLDER_LIMIT)
                ->reverse()
                ->values()
                ->map(fn (GlobalMessage $msg): array => $this->formatMessage($msg))
                ->all();

            return response()->json([
                'messages' => $messages,
                'has_more' => $hasMore,
            ]);
        }

        $messages = $baseQuery
            ->when($afterId > 0, fn ($q) => $q->where('id', '>', $afterId))
            ->when($afterId === 0, fn ($q) => $q->orderByDesc('id')->take(self::POLL_LIMIT))
            ->when($afterId > 0, fn ($q) => $q->orderBy('id')->take(self::POLL_LIMIT))
            ->get();

        if ($afterId === 0) {
            $messages = $messages->reverse()->values();
        }

        $totalMessages = GlobalMessage::count();

        return response()->json([
            'messages' => $messages->map(fn (GlobalMessage $msg): array => $this->formatMessage($msg))->all(),
            'has_more' => $afterId === 0 ? $totalMessages > $messages->count() : false,
            'total_messages' => $totalMessages,
            'participants_count' => GlobalMessage::distinct('user_id')->count('user_id'),
        ]);
    }

    /**
     * Store a new global community chat message from an authenticated user.
     */
    public function store(Request $request): JsonResponse
    {
        $this->ensureGlobalMessagesTable();

        $validated = $request->validate([
            'message' => ['nullable', 'string', 'max:600'],
            'image' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg,webp', 'max:3072'],
            'reply_to_id' => ['nullable', 'integer', 'exists:global_messages,id'],
        ]);

        $cleanMessage = trim((string) preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', (string) ($validated['message'] ?? '')));
        $hasImage = $request->hasFile('image');

        if ($cleanMessage === '' && ! $hasImage) {
            throw ValidationException::withMessages([
                'message' => 'Pesan atau foto tidak boleh kosong.',
            ]);
        }

        $imagePath = null;
        if ($hasImage) {
            $stored = MediaStorage::store($request->file('image'), 'community_uploads');
            $imagePath = $stored !== '' ? $stored : null;
        }

        $msg = GlobalMessage::create([
            'user_id' => $request->user()->id,
            'channel' => GlobalMessage::DEFAULT_CHANNEL,
            'reply_to_id' => $validated['reply_to_id'] ?? null,
            'message' => $cleanMessage !== '' ? $cleanMessage : null,
            'image_path' => $imagePath,
        ]);

        $msg->load([
            'user:id,name,role,avatar',
            'user.store:id,user_id,name,slug,is_active',
            'replyTo:id,user_id,message,image_path',
            'replyTo.user:id,name',
        ]);

        return response()->json([
            'status' => 'created',
            'message' => $this->formatMessage($msg),
        ], 201);
    }

    /**
     * Delete a global chat message (allowed for the message author or an admin).
     */
    public function destroy(Request $request, GlobalMessage $message): JsonResponse
    {
        $user = $request->user();
        if (! $user || ($message->user_id !== $user->id && ! $user->isAdmin())) {
            abort(403);
        }

        $deletedId = $message->id;

        if ($message->image_path) {
            MediaStorage::delete($message->image_path);
        }

        $message->delete();

        return response()->json([
            'deleted_id' => $deletedId,
        ]);
    }

    /**
     * Serialize a GlobalMessage exposing only public-safe sender fields.
     *
     * @return array{
     *     id: int,
     *     channel: string,
     *     message: ?string,
     *     image_url: ?string,
     *     created_at: ?string,
     *     time_label: string,
     *     date_key: string,
     *     user: array{
     *         id: int,
     *         name: string,
     *         role: string,
     *         avatar_url: ?string,
     *         store_name: ?string,
     *         store_slug: ?string
     *     },
     *     reply_to: ?array{
     *         id: int,
     *         user_name: string,
     *         snippet: string
     *     }
     * }
     */
    private function formatMessage(GlobalMessage $msg): array
    {
        $sender = $msg->user;
        $activeStore = ($sender?->store && $sender->store->is_active) ? $sender->store : null;
        $createdWib = $msg->created_at?->timezone('Asia/Jakarta');

        $replyData = null;
        if ($msg->replyTo) {
            $replySnippet = trim((string) ($msg->replyTo->message ?? ''));
            if ($replySnippet === '' && $msg->replyTo->image_path) {
                $replySnippet = '[Foto]';
            }

            $replyData = [
                'id' => $msg->replyTo->id,
                'user_name' => $msg->replyTo->user?->name ?? 'Pengguna',
                'snippet' => Str::limit($replySnippet, 90),
            ];
        }

        return [
            'id' => $msg->id,
            'channel' => $msg->channel ?: GlobalMessage::DEFAULT_CHANNEL,
            'message' => $msg->message,
            'image_url' => $msg->image_url,
            'created_at' => $msg->created_at?->toIso8601String(),
            'time_label' => $createdWib?->format('H:i') ?? '',
            'date_key' => $createdWib?->format('Y-m-d') ?? '',
            'user' => [
                'id' => (int) ($sender?->id ?? $msg->user_id),
                'name' => (string) ($sender?->name ?? 'Pengguna'),
                'role' => (string) ($sender?->role ?? 'buyer'),
                'avatar_url' => $sender?->avatar_url,
                'store_name' => $activeStore?->name,
                'store_slug' => $activeStore?->slug,
            ],
            'reply_to' => $replyData,
        ];
    }

    /**
     * Ensure the global_messages table and channel column exist when deployed without boot migrations.
     */
    private function ensureGlobalMessagesTable(): bool
    {
        if (! $this->ensureTableMigrated('global_messages', self::MIGRATION_PATH)) {
            return false;
        }

        if (! Schema::hasColumn('global_messages', 'channel')) {
            try {
                Artisan::call('migrate', [
                    '--path' => self::CHANNEL_MIGRATION_PATH,
                    '--force' => true,
                ]);
            } catch (Throwable) {
                // Fall through to direct schema guard below.
            }

            if (! Schema::hasColumn('global_messages', 'channel')) {
                Schema::table('global_messages', function (Blueprint $table): void {
                    $table->string('channel', 32)->default('general')->index();
                });
            }
        }

        return Schema::hasColumn('global_messages', 'channel');
    }
}
