<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class FishGuide extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'fish_type',
        'category',
        'symptoms',
        'possible_causes',
        'care_instructions',
        'prevention',
        'source',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function chatMessages(): BelongsToMany
    {
        return $this->belongsToMany(ChatMessage::class, 'chat_message_fish_guide');
    }
}
