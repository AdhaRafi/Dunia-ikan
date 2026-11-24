<?php

namespace Database\Factories;

use App\Models\StoreConversation;
use App\Models\StoreMessage;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StoreMessage>
 */
class StoreMessageFactory extends Factory
{
    protected $model = StoreMessage::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'conversation_id' => StoreConversation::factory(),
            'sender_id' => User::factory(),
            'product_id' => null,
            'message' => fake()->sentence(),
            'image_path' => null,
        ];
    }
}
