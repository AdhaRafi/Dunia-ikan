<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Favorite;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FavoriteTest extends TestCase
{
    use RefreshDatabase;

    private function createActiveProduct(array $overrides = []): Product
    {
        $seller = User::factory()->create(['role' => 'seller']);
        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'Reef Aquatics',
            'slug' => 'reef-aquatics-'.uniqid(),
            'description' => 'Toko ikan hias',
            'city' => 'Semarang',
            'province' => 'Jawa Tengah',
            'address' => 'Jl. Pemuda No. 8',
            'phone' => '081234567891',
            'is_active' => true,
        ]);

        $category = Category::firstOrCreate(
            ['slug' => 'ikan-hias'],
            ['name' => 'Ikan Hias'],
        );

        return Product::create(array_merge([
            'store_id' => $store->id,
            'category_id' => $category->id,
            'name' => 'Neon Tetra',
            'slug' => 'neon-tetra-'.uniqid(),
            'description' => 'Ikan hias kecil dengan warna cerah dan aktif.',
            'price' => 12000,
            'stock' => 25,
            'image' => '/images/products/neon-tetra.jpg',
            'is_active' => true,
        ], $overrides));
    }

    public function test_guests_see_empty_favorites_and_cannot_toggle(): void
    {
        $product = $this->createActiveProduct();

        $this->get('/favorites')
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Favorites/Index')
                ->has('favorites', 0)
                ->where('favoriteIds', [])
            );

        $this->post('/favorites/toggle', ['product_id' => $product->id])
            ->assertRedirect('/login');

        $this->postJson('/favorites/toggle', ['product_id' => $product->id])
            ->assertStatus(401);
    }

    public function test_authenticated_user_can_toggle_favorite_and_view_favorites_page(): void
    {
        $buyer = User::factory()->create(['role' => 'buyer']);
        $product = $this->createActiveProduct(['name' => 'Zebra Danio Klasik', 'price' => 24000]);

        $this->actingAs($buyer)
            ->post('/favorites/toggle', ['product_id' => $product->id])
            ->assertRedirect();

        $this->assertDatabaseHas('favorites', [
            'user_id' => $buyer->id,
            'product_id' => $product->id,
        ]);

        $this->actingAs($buyer)
            ->get('/favorites')
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Favorites/Index')
                ->has('favorites', 1)
                ->where('favorites.0.product.name', 'Zebra Danio Klasik')
                ->where('favoriteIds', [$product->id])
            );

        $this->actingAs($buyer)
            ->post('/favorites/toggle', ['product_id' => $product->id])
            ->assertRedirect();

        $this->assertDatabaseMissing('favorites', [
            'user_id' => $buyer->id,
            'product_id' => $product->id,
        ]);
    }

    public function test_favorites_are_isolated_per_user_and_reject_inactive_additions(): void
    {
        $alice = User::factory()->create(['role' => 'buyer']);
        $bob = User::factory()->create(['role' => 'buyer']);
        $activeProduct = $this->createActiveProduct(['name' => 'Manfish Angel']);
        $inactiveProduct = $this->createActiveProduct(['name' => 'Ikan Nonaktif', 'is_active' => false]);

        $this->actingAs($alice)
            ->postJson('/favorites/toggle', ['product_id' => $activeProduct->id])
            ->assertStatus(200)
            ->assertJson([
                'favorited' => true,
                'product_id' => $activeProduct->id,
            ]);

        $this->actingAs($bob)
            ->get('/favorites')
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Favorites/Index')
                ->has('favorites', 0)
                ->where('favoriteIds', [])
            );

        $this->actingAs($bob)
            ->postJson('/favorites/toggle', ['product_id' => $inactiveProduct->id])
            ->assertStatus(422);

        // User can still unfavorite a product that was later deactivated.
        Favorite::create(['user_id' => $bob->id, 'product_id' => $inactiveProduct->id]);
        $this->actingAs($bob)
            ->postJson('/favorites/toggle', ['product_id' => $inactiveProduct->id])
            ->assertStatus(200)
            ->assertJson(['favorited' => false]);

        $this->assertDatabaseMissing('favorites', [
            'user_id' => $bob->id,
            'product_id' => $inactiveProduct->id,
        ]);
    }

    public function test_toggling_favorite_lazily_migrates_favorites_table_when_missing(): void
    {
        $buyer = User::factory()->create(['role' => 'buyer']);
        $product = $this->createActiveProduct(['name' => 'Ikan Mas Oranda']);

        Schema::dropIfExists('favorites');
        DB::table('migrations')
            ->where('migration', '2026_11_19_064948_create_favorites_table')
            ->delete();

        $this->assertFalse(Schema::hasTable('favorites'));

        $this->actingAs($buyer)
            ->postJson('/favorites/toggle', ['product_id' => $product->id])
            ->assertStatus(200)
            ->assertJson([
                'favorited' => true,
                'product_id' => $product->id,
            ]);

        $this->assertTrue(Schema::hasTable('favorites'));
        $this->assertDatabaseHas('favorites', [
            'user_id' => $buyer->id,
            'product_id' => $product->id,
        ]);
    }
}
