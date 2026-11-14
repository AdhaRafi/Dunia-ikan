<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class MidtransTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_buyer_can_request_snap_token_for_order(): void
    {
        $buyer = User::where('role', 'buyer')->first();
        $store = Store::first();
        $product = Product::first();

        $order = Order::create([
            'order_number' => 'DI-TEST-12345',
            'buyer_id' => $buyer->id,
            'store_id' => $store->id,
            'status' => 'pending_payment',
            'payment_method' => 'midtrans',
            'payment_status' => 'unpaid',
            'total_product_amount' => 50000,
            'shipping_cost' => 20000,
            'grand_total' => 70000,
            'shipping_recipient_name' => 'Budi Tester',
            'shipping_phone' => '081234567890',
            'shipping_city' => 'Bandung',
            'shipping_address' => 'Jl. Ikan Hias No. 1',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'price' => 50000,
            'quantity' => 1,
            'subtotal' => 50000,
        ]);

        Http::fake([
            'https://app.sandbox.midtrans.com/snap/v1/transactions' => Http::response([
                'token' => 'mock-snap-token-xyz',
                'redirect_url' => 'https://app.sandbox.midtrans.com/snap/v4/redirection/mock',
            ], 201),
        ]);

        $response = $this->actingAs($buyer)->postJson("/orders/{$order->order_number}/snap-token");

        $response->assertStatus(200);
        $response->assertJson([
            'snap_token' => 'mock-snap-token-xyz',
        ]);

        $this->assertEquals('mock-snap-token-xyz', $order->fresh()->snap_token);
    }

    public function test_midtrans_webhook_verifies_payment_with_valid_signature(): void
    {
        $buyer = User::where('role', 'buyer')->first();
        $store = Store::first();

        $order = Order::create([
            'order_number' => 'DI-WEBHOOK-999',
            'buyer_id' => $buyer->id,
            'store_id' => $store->id,
            'status' => 'pending_payment',
            'payment_method' => 'midtrans',
            'payment_status' => 'unpaid',
            'total_product_amount' => 100000,
            'shipping_cost' => 20000,
            'grand_total' => 120000,
            'shipping_recipient_name' => 'Budi Tester',
            'shipping_phone' => '081234567890',
            'shipping_city' => 'Bandung',
            'shipping_address' => 'Jl. Ikan Hias No. 1',
        ]);

        $serverKey = config('services.midtrans.server_key');
        $orderId = $order->order_number;
        $statusCode = '200';
        $grossAmount = '120000.00';
        $signature = hash('sha512', $orderId.$statusCode.$grossAmount.$serverKey);

        $payload = [
            'order_id' => $orderId,
            'status_code' => $statusCode,
            'gross_amount' => $grossAmount,
            'signature_key' => $signature,
            'transaction_status' => 'settlement',
            'payment_type' => 'qris',
        ];

        $response = $this->postJson('/midtrans/notification', $payload);

        $response->assertStatus(200);
        $response->assertJson(['status' => 'OK']);

        $this->assertEquals('verified', $order->fresh()->payment_status);
        $this->assertEquals('processing', $order->fresh()->status);
    }

    public function test_midtrans_webhook_rejects_invalid_signature(): void
    {
        $payload = [
            'order_id' => 'DI-FAKE-000',
            'status_code' => '200',
            'gross_amount' => '100000',
            'signature_key' => 'invalid-signature-hash',
            'transaction_status' => 'settlement',
        ];

        $response = $this->postJson('/midtrans/notification', $payload);

        $response->assertStatus(403);
    }
}
