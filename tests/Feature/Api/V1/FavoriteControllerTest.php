<?php

namespace Tests\Feature\Api\V1;

use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FavoriteControllerTest extends TestCase
{
    use RefreshDatabase;

    private function createProduct(bool $active = true): Product
    {
        $seller = User::factory()->create(['role' => 'seller']);
        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'Reef Studio',
            'slug' => 'reef-studio-'.$seller->id,
            'city' => 'Jakarta Selatan',
            'province' => 'DKI Jakarta',
            'address' => 'Jl. Kemang No. 8',
            'phone' => '081200001111',
            'is_active' => true,
        ]);
        $category = Category::create([
            'name' => 'Ikan Hias',
            'slug' => 'ikan-hias-'.$seller->id,
        ]);

        return Product::create([
            'store_id' => $store->id,
            'category_id' => $category->id,
            'name' => 'Cupang Plakat Koi',
            'slug' => 'cupang-plakat-koi-'.$seller->id,
            'description' => 'Varian koi galaxy sehat.',
            'price' => 175000,
            'stock' => 4,
            'image' => '/images/products/cupang-plakat.jpg',
            'is_active' => $active,
        ]);
    }

    public function test_favorites_endpoints_return_401_when_unauthenticated(): void
    {
        $this->getJson('/api/v1/favorites')->assertUnauthorized();
        $this->postJson('/api/v1/favorites/toggle', ['product_id' => 1])->assertUnauthorized();
    }

    public function test_authenticated_user_can_toggle_and_list_favorites(): void
    {
        $buyer = User::factory()->create(['role' => 'buyer']);
        $token = $buyer->createToken('mobile')->plainTextToken;
        $product = $this->createProduct();

        $addResponse = $this->withToken($token)->postJson('/api/v1/favorites/toggle', [
            'product_id' => $product->id,
        ]);

        $addResponse->assertOk()
            ->assertJsonPath('favorited', true)
            ->assertJsonPath('product_id', $product->id);

        $this->assertDatabaseHas('favorites', [
            'user_id' => $buyer->id,
            'product_id' => $product->id,
        ]);

        $listResponse = $this->withToken($token)->getJson('/api/v1/favorites');
        $listResponse->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', $product->slug)
            ->assertJsonPath('product_ids.0', $product->id);

        $removeResponse = $this->withToken($token)->postJson('/api/v1/favorites/toggle', [
            'product_id' => $product->id,
        ]);

        $removeResponse->assertOk()
            ->assertJsonPath('favorited', false)
            ->assertJsonPath('product_id', $product->id);

        $this->assertDatabaseMissing('favorites', [
            'user_id' => $buyer->id,
            'product_id' => $product->id,
        ]);
    }

    public function test_toggle_returns_422_for_inactive_product(): void
    {
        $buyer = User::factory()->create(['role' => 'buyer']);
        $token = $buyer->createToken('mobile')->plainTextToken;
        $inactiveProduct = $this->createProduct(active: false);

        $response = $this->withToken($token)->postJson('/api/v1/favorites/toggle', [
            'product_id' => $inactiveProduct->id,
        ]);

        $response->assertUnprocessable()
            ->assertJsonPath('message', 'Produk atau toko sedang tidak aktif.');

        $this->assertDatabaseCount('favorites', 0);
    }
}
