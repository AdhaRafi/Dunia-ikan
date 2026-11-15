<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class TurnstileVerifier
{
    public const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    public const FIELD_NAME = 'cf-turnstile-response';

    /**
     * Determine whether Turnstile verification is configured and enabled.
     */
    public function isEnabled(): bool
    {
        return $this->siteKey() !== null && $this->secretKey() !== '';
    }

    /**
     * Return the public Turnstile site key when configured.
     */
    public function siteKey(): ?string
    {
        $siteKey = trim((string) config('services.turnstile.site_key', ''));

        return $siteKey !== '' ? $siteKey : null;
    }

    /**
     * Verify a Cloudflare Turnstile token via siteverify, failing closed on error or mismatch.
     *
     * @throws ValidationException
     */
    public function verifyOrFail(Request $request, string $expectedAction): void
    {
        if (! $this->isEnabled()) {
            return;
        }

        $token = $request->input(self::FIELD_NAME);
        $allowedHostnames = $this->allowedHostnames();

        if (! is_string($token) || $token === '' || strlen($token) > 2048 || $allowedHostnames === []) {
            $this->throwVerificationError();
        }

        try {
            $response = Http::asForm()
                ->timeout(10)
                ->post(self::VERIFY_URL, [
                    'secret' => $this->secretKey(),
                    'response' => $token,
                    'remoteip' => $request->ip(),
                ]);

            if (! $response->successful()) {
                $this->throwVerificationError();
            }

            $payload = $response->json();
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (\Throwable $exception) {
            Log::warning('Cloudflare Turnstile siteverify failed.', [
                'action' => $expectedAction,
                'error' => $exception->getMessage(),
            ]);

            $this->throwVerificationError();
        }

        if (! is_array($payload)) {
            $this->throwVerificationError();
        }

        $isSuccess = ($payload['success'] ?? false) === true;
        $actionMatches = ($payload['action'] ?? null) === $expectedAction;
        $hostname = strtolower(trim((string) ($payload['hostname'] ?? '')));
        $hostnameMatches = $hostname !== '' && in_array($hostname, $allowedHostnames, true);

        if (! $isSuccess || ! $actionMatches || ! $hostnameMatches) {
            $this->throwVerificationError();
        }
    }

    /**
     * Resolve allowed frontend hostnames for server-side verification.
     *
     * @return list<string>
     */
    public function allowedHostnames(): array
    {
        $raw = (string) config('services.turnstile.hostnames', '');
        $hostnames = array_values(array_filter(array_map(
            static fn (string $host): string => strtolower(trim($host)),
            explode(',', $raw),
        )));

        if ($hostnames === []) {
            $appHost = parse_url((string) config('app.url'), PHP_URL_HOST);
            if (is_string($appHost) && trim($appHost) !== '') {
                $hostnames[] = strtolower(trim($appHost));
            }
        }

        if (app()->isProduction()) {
            $hostnames = array_values(array_filter(
                $hostnames,
                static fn (string $host): bool => ! in_array($host, ['localhost', '127.0.0.1'], true),
            ));
        }

        return array_values(array_unique($hostnames));
    }

    private function secretKey(): string
    {
        return trim((string) config('services.turnstile.secret_key', ''));
    }

    /**
     * @throws ValidationException
     */
    private function throwVerificationError(): never
    {
        throw ValidationException::withMessages([
            self::FIELD_NAME => __('Verifikasi keamanan Cloudflare gagal atau kedaluwarsa. Silakan selesaikan verifikasi lagi.'),
        ]);
    }
}
