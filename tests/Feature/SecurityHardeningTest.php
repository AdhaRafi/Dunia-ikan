<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\CartItem;
use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use App\Services\TurnstileVerifier;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SecurityHardeningTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config([
            'services.midtrans.server_key' => 'SB-Mid-server-SecTestKey',
            'services.midtrans.client_key' => 'SB-Mid-client-SecTestKey',
            'services.midtrans.is_production' => false,
        ]);
        $this->seed();
    }

    public function test_midtrans_finish_cannot_be_forged_by_client_payload(): void
    {
        $buyer = User::where('role', 'buyer')->firstOrFail();
        $store = Store::firstOrFail();
        $order = Order::create([
            'order_number' => 'DI-FORGE-001',
            'buyer_id' => $buyer->id,
            'store_id' => $store->id,
            'status' => 'pending_payment',
            'payment_method' => 'midtrans',
            'payment_status' => 'unpaid',
            'total_product_amount' => 100000,
            'shipping_cost' => 20000,
            'grand_total' => 120000,
            'shipping_recipient_name' => 'Buyer Test',
            'shipping_phone' => '081234567890',
            'shipping_city' => 'Bandung',
            'shipping_address' => 'Jl. Test No. 1',
        ]);

        Http::fake([
            'https://api.sandbox.midtrans.com/v2/DI-FORGE-001/status' => Http::sequence()
                ->push([
                    'transaction_status' => 'pending',
                    'payment_type' => 'qris',
                ], 200)
                ->push([
                    'transaction_status' => 'settlement',
                    'fraud_status' => 'accept',
                    'payment_type' => 'qris',
                ], 200),
        ]);

        // Attacker attempts to bypass payment by spoofing settlement in client payload
        $this->actingAs($buyer)
            ->post('/orders/DI-FORGE-001/midtrans-finish', [
                'result' => [
                    'transaction_status' => 'settlement',
                    'payment_type' => 'qris',
                ],
            ])
            ->assertRedirect();

        $order->refresh();
        $this->assertNotSame('verified', $order->payment_status);
        $this->assertNotSame('processing', $order->status);

        // Once Midtrans server API actually confirms settlement, finish verifies it
        $this->actingAs($buyer)
            ->post('/orders/DI-FORGE-001/midtrans-finish')
            ->assertRedirect();

        $order->refresh();
        $this->assertSame('verified', $order->payment_status);
        $this->assertSame('processing', $order->status);
    }

    public function test_chatbot_blocks_cross_session_token_idor(): void
    {
        $victim = User::where('role', 'buyer')->firstOrFail();
        $attacker = User::factory()->create(['role' => 'buyer']);

        $victimSession = ChatSession::create([
            'user_id' => $victim->id,
            'session_token' => 'victim-secret-chat-token-12345',
            'title' => 'Private Betta Consultation',
        ]);

        ChatMessage::create([
            'chat_session_id' => $victimSession->id,
            'sender' => 'user',
            'message' => 'Rahasia kolam saya',
        ]);

        $historyRes = $this->actingAs($attacker)->getJson('/chatbot/history?session_token=victim-secret-chat-token-12345');
        $historyRes->assertStatus(200);
        $historyRes->assertJsonCount(0, 'messages');
        $this->assertStringNotContainsString('Rahasia kolam saya', $historyRes->getContent());

        $sendRes = $this->actingAs($attacker)->postJson('/chatbot/message', [
            'message' => 'Test inject ke sesi orang lain',
            'session_token' => 'victim-secret-chat-token-12345',
        ]);
        $sendRes->assertStatus(200);
        $this->assertNotSame('victim-secret-chat-token-12345', $sendRes->json('session_token'));
        $this->assertSame(1, $victimSession->messages()->count());
    }

    public function test_public_store_pages_hide_bank_and_street_address_but_expose_to_authorized_buyer(): void
    {
        $store = Store::firstOrFail();
        $product = Product::where('store_id', $store->id)->firstOrFail();

        $homeRes = $this->get('/');
        $homeRes->assertStatus(200);
        $homeRes->assertDontSee($store->bank_account_number);
        $homeRes->assertDontSee($store->address);

        $productRes = $this->get('/products/'.$product->slug);
        $productRes->assertStatus(200);
        $productRes->assertDontSee($store->bank_account_number);
        $productRes->assertDontSee($store->address);

        $storeRes = $this->get('/stores/'.$store->slug);
        $storeRes->assertStatus(200);
        $storeRes->assertDontSee($store->bank_account_number);

        $buyer = User::where('role', 'buyer')->firstOrFail();
        $order = Order::create([
            'order_number' => 'DI-PAY-SHOW-01',
            'buyer_id' => $buyer->id,
            'store_id' => $store->id,
            'status' => 'pending_payment',
            'payment_method' => 'bank_transfer',
            'payment_status' => 'unpaid',
            'total_product_amount' => 50000,
            'shipping_cost' => 20000,
            'grand_total' => 70000,
            'shipping_recipient_name' => 'Buyer Test',
            'shipping_phone' => '081234567890',
            'shipping_city' => 'Bandung',
            'shipping_address' => 'Jl. Test',
        ]);
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'price' => 50000,
            'quantity' => 1,
            'subtotal' => 50000,
        ]);

        $orderRes = $this->actingAs($buyer)->get('/orders/'.$order->order_number);
        $orderRes->assertStatus(200);
        $orderRes->assertSee($store->bank_account_number);
    }

    public function test_registration_and_login_normalize_mixed_case_emails(): void
    {
        $registerResponse = $this->post('/register', [
            'name' => 'Aquarist Uppercase',
            'email' => 'Budi.Uppercase@Example.COM',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'account_type' => 'buyer',
        ]);

        $registerResponse->assertRedirect(route('dashboard', absolute: false));
        $this->assertDatabaseHas('users', [
            'email' => 'budi.uppercase@example.com',
        ]);

        $this->post('/logout');

        $loginResponse = $this->post('/login', [
            'email' => 'BUDI.UPPERCASE@example.com',
            'password' => 'password123',
        ]);

        $this->assertAuthenticated();
        $loginResponse->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_inactive_store_cannot_be_added_to_cart_or_checked_out(): void
    {
        $buyer = User::where('role', 'buyer')->firstOrFail();
        $product = Product::with('store')->firstOrFail();
        $address = Address::where('user_id', $buyer->id)->firstOrFail();

        CartItem::create([
            'user_id' => $buyer->id,
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $product->store->update(['is_active' => false]);

        $this->actingAs($buyer)->post('/cart', [
            'product_id' => $product->id,
            'quantity' => 1,
        ])->assertSessionHas('error');

        $this->actingAs($buyer)->post('/checkout', [
            'address_id' => $address->id,
            'payment_method' => 'bank_transfer',
        ])->assertSessionHas('error');
    }

    public function test_seller_without_store_cannot_trigger_500_on_order_actions_and_verified_orders_are_guarded(): void
    {
        $sellerWithoutStore = User::factory()->create(['role' => 'seller', 'seller_status' => 'approved']);
        $buyer = User::where('role', 'buyer')->firstOrFail();
        $store = Store::firstOrFail();

        $order = Order::create([
            'order_number' => 'DI-STATE-001',
            'buyer_id' => $buyer->id,
            'store_id' => $store->id,
            'status' => 'shipped',
            'payment_method' => 'bank_transfer',
            'payment_status' => 'verified',
            'total_product_amount' => 50000,
            'shipping_cost' => 20000,
            'grand_total' => 70000,
            'shipping_recipient_name' => 'Buyer',
            'shipping_phone' => '08123',
            'shipping_city' => 'Bandung',
            'shipping_address' => 'Jl. Test',
        ]);

        $this->actingAs($sellerWithoutStore)
            ->post("/seller/orders/{$order->id}/verify-payment", ['payment_status' => 'verified'])
            ->assertStatus(403);

        $sellerOwner = $store->user;
        $this->actingAs($sellerOwner)
            ->post("/seller/orders/{$order->id}/verify-payment", ['payment_status' => 'rejected'])
            ->assertSessionHas('error');

        $this->assertSame('verified', $order->fresh()->payment_status);
        $this->assertSame('shipped', $order->fresh()->status);
    }

    public function test_security_headers_sitemap_and_sanctum_endpoints_work(): void
    {
        $home = $this->get('/');
        $home->assertStatus(200);
        $home->assertHeader('X-Content-Type-Options', 'nosniff');
        $home->assertHeader('X-Frame-Options', 'SAMEORIGIN');
        $home->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

        $sitemap = $this->get('/sitemap.xml');
        $sitemap->assertStatus(200);
        $sitemap->assertHeader('Content-Type', 'application/xml; charset=UTF-8');
        $sitemap->assertSee('<urlset', false);
        $sitemap->assertSee('/products', false);

        $this->get('/sanctum/csrf-cookie')->assertStatus(204);
        $this->getJson('/api/health')->assertStatus(200)->assertJson(['status' => 'ok']);
        $this->getJson('/api/user')->assertStatus(401);

        $buyer = User::where('role', 'buyer')->firstOrFail();
        $this->actingAs($buyer)
            ->getJson('/api/user')
            ->assertStatus(200)
            ->assertJsonPath('user.email', $buyer->email);
    }

    public function test_database_seeder_is_idempotent_and_search_filters_stay_scoped(): void
    {
        $userCountBefore = User::count();
        $this->seed();
        $this->assertSame($userCountBefore, User::count());

        $admin = User::where('role', 'admin')->firstOrFail();
        $guideRes = $this->actingAs($admin)->get('/admin-portal/guides?q=white');
        $guideRes->assertStatus(200);

        $productRes = $this->get('/products?q=cupang');
        $productRes->assertStatus(200);
        $productRes->assertSee('Cupang', false);

        $txRes = $this->actingAs($admin)->get('/admin-portal/transactions?q=DI-&status=cancelled');
        $txRes->assertStatus(200);
    }

    public function test_turnstile_verification_enforces_action_hostname_and_fails_closed(): void
    {
        $buyer = User::where('role', 'buyer')->firstOrFail();

        config([
            'services.turnstile.site_key' => '0x4AAAATestSiteKey',
            'services.turnstile.secret_key' => '0x4AAAATestSecretKey',
            'services.turnstile.hostnames' => 'dunia-ikan.vercel.app',
        ]);

        Http::preventStrayRequests();
        Http::fake([
            TurnstileVerifier::VERIFY_URL => Http::sequence()
                ->push([
                    'success' => true,
                    'action' => 'signup',
                    'hostname' => 'dunia-ikan.vercel.app',
                ], 200)
                ->push([
                    'success' => true,
                    'action' => 'login',
                    'hostname' => 'localhost',
                ], 200)
                ->push(['error' => 'upstream-down'], 500)
                ->push([
                    'success' => true,
                    'action' => 'login',
                    'hostname' => 'dunia-ikan.vercel.app',
                ], 200)
                ->push([
                    'success' => true,
                    'action' => 'signup',
                    'hostname' => 'dunia-ikan.vercel.app',
                ], 200),
        ]);

        $this->post('/login', [
            'email' => $buyer->email,
            'password' => 'password',
        ])->assertSessionHasErrors('cf-turnstile-response');
        $this->assertGuest();

        $this->post('/login', [
            'email' => $buyer->email,
            'password' => 'password',
            'cf-turnstile-response' => 'wrong-action-token',
        ])->assertSessionHasErrors('cf-turnstile-response');
        $this->assertGuest();

        $this->post('/login', [
            'email' => $buyer->email,
            'password' => 'password',
            'cf-turnstile-response' => 'disallowed-hostname-token',
        ])->assertSessionHasErrors('cf-turnstile-response');
        $this->assertGuest();

        $this->post('/login', [
            'email' => $buyer->email,
            'password' => 'password',
            'cf-turnstile-response' => 'upstream-error-token',
        ])->assertSessionHasErrors('cf-turnstile-response');
        $this->assertGuest();

        $this->post('/login', [
            'email' => $buyer->email,
            'password' => 'password',
            'cf-turnstile-response' => 'valid-login-token',
        ])->assertRedirect(route('dashboard', absolute: false));
        $this->assertAuthenticatedAs($buyer);

        $this->post('/logout');
        $this->assertGuest();

        $this->post('/register', [
            'name' => 'Turnstile Buyer',
            'email' => 'turnstile-buyer@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'account_type' => 'buyer',
            'cf-turnstile-response' => 'valid-signup-token',
        ])->assertRedirect(route('dashboard', absolute: false));
        $this->assertAuthenticated();
    }

    public function test_chatbot_uses_updated_gemini_flash_model_when_api_key_configured(): void
    {
        config([
            'services.gemini.api_key' => 'AIzaTestGeminiKey',
            'services.gemini.model' => 'gemini-3.8-flash',
        ]);

        Http::preventStrayRequests();
        Http::fake([
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent*' => Http::response([
                'candidates' => [[
                    'content' => [
                        'parts' => [[
                            'text' => 'Halo! Ini jawaban AI Kiko.',
                        ]],
                    ],
                ]],
            ], 200),
        ]);

        $response = $this->postJson('/chatbot/message', [
            'message' => 'Tips merawat ikan cupang agar sehat',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('is_fallback', false)
            ->assertJsonPath('assistant_message.message', 'Halo! Ini jawaban AI Kiko.');
    }
}
