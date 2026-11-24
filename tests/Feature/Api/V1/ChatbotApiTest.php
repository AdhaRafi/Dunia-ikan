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
}
