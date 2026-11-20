<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    /**
     * @var array<string, array{
     *     label: string,
     *     id_column: string,
     *     auth_url: string,
     *     token_url: string,
     *     token_method: string,
     *     userinfo_url: string,
     *     scope: string,
     *     extra_auth_params: array<string, string>,
     *     userinfo_params: array<string, string>
     * }>
     */
    private const PROVIDERS = [
        'google' => [
            'label' => 'Google',
            'id_column' => 'google_id',
            'auth_url' => 'https://accounts.google.com/o/oauth2/v2/auth',
            'token_url' => 'https://oauth2.googleapis.com/token',
            'token_method' => 'post',
            'userinfo_url' => 'https://openidconnect.googleapis.com/v1/userinfo',
            'scope' => 'openid email profile',
            'extra_auth_params' => ['prompt' => 'select_account'],
            'userinfo_params' => [],
        ],
        'facebook' => [
            'label' => 'Facebook',
            'id_column' => 'facebook_id',
            'auth_url' => 'https://www.facebook.com/v20.0/dialog/oauth',
            'token_url' => 'https://graph.facebook.com/v20.0/oauth/access_token',
            'token_method' => 'get',
            'userinfo_url' => 'https://graph.facebook.com/v20.0/me',
            'scope' => 'email,public_profile',
            'extra_auth_params' => [],
            'userinfo_params' => ['fields' => 'id,name,email,picture.type(large)'],
        ],
    ];

    public function redirect(Request $request, string $provider): RedirectResponse
    {
        $config = $this->providerConfig($provider);
        $credentials = $this->providerCredentials($provider);

        if ($credentials === null) {
            return redirect()
                ->route('login')
                ->withErrors(['social' => "Login {$config['label']} belum dikonfigurasi pada server."]);
        }

        $random = Str::random(32);
        $timestamp = time();
        $signature = hash_hmac('sha256', "{$provider}|{$timestamp}|{$random}", (string) config('app.key'));
        $state = "{$provider}.{$timestamp}.{$random}.{$signature}";

        $request->session()->put('oauth_state', [
            'provider' => $provider,
            'state' => $state,
        ]);

        $params = array_merge([
            'client_id' => $credentials['client_id'],
            'redirect_uri' => $credentials['redirect'],
            'response_type' => 'code',
            'scope' => $config['scope'],
            'state' => $state,
        ], $config['extra_auth_params']);

        return redirect()->away($config['auth_url'].'?'.http_build_query($params));
    }

    public function callback(Request $request, string $provider): RedirectResponse
    {
        $config = $this->providerConfig($provider);
        $credentials = $this->providerCredentials($provider);

        if ($credentials === null) {
            return redirect()
                ->route('login')
                ->withErrors(['social' => "Login {$config['label']} belum dikonfigurasi pada server."]);
        }

        if ($request->filled('error')) {
            return redirect()
                ->route('login')
                ->withErrors(['social' => "Login {$config['label']} dibatalkan atau ditolak."]);
        }

        $expected = $request->session()->pull('oauth_state');
        $incomingState = (string) $request->query('state', '');

        $isStateValid = false;
        if (
            is_array($expected)
            && ($expected['provider'] ?? null) === $provider
            && $incomingState !== ''
            && hash_equals((string) ($expected['state'] ?? ''), $incomingState)
        ) {
            $isStateValid = true;
        } elseif ($incomingState !== '') {
            $parts = explode('.', $incomingState);
            if (count($parts) === 4) {
                [$tokenProvider, $timestamp, $random, $signature] = $parts;
                $expectedSig = hash_hmac('sha256', "{$tokenProvider}|{$timestamp}|{$random}", (string) config('app.key'));
                if (
                    $tokenProvider === $provider
                    && hash_equals($expectedSig, $signature)
                    && is_numeric($timestamp)
                    && ((int) $timestamp) >= (time() - 900)
                ) {
                    $isStateValid = true;
                }
            }
        }

        if (! $isStateValid) {
            return redirect()
                ->route('login')
                ->withErrors(['social' => "Sesi verifikasi {$config['label']} tidak valid atau kedaluwarsa. Silakan coba lagi."]);
        }

        $code = trim((string) $request->query('code', ''));
        if ($code === '') {
            return redirect()
                ->route('login')
                ->withErrors(['social' => "Kode otorisasi {$config['label']} tidak ditemukan."]);
        }

        // Ensure database schema has oauth column lazily before querying
        $this->ensureColumnMigrated('users', $config['id_column'], 'database/migrations/2026_11_17_072500_add_oauth_fields_to_users_table.php');

        try {
            $profile = $this->fetchUserProfile($config, $credentials, $code);
            if ($profile === null) {
                return redirect()
                    ->route('login')
                    ->withErrors(['social' => "Gagal memverifikasi akun dengan server {$config['label']}."]);
            }

            $providerId = trim((string) ($profile['sub'] ?? $profile['id'] ?? ''));
            $email = Str::lower(trim((string) ($profile['email'] ?? '')));
            $emailVerified = $provider === 'google'
                ? (bool) ($profile['email_verified'] ?? false)
                : true;

            if ($providerId === '' || ! $emailVerified || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return redirect()
                    ->route('login')
                    ->withErrors(['social' => "Akun {$config['label']} harus memiliki email terverifikasi untuk masuk."]);
            }

            $user = $this->resolveUser($provider, $config['id_column'], $providerId, $email, $profile);
            if ($user === null) {
                return redirect()
                    ->route('login')
                    ->withErrors(['social' => 'Akun administrator harus masuk melalui halaman login admin.']);
            }

            Auth::guard('web')->login($user, true);
            $request->session()->regenerate();

            return redirect()->intended(route('dashboard', absolute: false));
        } catch (\Throwable $e) {
            report($e);

            return redirect()
                ->route('login')
                ->withErrors(['social' => "Terjadi kendala saat menghubungkan akun {$config['label']}. Silakan coba lagi."]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function providerConfig(string $provider): array
    {
        abort_unless(array_key_exists($provider, self::PROVIDERS), 404);

        return self::PROVIDERS[$provider];
    }

    /**
     * @return array{client_id: string, client_secret: string, redirect: string}|null
     */
    private function providerCredentials(string $provider): ?array
    {
        $clientId = trim((string) config("services.{$provider}.client_id", ''));
        $clientSecret = trim((string) config("services.{$provider}.client_secret", ''));
        $redirectRaw = trim((string) config("services.{$provider}.redirect", "/auth/{$provider}/callback"));

        if ($clientId === '' || $clientSecret === '') {
            return null;
        }

        $redirect = str_starts_with($redirectRaw, 'http://') || str_starts_with($redirectRaw, 'https://')
            ? $redirectRaw
            : url($redirectRaw);

        return [
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'redirect' => $redirect,
        ];
    }

    /**
     * @param  array<string, mixed>  $config
     * @param  array{client_id: string, client_secret: string, redirect: string}  $credentials
     * @return array<string, mixed>|null
     */
    private function fetchUserProfile(array $config, array $credentials, string $code): ?array
    {
        try {
            $tokenPayload = [
                'client_id' => $credentials['client_id'],
                'client_secret' => $credentials['client_secret'],
                'redirect_uri' => $credentials['redirect'],
                'code' => $code,
                'grant_type' => 'authorization_code',
            ];

            $tokenResponse = $config['token_method'] === 'post'
                ? Http::asForm()->timeout(10)->post($config['token_url'], $tokenPayload)
                : Http::timeout(10)->get($config['token_url'], $tokenPayload);

            if (! $tokenResponse->ok()) {
                return null;
            }

            $accessToken = trim((string) $tokenResponse->json('access_token', ''));
            if ($accessToken === '') {
                return null;
            }

            $profileResponse = Http::withToken($accessToken)
                ->timeout(10)
                ->get($config['userinfo_url'], $config['userinfo_params']);

            if (! $profileResponse->ok()) {
                return null;
            }

            $data = $profileResponse->json();

            return is_array($data) ? $data : null;
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Find, link, or create a non-admin buyer account from an OAuth profile.
     *
     * @param  array<string, mixed>  $profile
     */
    private function resolveUser(
        string $provider,
        string $idColumn,
        string $providerId,
        string $email,
        array $profile,
    ): ?User {
        $user = User::where($idColumn, $providerId)->first()
            ?? User::where('email', $email)->first();

        if ($user !== null && $user->isAdmin()) {
            return null;
        }

        $avatar = $this->extractSafeAvatarUrl($provider, $profile);
        $name = trim((string) ($profile['name'] ?? ''));

        if ($user === null) {
            $created = User::create([
                'name' => $name !== '' ? Str::limit($name, 120, '') : Str::before($email, '@'),
                'email' => $email,
                'role' => 'buyer',
                'seller_status' => 'none',
                'avatar' => $avatar,
                $idColumn => $providerId,
                'password' => Hash::make(Str::random(40)),
            ]);
            $created->forceFill(['email_verified_at' => now()])->save();

            return $created;
        }

        $updates = [$idColumn => $providerId];
        if ($user->avatar === null && $avatar !== null) {
            $updates['avatar'] = $avatar;
        }

        $user->update($updates);
        if ($user->email_verified_at === null) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }

        return $user;
    }

    /**
     * @param  array<string, mixed>  $profile
     */
    private function extractSafeAvatarUrl(string $provider, array $profile): ?string
    {
        $raw = $provider === 'google'
            ? ($profile['picture'] ?? null)
            : ($profile['picture']['data']['url'] ?? null);

        if (! is_string($raw)) {
            return null;
        }

        $trimmed = trim($raw);

        return str_starts_with($trimmed, 'https://') && strlen($trimmed) <= 2000 ? $trimmed : null;
    }
}
