<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\FishGuide;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MarketplaceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_homepage_loads_successfully_with_data(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    public function test_catalog_can_be_filtered(): void
    {
        $response = $this->get('/products?category=ikan-hias&water_type=freshwater&sex=male');
        $response->assertStatus(200);
    }

    public function test_product_detail_page_loads_with_fish_morph_details(): void
    {
        $product = Product::whereHas('fishDetail')->first();
        $response = $this->get("/products/{$product->slug}");
        $response->assertStatus(200);
    }

    public function test_buyer_can_add_item_to_cart_with_stock_validation(): void
    {
        $buyer = User::where('role', 'buyer')->first();
        $product = Product::where('stock', '>', 2)->first();

        $response = $this->actingAs($buyer)->post('/cart', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('cart_items', [
            'user_id' => $buyer->id,
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        // Attempt to exceed stock
        $excessResponse = $this->actingAs($buyer)->post('/cart', [
            'product_id' => $product->id,
            'quantity' => 9999,
        ]);
        $excessResponse->assertSessionHas('error');
    }

    public function test_checkout_creates_orders_per_store_and_decrements_stock(): void
    {
        $buyer = User::where('role', 'buyer')->first();
        $address = Address::where('user_id', $buyer->id)->first();
        $product = Product::where('stock', '>', 5)->first();
        $initialStock = $product->stock;

        $this->actingAs($buyer)->post('/cart', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $checkoutResponse = $this->actingAs($buyer)->post('/checkout', [
            'address_id' => $address->id,
            'payment_method' => 'bank_transfer',
            'shipping_notes' => 'Tolong box styrofoam tebal',
        ]);

        $this->assertDatabaseHas('orders', [
            'buyer_id' => $buyer->id,
            'store_id' => $product->store_id,
            'payment_method' => 'bank_transfer',
            'status' => 'pending_payment',
        ]);

        // Assert stock decremented
        $this->assertEquals($initialStock - 2, $product->fresh()->stock);

        // Assert cart cleared
        $this->assertDatabaseMissing('cart_items', [
            'user_id' => $buyer->id,
        ]);
    }

    public function test_chatbot_returns_guides_and_recommendations(): void
    {
        $response = $this->postJson('/chatbot/message', [
            'message' => 'Ikan cupang saya ada bintik putih di sirip',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'session_token',
            'assistant_message',
            'matching_guides',
            'recommended_products',
        ]);
    }

    public function test_unauthorized_user_cannot_access_seller_or_admin_routes(): void
    {
        $buyer = User::where('role', 'buyer')->first();

        // Buyer trying to access admin
        $adminResponse = $this->actingAs($buyer)->get('/admin');
        $adminResponse->assertStatus(403);

        // Buyer trying to access seller products
        $sellerResponse = $this->actingAs($buyer)->get('/seller/products');
        $sellerResponse->assertStatus(403);
    }

    public function test_catalog_search_supports_fish_tools_and_plants(): void
    {
        foreach (['cupang', 'filter', 'alat', 'tumbuhan'] as $term) {
            $response = $this->get("/products?q={$term}");
            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => $page
                ->component('Products/Index')
                ->where('products.total', fn ($total) => $total > 0)
            );
        }
    }

    public function test_seller_can_upload_preserve_and_remove_store_profile_photo(): void
    {
        Storage::fake('public');

        $seller = User::where('role', 'seller')->first();
        $store = $seller->store;

        $payload = [
            'name' => $store->name,
            'city' => $store->city,
            'province' => $store->province,
            'address' => $store->address,
            'phone' => $store->phone,
            'description' => $store->description,
        ];

        $this->actingAs($seller)->post('/seller/store', [
            ...$payload,
            'logo' => UploadedFile::fake()->image('store-logo.png', 300, 300),
        ])->assertRedirect();

        $store->refresh();
        $this->assertNotNull($store->logo);
        Storage::disk('public')->assertExists($store->logo);
        $this->assertEquals('/storage/'.$store->logo, $store->logo_url);

        // Updating other fields without a new logo must keep the uploaded logo
        $savedPath = $store->logo;
        $this->actingAs($seller)->post('/seller/store', [
            ...$payload,
            'description' => 'Deskripsi diperbarui',
        ])->assertRedirect();

        $store->refresh();
        $this->assertEquals($savedPath, $store->logo);

        // Homepage exposes logo_url for featured stores
        $this->get('/')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Welcome')
                ->where('featuredStores.0.logo_url', '/storage/'.$savedPath)
            );

        // Removing logo clears it cleanly
        $this->actingAs($seller)->post('/seller/store', [
            ...$payload,
            'remove_logo' => true,
        ])->assertRedirect();

        $store->refresh();
        $this->assertNull($store->logo);
        $this->assertNull($store->logo_url);
        Storage::disk('public')->assertMissing($savedPath);
    }

    public function test_buyers_can_rate_stores_and_product_detail_exposes_store_rating(): void
    {
        $product = Product::with('store')->whereHas('fishDetail')->first();
        $store = $product->store;
        $buyer = User::where('role', 'buyer')->first();
        $owner = $store->user;

        // Guest cannot post a review
        $this->post("/stores/{$store->slug}/reviews", [
            'rating' => 5,
            'comment' => 'Mantap',
        ])->assertRedirect('/login');

        // Store owner cannot rate their own store
        $this->actingAs($owner)->post("/stores/{$store->slug}/reviews", [
            'rating' => 5,
            'comment' => 'Toko saya sendiri',
        ])->assertSessionHas('error');

        $this->assertDatabaseMissing('store_reviews', [
            'store_id' => $store->id,
            'user_id' => $owner->id,
        ]);

        // Buyer submits a valid rating
        $this->actingAs($buyer)->post("/stores/{$store->slug}/reviews", [
            'rating' => 4,
            'comment' => 'Ikan datang lincah dan packing aman.',
        ])->assertSessionHas('success');

        $this->assertDatabaseHas('store_reviews', [
            'store_id' => $store->id,
            'user_id' => $buyer->id,
            'rating' => 4,
        ]);

        // Buyer can update their existing rating cleanly
        $this->actingAs($buyer)->post("/stores/{$store->slug}/reviews", [
            'rating' => 5,
            'comment' => 'Update setelah 2 hari ikan tetap sehat!',
        ])->assertSessionHas('success');

        $this->assertDatabaseHas('store_reviews', [
            'store_id' => $store->id,
            'user_id' => $buyer->id,
            'rating' => 5,
            'comment' => 'Update setelah 2 hari ikan tetap sehat!',
        ]);

        // Invalid rating is rejected
        $this->actingAs($buyer)->post("/stores/{$store->slug}/reviews", [
            'rating' => 6,
        ])->assertSessionHasErrors('rating');

        // Product detail & store pages return storeRating props cleanly
        $this->actingAs($buyer)->get("/products/{$product->slug}")
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Products/Show')
                ->where('storeRating.canReview', true)
                ->where('storeRating.userReview.rating', 5)
                ->where('storeRating.count', fn ($c) => $c >= 1)
            );
    }

    public function test_guides_hub_and_detail_pages_render_with_category_counts_and_search(): void
    {
        $this->get('/guides')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Guides/Index')
                ->where('totalGuides', fn ($total) => $total >= 4)
                ->has('categories')
                ->has('categoryCounts')
                ->where('guides.data', fn ($items) => count($items) >= 1)
            );

        $this->get('/guides?q=parasit')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Guides/Index')
                ->where('guides.total', fn ($total) => $total >= 1)
            );

        $guideId = FishGuide::where('is_active', true)->value('id');

        $this->get("/guides/{$guideId}")
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Guides/Show')
                ->where('guide.id', $guideId)
            );
    }
}
