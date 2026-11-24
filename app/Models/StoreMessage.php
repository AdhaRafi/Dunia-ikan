<?php

namespace App\Models;

use Database\Factories\StoreMessageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoreMessage extends Model
{
    /** @use HasFactory<StoreMessageFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'conversation_id',
        'sender_id',
        'product_id',
        'message',
        'image_path',
    ];

    /**
     * @return BelongsTo<StoreConversation, $this>
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(StoreConversation::class, 'conversation_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image_path) {
            return null;
        }

        if (str_starts_with($this->image_path, 'http') || str_starts_with($this->image_path, '/')) {
            return $this->image_path;
        }

        return '/storage/'.ltrim($this->image_path, '/');
    }
}
