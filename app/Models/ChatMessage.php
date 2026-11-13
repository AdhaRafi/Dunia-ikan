<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ChatMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'chat_session_id',
        'sender',
        'message',
        'image_path',
        'recommended_products',
    ];

    protected function casts(): array
    {
        return [
            'recommended_products' => 'array',
        ];
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(ChatSession::class, 'chat_session_id');
    }

    public function fishGuides(): BelongsToMany
    {
        return $this->belongsToMany(FishGuide::class, 'chat_message_fish_guide');
    }
}
