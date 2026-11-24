<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Store;
use App\Models\StoreConversation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class StoreChatTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_guest_is_redirected_to_login_from_store_chat_endpoints(): void
    {
        $store = Store::where('is_active', true)->firstOrFail();

        $this->get('/chat')->assertRedirect('/login');
        $this->post("/stores/{$store->slug}/chat")->assertRedirect('/login');
    }

    public function test_buyer_can_start_store_chat_with_product_context_and_send_messages(): void
    {
        $buyer = User::where('role', 'buyer')->firstOrFail();
        $product = Product::with('store')->whereHas('store', fn ($q) => $q->where('is_active', true))->firstOrFail();
        $store = $product->store;

        $startResponse = $this->actingAs($buyer)->post("/stores/{$store->slug}/chat", [
            'product_id' => $product->id,
        ]);

        $conversation = StoreConversation::where('store_id', $store->id)
            ->where('buyer_id', $buyer->id)
            ->first();

        $this->assertNotNull($conversation);
        $this->assertSame($product->id, $conversation->product_id);
        $startResponse->assertRedirect(route('chat.index', ['conversation' => $conversation->id]));

        // Starting again reuses the existing single conversation per buyer + store
        $this->actingAs($buyer)->post("/stores/{$store->slug}/chat");
        $this->assertSame(
            1,
            StoreConversation::where('store_id', $store->id)->where('buyer_id', $buyer->id)->count(),
        );

        $sendResponse = $this->actingAs($buyer)->postJson("/chat/{$conversation->id}/messages", [
            'message' => 'Halo kak, apakah stok ikan ini siap kirim hari ini?',
            'product_id' => $product->id,
        ]);

        $sendResponse
            ->assertCreated()
            ->assertJsonPath('status', 'created')
            ->assertJsonPath('message.message', 'Halo kak, apakah stok ikan ini siap kirim hari ini?')
            ->assertJsonPath('message.product.id', $product->id);

        $this->assertDatabaseHas('store_messages', [
            'conversation_id' => $conversation->id,
            'sender_id' => $buyer->id,
            'product_id' => $product->id,
            'message' => 'Halo kak, apakah stok ikan ini siap kirim hari ini?',
        ]);
    }

    public function test_seller_receives_unread_count_can_reply_and_buyer_polls_new_messages(): void
    {
        $buyer = User::where('role', 'buyer')->firstOrFail();
        $store = Store::with('user')->where('is_active', true)->firstOrFail();
        $seller = $store->user;

        $conversation = StoreConversation::create([
            'store_id' => $store->id,
            'buyer_id' => $buyer->id,
            'last_message_at' => now(),
        ]);

        $buyerSend = $this->actingAs($buyer)->postJson("/chat/{$conversation->id}/messages", [
            'message' => 'Bisa kirim ke Bandung pakai packing oksigen?',
        ])->assertCreated();

        $firstMessageId = (int) $buyerSend->json('message.id');

        $this->assertSame(1, StoreConversation::totalUnreadFor($seller));
        $this->assertSame(0, StoreConversation::totalUnreadFor($buyer));

        // Opening inbox marks active thread read for seller
        $this->actingAs($seller)
            ->get("/chat?conversation={$conversation->id}")
            ->assertOk();

        $this->assertSame(0, StoreConversation::totalUnreadFor($seller));

        // Seller replies
        $sellerSend = $this->actingAs($seller)->postJson("/chat/{$conversation->id}/messages", [
            'message' => 'Bisa kak, ready packing double oksigen dan garansi DOA.',
        ])->assertCreated();

        $sellerMessageId = (int) $sellerSend->json('message.id');
        $this->assertSame(1, StoreConversation::totalUnreadFor($buyer));

        // Buyer polls newer messages after firstMessageId
        $pollResponse = $this->actingAs($buyer)
            ->getJson("/chat/{$conversation->id}/messages?after_id={$firstMessageId}")
            ->assertOk()
            ->assertJsonCount(1, 'messages')
            ->assertJsonPath('messages.0.id', $sellerMessageId)
            ->assertJsonPath('messages.0.is_store_sender', true)
            ->assertJsonPath('unread_total', 0);

        $this->assertSame(0, StoreConversation::totalUnreadFor($buyer));
        $this->assertNotEmpty($pollResponse->json('conversations'));
    }

    public function test_buyer_can_send_photo_attachment_in_store_chat(): void
    {
        Storage::fake('public');

        $buyer = User::where('role', 'buyer')->firstOrFail();
        $store = Store::where('is_active', true)->firstOrFail();

        $conversation = StoreConversation::create([
            'store_id' => $store->id,
            'buyer_id' => $buyer->id,
            'last_message_at' => now(),
        ]);

        $response = $this->actingAs($buyer)->post("/chat/{$conversation->id}/messages", [
            'image' => UploadedFile::fake()->image('tank.png', 200, 200),
        ], ['Accept' => 'application/json']);

        $response
            ->assertCreated()
            ->assertJsonPath('status', 'created');

        $this->assertNotNull($response->json('message.image_url'));
    }

    public function test_store_owner_cannot_start_buyer_chat_with_own_store(): void
    {
        $store = Store::with('user')->where('is_active', true)->firstOrFail();
        $seller = $store->user;

        $response = $this->actingAs($seller)->post("/stores/{$store->slug}/chat");

        $response
            ->assertRedirect(route('chat.index', ['tab' => 'store']))
            ->assertSessionHas('error');

        $this->assertDatabaseMissing('store_conversations', [
            'store_id' => $store->id,
            'buyer_id' => $seller->id,
        ]);
    }

    public function test_unrelated_user_cannot_read_or_send_in_another_conversation(): void
    {
        $buyer = User::where('role', 'buyer')->firstOrFail();
        $store = Store::where('is_active', true)->firstOrFail();
        $outsider = User::factory()->create(['role' => 'buyer']);

        $conversation = StoreConversation::create([
            'store_id' => $store->id,
            'buyer_id' => $buyer->id,
            'last_message_at' => now(),
        ]);

        $this->actingAs($outsider)
            ->getJson("/chat/{$conversation->id}/messages")
            ->assertNotFound();

        $this->actingAs($outsider)
            ->postJson("/chat/{$conversation->id}/messages", [
                'message' => 'Pesan penyusup',
            ])
            ->assertNotFound();

        $this->assertDatabaseMissing('store_messages', [
            'conversation_id' => $conversation->id,
            'sender_id' => $outsider->id,
        ]);
    }

    public function test_validation_rejects_empty_message_without_image(): void
    {
        $buyer = User::where('role', 'buyer')->firstOrFail();
        $store = Store::where('is_active', true)->firstOrFail();

        $conversation = StoreConversation::create([
            'store_id' => $store->id,
            'buyer_id' => $buyer->id,
            'last_message_at' => now(),
        ]);

        $this->actingAs($buyer)
            ->postJson("/chat/{$conversation->id}/messages", [
                'message' => '   ',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['message'])
            ->assertJsonPath('errors.message.0', 'Pesan atau foto tidak boleh kosong.');
    }

    public function test_inactive_store_returns_not_found_when_starting_chat(): void
    {
        $buyer = User::where('role', 'buyer')->firstOrFail();
        $store = Store::where('is_active', true)->firstOrFail();
        $store->update(['is_active' => false]);

        $this->actingAs($buyer)
            ->post("/stores/{$store->slug}/chat")
            ->assertNotFound();
    }
}
