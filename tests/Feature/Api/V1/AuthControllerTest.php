<?php

namespace Tests\Feature\Api\V1;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_creates_buyer_dispatches_registered_event_and_returns_201_with_token(): void
    {
        Event::fake([Registered::class]);

        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Raka Aquatic',
            'email' => '  Raka@Example.COM ',
            'phone' => '081234567890',
            'password' => 'SecretPass123!',
            'password_confirmation' => 'SecretPass123!',
            'device_name' => 'pixel-9',
        ]);

        $response->assertCreated()
            ->assertJsonPath('user.name', 'Raka Aquatic')
            ->assertJsonPath('user.email', 'raka@example.com')
            ->assertJsonPath('user.role', 'buyer')
            ->assertJsonPath('user.seller_status', 'none')
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email', 'phone', 'role', 'seller_status', 'avatar_url']]);

        $this->assertDatabaseHas('users', [
            'email' => 'raka@example.com',
            'role' => 'buyer',
            'phone' => '081234567890',
        ]);
        $this->assertDatabaseCount('personal_access_tokens', 1);
        Event::assertDispatched(Registered::class);
    }

    public function test_register_returns_422_for_invalid_payload(): void
    {
        $response = $this->postJson('/api/v1/auth/register', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'password']);

        $this->assertDatabaseCount('users', 0);
    }

    public function test_login_issues_token_and_me_returns_authenticated_user(): void
    {
        $user = User::factory()->create([
            'email' => 'buyer@example.com',
            'password' => Hash::make('Password123!'),
            'role' => 'buyer',
        ]);

        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => ' BUYER@EXAMPLE.COM ',
            'password' => 'Password123!',
            'device_name' => 'expo-android',
        ]);

        $loginResponse->assertOk()
            ->assertJsonPath('user.id', $user->id)
            ->assertJsonPath('user.email', 'buyer@example.com');

        $token = (string) $loginResponse->json('token');
        $this->assertNotSame('', $token);

        $meResponse = $this->withToken($token)->getJson('/api/v1/auth/me');

        $meResponse->assertOk()
            ->assertJsonPath('user.id', $user->id)
            ->assertJsonPath('user.email', 'buyer@example.com');
    }

    public function test_login_returns_422_with_message_for_wrong_credentials(): void
    {
        User::factory()->create([
            'email' => 'buyer@example.com',
            'password' => Hash::make('Password123!'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'buyer@example.com',
            'password' => 'WrongPass999!',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email'])
            ->assertJsonPath('errors.email.0', 'Email atau kata sandi tidak sesuai.');

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_me_returns_401_when_unauthenticated(): void
    {
        $this->getJson('/api/v1/auth/me')->assertUnauthorized();
    }

    public function test_logout_revokes_current_bearer_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('mobile-test')->plainTextToken;

        $response = $this->withToken($token)->postJson('/api/v1/auth/logout');

        $response->assertOk()
            ->assertJsonPath('message', 'Berhasil keluar.');

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
