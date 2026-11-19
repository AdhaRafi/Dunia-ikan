<?php

namespace Tests\Feature;

use App\Models\GlobalMessage;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class GlobalChatTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_can_view_community_chat_without_leaking_sender_pii(): void
    {
        $seller = User::factory()->create([
            'name' => 'Budi Breeder',
            'email' => 'secret-budi@example.com',
            'phone' => '081299998888',
            'role' => 'seller',
        ]);

        Store::create([
            'user_id' => $seller->id,
            'name' => 'Reef Nusantara Farm',
            'slug' => 'reef-nusantara-farm',
            'description' => 'Toko ikan hias',
            'city' => 'Semarang',
            'province' => 'Jawa Tengah',
            'address' => 'Jl. Pandanaran No. 12',
            'phone' => '081234567890',
            'is_active' => true,
        ]);

        GlobalMessage::factory()->create([
            'user_id' => $seller->id,
            'message' => 'Selamat datang di obrolan aquarist Indonesia!',
        ]);

        $page = $this->get('/community');
        $page->assertStatus(200)
            ->assertInertia(fn (Assert $inertia) => $inertia
                ->component('Community/Index')
                ->has('initialMessages', 1)
                ->where('initialMessages.0.user.name', 'Budi Breeder')
                ->where('initialMessages.0.user.store_slug', 'reef-nusantara-farm')
                ->missing('initialMessages.0.user.email')
                ->missing('initialMessages.0.user.phone')
            );

        $json = $this->getJson('/community/messages');
        $json->assertStatus(200)
            ->assertJsonCount(1, 'messages')
            ->assertJsonMissing(['email' => 'secret-budi@example.com'])
            ->assertJsonMissing(['phone' => '081299998888']);
    }

    public function test_guests_cannot_post_or_delete_global_messages(): void
    {
        $user = User::factory()->create();
        $msg = GlobalMessage::factory()->create(['user_id' => $user->id]);

        $this->postJson('/community/messages', ['message' => 'Halo semua'])
            ->assertStatus(401);

        $this->deleteJson("/community/messages/{$msg->id}")
            ->assertStatus(401);
    }

    public function test_authenticated_users_can_post_reply_upload_image_and_poll_messages(): void
    {
        Storage::fake('public');

        $buyer = User::factory()->create(['role' => 'buyer', 'name' => 'Siti Aquarist']);
        $otherBuyer = User::factory()->create(['role' => 'buyer', 'name' => 'Andi Betta']);

        $this->actingAs($buyer)
            ->postJson('/community/messages', ['message' => '   '])
            ->assertStatus(422);

        $firstRes = $this->actingAs($buyer)
            ->postJson('/community/messages', [
                'message' => 'Ada rekomendasi pakan cupang harian?',
            ]);

        $firstRes->assertStatus(201)
            ->assertJsonPath('message.user.name', 'Siti Aquarist')
            ->assertJsonPath('message.message', 'Ada rekomendasi pakan cupang harian?');

        $firstId = (int) $firstRes->json('message.id');

        $secondRes = $this->actingAs($otherBuyer)
            ->post('/community/messages', [
                'message' => 'Coba pelet halus ukuran mikro ini kak!',
                'reply_to_id' => $firstId,
                'image' => UploadedFile::fake()->image('cupang.jpg', 320, 240),
            ], ['Accept' => 'application/json']);

        $secondRes->assertStatus(201)
            ->assertJsonPath('message.reply_to.id', $firstId)
            ->assertJsonPath('message.reply_to.user_name', 'Siti Aquarist');

        $secondId = (int) $secondRes->json('message.id');
        $imageUrl = (string) $secondRes->json('message.image_url');
        $this->assertStringStartsWith('/storage/community_uploads/', $imageUrl);

        $relativePath = ltrim(str_replace('/storage/', '', $imageUrl), '/');
        Storage::disk('public')->assertExists($relativePath);

        $this->getJson("/community/messages?after_id={$firstId}")
            ->assertStatus(200)
            ->assertJsonCount(1, 'messages')
            ->assertJsonPath('messages.0.id', $secondId);

        $this->getJson("/community/messages?before_id={$secondId}")
            ->assertStatus(200)
            ->assertJsonCount(1, 'messages')
            ->assertJsonPath('messages.0.id', $firstId)
            ->assertJsonPath('has_more', false);
    }

    public function test_only_message_author_or_admin_can_delete_global_message(): void
    {
        Storage::fake('public');

        $author = User::factory()->create(['role' => 'buyer']);
        $stranger = User::factory()->create(['role' => 'buyer']);
        $admin = User::factory()->create(['role' => 'admin']);

        $postRes = $this->actingAs($author)
            ->post('/community/messages', [
                'message' => 'Pesan uji coba dengan foto',
                'image' => UploadedFile::fake()->image('tank.png', 200, 200),
            ], ['Accept' => 'application/json'])
            ->assertStatus(201);

        $msgId = (int) $postRes->json('message.id');
        $relativePath = ltrim(str_replace('/storage/', '', (string) $postRes->json('message.image_url')), '/');
        Storage::disk('public')->assertExists($relativePath);

        $this->actingAs($stranger)
            ->deleteJson("/community/messages/{$msgId}")
            ->assertStatus(403);

        $adminMsg = GlobalMessage::factory()->create(['user_id' => $stranger->id]);

        $this->actingAs($author)
            ->deleteJson("/community/messages/{$msgId}")
            ->assertStatus(200)
            ->assertJsonPath('deleted_id', $msgId);

        Storage::disk('public')->assertMissing($relativePath);
        $this->assertDatabaseMissing('global_messages', ['id' => $msgId]);

        $this->actingAs($admin)
            ->deleteJson("/community/messages/{$adminMsg->id}")
            ->assertStatus(200);
        $this->assertDatabaseMissing('global_messages', ['id' => $adminMsg->id]);
    }

    public function test_posting_message_lazily_migrates_global_messages_when_table_is_missing(): void
    {
        Schema::dropIfExists('global_messages');
        DB::table('migrations')
            ->where('migration', '2026_11_19_054200_create_global_messages_table')
            ->delete();

        $this->assertFalse(Schema::hasTable('global_messages'));

        $buyer = User::factory()->create(['role' => 'buyer', 'name' => 'Widya']);

        $this->actingAs($buyer)
            ->postJson('/community/messages', [
                'message' => 'halooo',
            ])
            ->assertStatus(201)
            ->assertJsonPath('message.message', 'halooo')
            ->assertJsonPath('message.user.name', 'Widya');

        $this->assertTrue(Schema::hasTable('global_messages'));
        $this->assertDatabaseHas('global_messages', [
            'user_id' => $buyer->id,
            'message' => 'halooo',
        ]);
    }
}
