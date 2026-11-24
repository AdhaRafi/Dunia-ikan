<?php

namespace Tests\Feature\Api\V1;

use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Models\FishGuide;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatbotApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_chat_and_fetch_history_statelessly_with_session_token(): void
    {
        config(['services.gemini.api_key' => null]);

        FishGuide::create([
            'title' => 'Mengatasi White Spot pada Cupang',
            'fish_type' => 'Cupang',
            'category' => 'Penyakit & Parasit',
            'symptoms' => 'Bintik putih pada sirip ikan cupang.',
            'possible_causes' => 'Parasit Ich.',
            'care_instructions' => 'Naikkan suhu 30C dan beri garam ikan.',
            'is_active' => true,
        ]);

        $sendResponse = $this->postJson('/api/v1/chatbot/message', [
            'message' => 'Cupang saya ada bintik putih di sirip',
        ]);

        $sendResponse->assertOk()
            ->assertJsonPath('status', 'success')
            ->assertJsonCount(1, 'matching_guides')
            ->assertJsonStructure(['session_token', 'assistant_message' => ['id', 'message']]);

        $token = (string) $sendResponse->json('session_token');
        $this->assertNotSame('', $token);

        $historyResponse = $this->getJson('/api/v1/chatbot/history?session_token='.$token);

        $historyResponse->assertOk()
            ->assertJsonPath('session_token', $token)
            ->assertJsonCount(2, 'messages');
    }

    public function test_authenticated_sanctum_user_can_reset_session_and_cannot_access_other_users_session(): void
    {
        config(['services.gemini.api_key' => null]);

        $victim = User::factory()->create(['role' => 'buyer']);
        $attacker = User::factory()->create(['role' => 'buyer']);
        $attackerToken = $attacker->createToken('mobile')->plainTextToken;

        $victimSession = ChatSession::create([
            'user_id' => $victim->id,
            'session_token' => str_repeat('a', 40),
            'title' => 'Private Session',
        ]);
        ChatMessage::create([
            'chat_session_id' => $victimSession->id,
            'sender' => 'user',
            'message' => 'Catatan rahasia kolam',
        ]);

        $historyResponse = $this->withToken($attackerToken)
            ->getJson('/api/v1/chatbot/history?session_token='.$victimSession->session_token);

        $historyResponse->assertOk()
            ->assertJsonCount(0, 'messages');
        $this->assertStringNotContainsString('Catatan rahasia kolam', $historyResponse->getContent());

        $newSessionResponse = $this->withToken($attackerToken)->postJson('/api/v1/chatbot/new');
        $newSessionResponse->assertOk()
            ->assertJsonPath('messages', []);
        $this->assertNotSame($victimSession->session_token, $newSessionResponse->json('session_token'));
    }

    public function test_send_message_returns_422_when_message_is_missing(): void
    {
        $this->postJson('/api/v1/chatbot/message', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['message']);
    }

    public function test_authenticated_user_can_list_switch_and_delete_chat_history_sessions(): void
    {
        config(['services.gemini.api_key' => null]);

        $owner = User::factory()->create(['role' => 'buyer']);
        $otherUser = User::factory()->create(['role' => 'buyer']);

        $otherSession = ChatSession::create([
            'user_id' => $otherUser->id,
            'session_token' => str_repeat('z', 40),
            'title' => 'Sesi Orang Lain',
        ]);
        ChatMessage::create([
            'chat_session_id' => $otherSession->id,
            'sender' => 'user',
            'message' => 'Rahasia pengguna lain',
        ]);

        // Conversation 1
        $first = $this->actingAs($owner)
            ->postJson('/chatbot/message', ['message' => 'Rekomendasi ikan cupang untuk pemula'])
            ->assertOk();
        $firstToken = (string) $first->json('session_token');

        // Start a fresh session and send Conversation 2
        $fresh = $this->actingAs($owner)
            ->postJson('/chatbot/new')
            ->assertOk();
        $secondSeedToken = (string) $fresh->json('session_token');
        $this->assertNotSame($firstToken, $secondSeedToken);

        $second = $this->actingAs($owner)
            ->postJson('/chatbot/message', [
                'message' => 'Cara atasi white spot di akuarium',
                'session_token' => $secondSeedToken,
            ])
            ->assertOk();
        $secondToken = (string) $second->json('session_token');
        $this->assertSame($secondSeedToken, $secondToken);

        // List sessions returns only owner's 2 conversations (most recent first)
        $list = $this->actingAs($owner)
            ->getJson('/chatbot/sessions')
            ->assertOk()
            ->assertJsonCount(2, 'sessions');

        $tokens = collect($list->json('sessions'))->pluck('session_token')->all();
        $this->assertSame([$secondToken, $firstToken], $tokens);
        $this->assertStringNotContainsString('Rahasia pengguna lain', $list->getContent());

        // Switch back to Conversation 1 via history endpoint
        $this->actingAs($owner)
            ->getJson('/chatbot/history?session_token='.$firstToken)
            ->assertOk()
            ->assertJsonPath('session_token', $firstToken)
            ->assertJsonCount(2, 'messages')
            ->assertJsonPath('messages.0.message', 'Rekomendasi ikan cupang untuk pemula');

        // Cannot delete another user's session
        $this->actingAs($owner)
            ->deleteJson('/chatbot/sessions/'.$otherSession->session_token)
            ->assertForbidden();

        // Can delete own session
        $this->actingAs($owner)
            ->deleteJson('/chatbot/sessions/'.$firstToken)
            ->assertOk()
            ->assertJsonPath('deleted_token', $firstToken)
            ->assertJsonPath('sessions_count', 1);

        $this->assertDatabaseMissing('chat_sessions', ['session_token' => $firstToken]);
    }

    public function test_guest_web_session_tracks_multiple_conversations_and_blocks_foreign_deletes(): void
    {
        config(['services.gemini.api_key' => null]);

        $foreignSession = ChatSession::create([
            'user_id' => null,
            'session_token' => str_repeat('q', 40),
            'title' => 'Tamu Lain',
        ]);
        ChatMessage::create([
            'chat_session_id' => $foreignSession->id,
            'sender' => 'user',
            'message' => 'Obrolan tamu lain',
        ]);

        $first = $this->postJson('/chatbot/message', ['message' => 'Pakan terbaik untuk ikan koki'])
            ->assertOk();
        $firstToken = (string) $first->json('session_token');

        $new = $this->postJson('/chatbot/new')->assertOk();
        $second = $this->postJson('/chatbot/message', [
            'message' => 'Suhu ideal untuk neon tetra',
            'session_token' => $new->json('session_token'),
        ])->assertOk();
        $secondToken = (string) $second->json('session_token');

        $this->getJson('/chatbot/sessions')
            ->assertOk()
            ->assertJsonCount(2, 'sessions')
            ->assertJsonPath('sessions.0.session_token', $secondToken)
            ->assertJsonPath('sessions.1.session_token', $firstToken);

        $this->getJson('/chatbot/history?session_token='.$firstToken)
            ->assertOk()
            ->assertJsonPath('session_token', $firstToken)
            ->assertJsonPath('messages.0.message', 'Pakan terbaik untuk ikan koki');

        $this->deleteJson('/chatbot/sessions/'.$foreignSession->session_token)
            ->assertForbidden();

        $this->deleteJson('/chatbot/sessions/'.$firstToken)
            ->assertOk()
            ->assertJsonPath('sessions_count', 1);
    }
}
