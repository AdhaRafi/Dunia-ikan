<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\FishGuide;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Filament\Auth\Pages\Login as FilamentLogin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
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

        // Buyer logged in on web guard trying to reach /admin gets sent to separate admin login
        $this->actingAs($buyer)->get('/admin')->assertRedirect('/admin/login');

        // Buyer cannot authenticate into /admin panel even on admin guard, and cannot access /admin-portal
        $this->actingAs($buyer, 'admin')->get('/admin')->assertStatus(403);
        $this->actingAs($buyer)->get('/admin-portal')->assertStatus(403);

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

    public function test_live_visitor_stats_resist_incognito_bot_and_ip_flood_abuse(): void
    {
        $this->withHeaders(['User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0'])
            ->get('/')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->where('visitorStats.today', 1)
                ->where('visitorStats.month', 1)
                ->where('visitorStats.year', 1)
            );

        // Same session on subsequent navigation should not inflate today's count
        $this->withHeaders(['User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0'])
            ->get('/products')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->where('visitorStats.today', 1)
                ->where('visitorStats.month', 1)
                ->where('visitorStats.year', 1)
            );

        // Clearing cookies / opening Incognito from same IP + User-Agent does NOT inflate count
        $this->flushSession();
        $this->withHeaders(['User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0'])
            ->get('/')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->where('visitorStats.today', 1)
                ->where('visitorStats.month', 1)
                ->where('visitorStats.year', 1)
            );

        // Crawlers and CLI HTTP clients (e.g. Googlebot, curl) are ignored
        $this->flushSession();
        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.5'])
            ->withHeaders(['User-Agent' => 'curl/8.5.0'])
            ->get('/')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page->where('visitorStats.today', 1));

        // A genuinely distinct visitor IP increments all three counters live
        $this->flushSession();
        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.10'])
            ->withHeaders(['User-Agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)'])
            ->get('/')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->where('visitorStats.today', 2)
                ->where('visitorStats.month', 2)
                ->where('visitorStats.year', 2)
            );

        // Rotating fake User-Agents from a single flood IP is capped at 10 per day
        for ($i = 1; $i <= 12; $i++) {
            $this->flushSession();
            $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.7'])
                ->withHeaders(['User-Agent' => "CustomBrowser/{$i}.0"])
                ->get('/')
                ->assertStatus(200);
        }

        $this->flushSession();
        $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.8'])
            ->withHeaders(['User-Agent' => 'curl/8.5.0'])
            ->get('/')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->where('visitorStats.today', 12)
                ->where('visitorStats.month', 12)
                ->where('visitorStats.year', 12)
            );
    }

    public function test_cod_checkout_skips_pending_payment_blocks_midtrans_and_verifies_on_delivery(): void
    {
        $buyer = User::where('role', 'buyer')->first();
        $address = Address::where('user_id', $buyer->id)->first();
        $product = Product::where('stock', '>', 5)->with('store.user')->first();
        $seller = $product->store->user;

        $this->actingAs($buyer)->post('/cart', [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $response = $this->actingAs($buyer)->post('/checkout', [
            'address_id' => $address->id,
            'payment_method' => 'cod',
        ]);

        $order = Order::where('buyer_id', $buyer->id)->latest('id')->first();
        $this->assertNotNull($order);
        $this->assertSame('cod', $order->payment_method);
        $this->assertSame('processing', $order->status);
        $this->assertSame('unpaid', $order->payment_status);
        $response->assertRedirect(route('orders.show', $order->order_number));

        $this->actingAs($buyer)
            ->postJson("/orders/{$order->order_number}/snap-token")
            ->assertStatus(400)
            ->assertJsonPath('message', 'Pesanan COD dibayar tunai saat kurir tiba dan tidak menggunakan pembayaran Midtrans.');

        $this->actingAs($seller)
            ->post("/seller/orders/{$order->id}/shipping", [
                'shipping_courier' => 'Kurir Toko',
                'shipping_tracking_number' => 'COD-RESI-001',
            ])
            ->assertSessionHas('success');

        $this->actingAs($buyer)
            ->post("/orders/{$order->order_number}/confirm")
            ->assertSessionHas('success');

        $order->refresh();
        $this->assertSame('delivered', $order->status);
        $this->assertSame('verified', $order->payment_status);
    }

    public function test_manual_qris_checkout_requires_store_qris_image(): void
    {
        $buyer = User::where('role', 'buyer')->firstOrFail();
        $address = Address::where('user_id', $buyer->id)->firstOrFail();
        $product = Product::where('stock', '>', 5)->with('store')->firstOrFail();
        $store = $product->store;
        $store->update(['qris_image' => null]);

        $this->actingAs($buyer)->post('/cart', [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $this->actingAs($buyer)
            ->get('/checkout')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page->where('supportsManualQris', false));

        $this->actingAs($buyer)
            ->post('/checkout', [
                'address_id' => $address->id,
                'payment_method' => 'qris',
            ])
            ->assertSessionHas('error');

        $store->update(['qris_image' => 'stores/qris/sample.png']);

        $this->actingAs($buyer)
            ->get('/checkout')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page->where('supportsManualQris', true));

        $this->actingAs($buyer)
            ->post('/checkout', [
                'address_id' => $address->id,
                'payment_method' => 'qris',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('orders', [
            'buyer_id' => $buyer->id,
            'store_id' => $store->id,
            'payment_method' => 'qris',
            'status' => 'pending_payment',
        ]);
    }

    public function test_custom_inertia_error_pages_render_for_404_and_403_html_requests(): void
    {
        $this->get('/halaman-yang-tidak-pernah-ada')
            ->assertStatus(404)
            ->assertInertia(fn ($page) => $page
                ->component('Errors/HttpError')
                ->where('status', 404)
            );

        $this->get('/products/ikan-fiktif-404')
            ->assertStatus(404)
            ->assertInertia(fn ($page) => $page
                ->component('Errors/HttpError')
                ->where('status', 404)
            );

        $buyer = User::where('role', 'buyer')->firstOrFail();
        $this->actingAs($buyer)
            ->get('/admin-portal')
            ->assertStatus(403)
            ->assertInertia(fn ($page) => $page
                ->component('Errors/HttpError')
                ->where('status', 403)
            );

        $this->getJson('/api/tidak-ada')->assertStatus(404)->assertJsonStructure(['message']);
    }

    public function test_admin_can_log_in_separately_while_buyer_session_remains_active(): void
    {
        $buyer = User::where('role', 'buyer')->firstOrFail();
        $admin = User::where('role', 'admin')->firstOrFail();

        // Log in as buyer on default web guard
        $this->post('/login', [
            'email' => $buyer->email,
            'password' => 'password',
        ])->assertRedirect(route('dashboard', absolute: false));

        $this->assertAuthenticatedAs($buyer, 'web');

        // Buyer visiting /admin is prompted to sign in at /admin/login instead of 403
        $this->get('/admin')->assertRedirect('/admin/login');
        $this->get('/admin/login')->assertStatus(200);

        // Log into admin panel via Filament Livewire login while web buyer remains logged in
        Livewire::test(FilamentLogin::class)
            ->fillForm([
                'email' => $admin->email,
                'password' => 'password',
            ])
            ->call('authenticate')
            ->assertHasNoFormErrors();

        $this->assertAuthenticatedAs($admin, 'admin');
        $this->assertAuthenticatedAs($buyer, 'web');

        // Both admin panels and buyer storefront routes work concurrently
        $this->get('/admin')->assertStatus(200);
        $this->get('/admin-portal')->assertStatus(200);
        $this->get('/orders')->assertStatus(200);

        // Logging out of admin keeps the buyer web session intact
        $this->post('/admin/logout')->assertRedirect('/admin/login');
        $this->assertGuest('admin');
        $this->assertAuthenticatedAs($buyer, 'web');
    }
}
