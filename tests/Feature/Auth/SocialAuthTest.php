<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SocialAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_unconfigured_social_provider_redirects_gracefully_and_invalid_provider_returns_404(): void
    {
        config([
            'services.google.client_id' => null,
            'services.google.client_secret' => null,
            'services.facebook.client_id' => null,
            'services.facebook.client_secret' => null,
        ]);

        $this->get('/auth/google/redirect')
            ->assertRedirect(route('login'))
            ->assertSessionHasErrors('social');

        $this->get('/auth/facebook/redirect')
            ->assertRedirect(route('login'))
            ->assertSessionHasErrors('social');

        $this->get('/auth/github/redirect')->assertNotFound();
    }

    public function test_google_login_creates_verified_buyer_and_blocks_state_mismatch_or_unverified_email(): void
    {
        config([
            'services.google.client_id' => 'google-test-client-id',
            'services.google.client_secret' => 'google-test-secret',
            'services.google.redirect' => '/auth/google/callback',
        ]);

        $redirectResponse = $this->get('/auth/google/redirect');
        $redirectResponse->assertRedirect();

        $location = (string) $redirectResponse->headers->get('Location');
        $this->assertStringStartsWith('https://accounts.google.com/o/oauth2/v2/auth?', $location);
        $this->assertStringContainsString('client_id=google-test-client-id', $location);

        parse_str((string) parse_url($location, PHP_URL_QUERY), $query);
        $validState = (string) ($query['state'] ?? '');
        $this->assertNotSame('', $validState);

        // Reject CSRF state mismatch before contacting Google token endpoint.
        $this->get('/auth/google/callback?state=tampered-state&code=abc')
            ->assertRedirect(route('login'))
            ->assertSessionHasErrors('social');
        $this->assertGuest();

        // Re-initiate OAuth state for unverified email rejection test.
        $secondRedirect = $this->get('/auth/google/redirect');
        parse_str((string) parse_url((string) $secondRedirect->headers->get('Location'), PHP_URL_QUERY), $q2);
        $unverifiedState = (string) ($q2['state'] ?? '');

        Http::preventStrayRequests();
        Http::fake([
            'https://oauth2.googleapis.com/token' => Http::sequence()
                ->push(['access_token' => 'google-token-unverified'], 200)
                ->push(['access_token' => 'google-token-valid'], 200),
            'https://openidconnect.googleapis.com/v1/userinfo*' => Http::sequence()
                ->push([
                    'sub' => 'google-sub-999',
                    'name' => 'Unverified User',
                    'email' => 'unverified@example.com',
                    'email_verified' => false,
                ], 200)
                ->push([
                    'sub' => 'google-sub-12345',
                    'name' => 'Rani Aquascape',
                    'email' => 'Rani.Aquascape@gmail.com',
                    'email_verified' => true,
                    'picture' => 'https://lh3.googleusercontent.com/avatar.jpg',
                ], 200),
        ]);

        $this->get('/auth/google/callback?state='.urlencode($unverifiedState).'&code=code-unverified')
            ->assertRedirect(route('login'))
            ->assertSessionHasErrors('social');
        $this->assertGuest();

        $thirdRedirect = $this->get('/auth/google/redirect');
        parse_str((string) parse_url((string) $thirdRedirect->headers->get('Location'), PHP_URL_QUERY), $q3);
        $validStateThree = (string) ($q3['state'] ?? '');

        $this->get('/auth/google/callback?state='.urlencode($validStateThree).'&code=code-valid')
            ->assertRedirect(route('dashboard', absolute: false));

        $user = User::where('email', 'rani.aquascape@gmail.com')->firstOrFail();
        $this->assertAuthenticatedAs($user, 'web');
        $this->assertSame('buyer', $user->role);
        $this->assertSame('google-sub-12345', $user->google_id);
        $this->assertSame('https://lh3.googleusercontent.com/avatar.jpg', $user->avatar);
        $this->assertNotNull($user->email_verified_at);
    }

    public function test_facebook_login_links_existing_buyer_and_blocks_admin_oauth_bypass(): void
    {
        config([
            'services.facebook.client_id' => 'fb-test-app-id',
            'services.facebook.client_secret' => 'fb-test-secret',
            'services.facebook.redirect' => '/auth/facebook/callback',
        ]);

        $existingBuyer = User::factory()->create([
            'name' => 'Pembeli Lama',
            'email' => 'pembeli.lama@example.com',
            'role' => 'buyer',
            'facebook_id' => null,
        ]);

        $admin = User::factory()->create(['role' => 'admin']);

        Http::preventStrayRequests();
        Http::fake([
            'https://graph.facebook.com/v20.0/oauth/access_token*' => Http::sequence()
                ->push(['access_token' => 'fb-token-buyer'], 200)
                ->push(['access_token' => 'fb-token-admin'], 200),
            'https://graph.facebook.com/v20.0/me*' => Http::sequence()
                ->push([
                    'id' => 'fb-user-777',
                    'name' => 'Pembeli Lama FB',
                    'email' => 'pembeli.lama@example.com',
                    'picture' => ['data' => ['url' => 'https://graph.facebook.com/fb-user-777/picture']],
                ], 200)
                ->push([
                    'id' => 'fb-admin-attempt',
                    'name' => 'Fake Admin OAuth',
                    'email' => $admin->email,
                ], 200),
        ]);

        $fbRedirect = $this->get('/auth/facebook/redirect');
        $fbRedirect->assertRedirect();
        parse_str((string) parse_url((string) $fbRedirect->headers->get('Location'), PHP_URL_QUERY), $q);
        $state = (string) ($q['state'] ?? '');

        $this->get('/auth/facebook/callback?state='.urlencode($state).'&code=fb-code-1')
            ->assertRedirect(route('dashboard', absolute: false));

        $existingBuyer->refresh();
        $this->assertAuthenticatedAs($existingBuyer, 'web');
        $this->assertSame('fb-user-777', $existingBuyer->facebook_id);

        $this->post('/logout');
        $this->assertGuest();

        // Admin accounts cannot sign in via social OAuth (must use /admin/login).
        $adminAttemptRedirect = $this->get('/auth/facebook/redirect');
        parse_str((string) parse_url((string) $adminAttemptRedirect->headers->get('Location'), PHP_URL_QUERY), $qAdmin);

        $this->get('/auth/facebook/callback?state='.urlencode((string) ($qAdmin['state'] ?? '')).'&code=fb-code-admin')
            ->assertRedirect(route('login'))
            ->assertSessionHasErrors('social');
        $this->assertGuest('web');
        $this->assertGuest('admin');
    }
}
