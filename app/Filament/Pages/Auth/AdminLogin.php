<?php

namespace App\Filament\Pages\Auth;

use App\Services\TurnstileVerifier;
use Closure;
use DanHarrin\LivewireRateLimiting\Exceptions\TooManyRequestsException;
use Filament\Auth\Http\Responses\Contracts\LoginResponse;
use Filament\Auth\Pages\Login;
use Filament\Forms\Components\ViewField;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AdminLogin extends Login
{
    /**
     * Normalize email and verify rate limits and Cloudflare Turnstile before signing in.
     */
    public function authenticate(): ?LoginResponse
    {
        if (isset($this->data['email']) && is_string($this->data['email'])) {
            $this->data['email'] = Str::lower(trim($this->data['email']));
        }

        $email = (string) ($this->data['email'] ?? '');
        $throttleKey = 'admin-login:'.Str::transliterate($email.'|'.request()->ip());

        if ($email !== '' && RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            $this->getRateLimitedNotification(
                new TooManyRequestsException(static::class, 'authenticate', request()->ip(), $seconds)
            )?->send();

            throw ValidationException::withMessages([
                'data.email' => trans('auth.throttle', [
                    'seconds' => $seconds,
                    'minutes' => ceil($seconds / 60),
                ]),
            ]);
        }

        $verifier = app(TurnstileVerifier::class);

        try {
            $response = parent::authenticate();

            if ($response !== null && $email !== '') {
                RateLimiter::clear($throttleKey);
            }

            return $response;
        } catch (ValidationException $exception) {
            if ($email !== '' && ! array_key_exists('data.cf_turnstile_response', $exception->errors())) {
                RateLimiter::hit($throttleKey);
            }

            if ($verifier->isEnabled()) {
                $this->data['cf_turnstile_response'] = '';
                $this->dispatch('reset-turnstile');
            }

            throw $exception;
        }
    }

    /**
     * Include the Cloudflare Turnstile field on the admin login schema when enabled.
     */
    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                $this->getEmailFormComponent(),
                $this->getPasswordFormComponent(),
                $this->getRememberFormComponent(),
                $this->getTurnstileFormComponent(),
            ]);
    }

    protected function getTurnstileFormComponent(): Component
    {
        return ViewField::make('cf_turnstile_response')
            ->hiddenLabel()
            ->view('filament.forms.components.turnstile')
            ->visible(fn (): bool => app(TurnstileVerifier::class)->isEnabled())
            ->dehydrated(fn (): bool => app(TurnstileVerifier::class)->isEnabled())
            ->required(fn (): bool => app(TurnstileVerifier::class)->isEnabled())
            ->validationMessages([
                'required' => __('Verifikasi keamanan Cloudflare gagal atau kedaluwarsa. Silakan selesaikan verifikasi lagi.'),
            ])
            ->rule(function (): Closure {
                return function (string $attribute, mixed $value, Closure $fail): void {
                    try {
                        app(TurnstileVerifier::class)->verifyTokenOrFail($value, request(), 'admin_login', $attribute);
                    } catch (ValidationException $exception) {
                        $errors = $exception->errors()[$attribute] ?? [];
                        $fail($errors[0] ?? __('Verifikasi keamanan Cloudflare gagal atau kedaluwarsa. Silakan selesaikan verifikasi lagi.'));
                    }
                };
            });
    }
}
