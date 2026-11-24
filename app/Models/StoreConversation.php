<?php

namespace App\Models;

use Database\Factories\StoreConversationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class StoreConversation extends Model
{
    /** @use HasFactory<StoreConversationFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'store_id',
        'buyer_id',
        'product_id',
        'last_message_at',
        'buyer_last_read_message_id',
        'seller_last_read_message_id',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'last_message_at' => 'datetime',
            'buyer_last_read_message_id' => 'integer',
            'seller_last_read_message_id' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Store, $this>
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * @return HasMany<StoreMessage, $this>
     */
    public function messages(): HasMany
    {
        return $this->hasMany(StoreMessage::class, 'conversation_id');
    }

    /**
     * @return HasOne<StoreMessage, $this>
     */
    public function latestMessage(): HasOne
    {
        return $this->hasOne(StoreMessage::class, 'conversation_id')->latestOfMany();
    }

    public function isStoreOwner(User $user): bool
    {
        $this->loadMissing('store:id,user_id');

        return $this->store !== null && $this->store->user_id === $user->id;
    }

    public function hasParticipant(User $user): bool
    {
        return $this->buyer_id === $user->id || $this->isStoreOwner($user);
    }

    public function markReadBy(User $user, ?int $upToMessageId = null): void
    {
        $latestId = $upToMessageId ?? (int) ($this->messages()->max('id') ?? 0);
        if ($latestId <= 0) {
            return;
        }

        $column = $this->isStoreOwner($user)
            ? 'seller_last_read_message_id'
            : 'buyer_last_read_message_id';

        if ((int) $this->{$column} < $latestId) {
            $this->forceFill([$column => $latestId])->save();
        }
    }

    public function unreadCountFor(User $user): int
    {
        $lastReadId = $this->isStoreOwner($user)
            ? (int) $this->seller_last_read_message_id
            : (int) $this->buyer_last_read_message_id;

        return $this->messages()
            ->where('sender_id', '!=', $user->id)
            ->where('id', '>', $lastReadId)
            ->count();
    }

    public static function totalUnreadFor(User $user): int
    {
        $user->loadMissing('store:id,user_id');
        $storeId = $user->store?->id;

        return StoreMessage::query()
            ->join('store_conversations', 'store_conversations.id', '=', 'store_messages.conversation_id')
            ->where('store_messages.sender_id', '!=', $user->id)
            ->where(function ($query) use ($user, $storeId): void {
                $query->where(function ($buyerQuery) use ($user): void {
                    $buyerQuery->where('store_conversations.buyer_id', $user->id)
                        ->whereColumn('store_messages.id', '>', 'store_conversations.buyer_last_read_message_id');
                });

                if ($storeId !== null) {
                    $query->orWhere(function ($sellerQuery) use ($storeId): void {
                        $sellerQuery->where('store_conversations.store_id', $storeId)
                            ->whereColumn('store_messages.id', '>', 'store_conversations.seller_last_read_message_id');
                    });
                }
            })
            ->count();
    }
}
