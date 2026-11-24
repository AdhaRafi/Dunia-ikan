<?php

namespace Database\Factories;

use App\Models\Store;
use App\Models\StoreConversation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StoreConversation>
 */
class StoreConversationFactory extends Factory
{
    protected $model = StoreConversation::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'store_id' => Store::factory(),
            'buyer_id' => User::factory(),
            'product_id' => null,
            'last_message_at' => now(),
            'buyer_last_read_message_id' => 0,
            'seller_last_read_message_id' => 0,
        ];
    }
}
