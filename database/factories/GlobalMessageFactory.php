<?php

namespace Database\Factories;

use App\Models\GlobalMessage;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GlobalMessage>
 */
class GlobalMessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'reply_to_id' => null,
            'message' => fake()->sentence(),
            'image_path' => null,
        ];
    }
}
