<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Store;
use App\Models\StoreConversation;
use App\Models\StoreMessage;
use App\Models\User;
use App\Support\MediaStorage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StoreChatController extends Controller
{
    private const MESSAGE_LIMIT = 80;

    private const MIGRATION_PATH = 'database/migrations/2026_11_23_142955_create_store_chats_tables.php';

    /**
     * Render the unified Store Chat inbox for both buyers and sellers.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $user->loadMissing('store:id,user_id,name,slug,logo,city,province');

        $initialTab = in_array($request->query('tab'), ['all', 'buying', 'store'], true)
            ? (string) $request->query('tab')
            : 'all';

        if (! $this->ensureStoreChatTables()) {
            return Inertia::render('Chat/Index', [
                'conversations' => [],
                'activeConversationId' => null,
                'initialMessages' => [],
                'hasStore' => $user->store !== null,
                'initialTab' => $initialTab,
            ]);
        }

        $conversations = $this->userConversationsQuery($user)->get();

        $requestedId = (int) $request->query('conversation', 0);
        $activeConversation = $requestedId > 0
            ? $conversations->firstWhere('id', $requestedId)
            : null;

        if (! $activeConversation && $conversations->isNotEmpty()) {
            $activeConversation = match ($initialTab) {
                'store' => $conversations->first(fn (StoreConversation $c): bool => $c->isStoreOwner($user))
                    ?? $conversations->first(),
                'buying' => $conversations->first(fn (StoreConversation $c): bool => $c->buyer_id === $user->id)
                    ?? $conversations->first(),
                default => $conversations->first(),
            };
        }

        $initialMessages = [];
        if ($activeConversation) {
            $batch = $activeConversation->messages()
                ->with([
                    'sender:id,name,role,avatar',
                    'product:id,store_id,name,slug,price,image,stock',
                ])
                ->orderByDesc('id')
                ->take(self::MESSAGE_LIMIT)
                ->get()
                ->reverse()
                ->values();

            $latestId = (int) ($batch->last()?->id ?? 0);
            if ($latestId > 0) {
                $activeConversation->markReadBy($user, $latestId);
            }

            $initialMessages = $batch
                ->map(fn (StoreMessage $msg): array => $this->formatMessage($msg, $activeConversation))
                ->all();
        }

        return Inertia::render('Chat/Index', [
            'conversations' => $conversations
                ->map(fn (StoreConversation $conv): array => $this->formatConversation($conv, $user))
                ->values()
                ->all(),
            'activeConversationId' => $activeConversation?->id,
            'initialMessages' => $initialMessages,
            'hasStore' => $user->store !== null,
            'initialTab' => $initialTab,
        ]);
    }

    /**
     * Start or resume a direct conversation with an active store.
     */
    public function start(Request $request, string $slug): RedirectResponse
    {
        $this->ensureStoreChatTables();

        $user = $request->user();
        $store = Store::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        if ($store->user_id === $user->id) {
            return redirect()
                ->route('chat.index', ['tab' => 'store'])
                ->with('error', 'Anda tidak dapat mengirim pesan ke toko Anda sendiri.');
        }

        $validated = $request->validate([
            'product_id' => ['nullable', 'integer'],
        ]);

        $productId = null;
        if (! empty($validated['product_id'])) {
            $product = Product::where('id', $validated['product_id'])
                ->where('store_id', $store->id)
                ->first();

            $productId = $product?->id;
        }

        $conversation = StoreConversation::firstOrCreate(
            [
                'store_id' => $store->id,
                'buyer_id' => $user->id,
            ],
            [
                'product_id' => $productId,
                'last_message_at' => now(),
            ],
        );

        if ($productId !== null && $conversation->product_id !== $productId) {
            $conversation->update(['product_id' => $productId]);
        }

        return redirect()->route('chat.index', ['conversation' => $conversation->id]);
    }

    /**
     * Poll messages for an active conversation and return updated unread counters.
     */
    public function messages(Request $request, StoreConversation $conversation): JsonResponse
    {
        if (! $this->ensureStoreChatTables()) {
            return response()->json([
                'messages' => [],
                'unread_total' => 0,
            ]);
        }

        $user = $request->user();
        $conversation->loadMissing('store:id,user_id,name,slug,logo,city,province');

        if (! $conversation->hasParticipant($user)) {
            abort(404);
        }

        $afterId = max(0, (int) $request->query('after_id', 0));

        $query = $conversation->messages()
            ->with([
                'sender:id,name,role,avatar',
                'product:id,store_id,name,slug,price,image,stock',
            ]);

        if ($afterId > 0) {
            $batch = $query
                ->where('id', '>', $afterId)
                ->orderBy('id')
                ->take(self::MESSAGE_LIMIT)
                ->get();
        } else {
            $batch = $query
                ->orderByDesc('id')
                ->take(self::MESSAGE_LIMIT)
                ->get()
                ->reverse()
                ->values();
        }

        $latestId = (int) ($batch->last()?->id ?? 0);
        if ($latestId > 0) {
            $conversation->markReadBy($user, $latestId);
        } else {
            $conversation->markReadBy($user);
        }

        $conversations = $this->userConversationsQuery($user)
            ->get()
            ->map(fn (StoreConversation $conv): array => $this->formatConversation($conv, $user))
            ->values()
            ->all();

        return response()->json([
            'messages' => $batch
                ->map(fn (StoreMessage $msg): array => $this->formatMessage($msg, $conversation))
                ->all(),
            'conversations' => $conversations,
            'unread_total' => StoreConversation::totalUnreadFor($user),
        ]);
    }

    /**
     * Send a text and/or image message inside a store conversation.
     */
    public function storeMessage(Request $request, StoreConversation $conversation): JsonResponse
    {
        $this->ensureStoreChatTables();

        $user = $request->user();
        $conversation->loadMissing('store:id,user_id,name,slug,logo,city,province');

        if (! $conversation->hasParticipant($user)) {
            abort(404);
        }

        $validated = $request->validate([
            'message' => ['nullable', 'string', 'max:1000'],
            'image' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg,webp', 'max:3072'],
            'product_id' => ['nullable', 'integer'],
        ]);

        $cleanMessage = trim((string) preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', (string) ($validated['message'] ?? '')));
        $hasImage = $request->hasFile('image');

        if ($cleanMessage === '' && ! $hasImage) {
            throw ValidationException::withMessages([
                'message' => 'Pesan atau foto tidak boleh kosong.',
            ]);
        }

        $productId = null;
        if (! empty($validated['product_id'])) {
            $product = Product::where('id', $validated['product_id'])
                ->where('store_id', $conversation->store_id)
                ->first();

            $productId = $product?->id;
        }

        $imagePath = null;
        if ($hasImage) {
            $stored = MediaStorage::store($request->file('image'), 'store_chat_uploads');
            $imagePath = $stored !== '' ? $stored : null;
        }

        $msg = StoreMessage::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'product_id' => $productId,
            'message' => $cleanMessage !== '' ? $cleanMessage : null,
            'image_path' => $imagePath,
        ]);

        $readColumn = $conversation->isStoreOwner($user)
            ? 'seller_last_read_message_id'
            : 'buyer_last_read_message_id';

        $conversation->forceFill([
            'last_message_at' => $msg->created_at ?? now(),
            $readColumn => $msg->id,
        ])->save();

        $msg->load([
            'sender:id,name,role,avatar',
            'product:id,store_id,name,slug,price,image,stock',
        ]);

        return response()->json([
            'status' => 'created',
            'message' => $this->formatMessage($msg, $conversation),
        ], 201);
    }

    private function userConversationsQuery(User $user)
    {
        $storeId = $user->store?->id;

        return StoreConversation::query()
            ->with([
                'store:id,user_id,name,slug,logo,city,province',
                'buyer:id,name,avatar',
                'product:id,store_id,name,slug,price,image,stock',
                'latestMessage.sender:id,name',
            ])
            ->where(function ($query) use ($user, $storeId): void {
                $query->where('buyer_id', $user->id);
                if ($storeId !== null) {
                    $query->orWhere('store_id', $storeId);
                }
            })
            ->orderByDesc('last_message_at')
            ->orderByDesc('updated_at');
    }

    /**
     * @return array<string, mixed>
     */
    private function formatConversation(StoreConversation $conversation, User $viewer): array
    {
        $isSellerSide = $conversation->isStoreOwner($viewer);
        $latest = $conversation->latestMessage;
        $preview = '';

        if ($latest) {
            $text = trim((string) ($latest->message ?? ''));
            $preview = $text !== '' ? Str::limit($text, 70) : ($latest->image_path ? '[Foto]' : '');
        }

        $timestamp = $latest?->created_at ?? $conversation->last_message_at ?? $conversation->updated_at;
        $wib = $timestamp?->timezone('Asia/Jakarta');

        return [
            'id' => $conversation->id,
            'role' => $isSellerSide ? 'seller' : 'buyer',
            'unread_count' => $conversation->unreadCountFor($viewer),
            'last_message_preview' => $preview,
            'last_time_label' => $wib?->format('H:i') ?? '',
            'last_date_label' => $wib?->translatedFormat('d M') ?? '',
            'store' => $conversation->store ? [
                'id' => $conversation->store->id,
                'name' => $conversation->store->name,
                'slug' => $conversation->store->slug,
                'logo_url' => $conversation->store->logo_url,
                'city' => $conversation->store->city,
                'province' => $conversation->store->province,
            ] : null,
            'buyer' => $conversation->buyer ? [
                'id' => $conversation->buyer->id,
                'name' => $conversation->buyer->name,
                'avatar_url' => $conversation->buyer->avatar_url,
            ] : null,
            'product' => $conversation->product ? [
                'id' => $conversation->product->id,
                'name' => $conversation->product->name,
                'slug' => $conversation->product->slug,
                'price' => (float) $conversation->product->price,
                'image' => $conversation->product->image,
                'stock' => (int) $conversation->product->stock,
            ] : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function formatMessage(StoreMessage $msg, StoreConversation $conversation): array
    {
        $wib = $msg->created_at?->timezone('Asia/Jakarta');
        $isStoreMessage = $conversation->store !== null && $msg->sender_id === $conversation->store->user_id;

        return [
            'id' => $msg->id,
            'conversation_id' => $msg->conversation_id,
            'sender_id' => $msg->sender_id,
            'sender_name' => $isStoreMessage
                ? ($conversation->store?->name ?? $msg->sender?->name ?? 'Toko')
                : ($msg->sender?->name ?? 'Pembeli'),
            'sender_avatar_url' => $isStoreMessage
                ? $conversation->store?->logo_url
                : $msg->sender?->avatar_url,
            'is_store_sender' => $isStoreMessage,
            'message' => $msg->message,
            'image_url' => $msg->image_url,
            'created_at' => $msg->created_at?->toIso8601String(),
            'time_label' => $wib?->format('H:i') ?? '',
            'date_key' => $wib?->format('Y-m-d') ?? '',
            'product' => $msg->product ? [
                'id' => $msg->product->id,
                'name' => $msg->product->name,
                'slug' => $msg->product->slug,
                'price' => (float) $msg->product->price,
                'image' => $msg->product->image,
            ] : null,
        ];
    }

    private function ensureStoreChatTables(): bool
    {
        return $this->ensureTableMigrated('store_conversations', self::MIGRATION_PATH);
    }
}
