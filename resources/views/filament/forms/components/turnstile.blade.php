@php
    $siteKey = app(\App\Services\TurnstileVerifier::class)->siteKey();
    $statePath = $getStatePath();
@endphp

<x-dynamic-component :component="$getFieldWrapperView()" :field="$field">
    @if ($siteKey)
        <div
            wire:ignore
            x-data="{
                widgetId: null,
                loadError: false,
                siteKey: @js($siteKey),
                statePath: @js($statePath),
                async initWidget() {
                    try {
                        const turnstile = await this.loadScript();
                        if (!turnstile || !this.$refs.container) return;

                        if (this.widgetId !== null) {
                            turnstile.remove(this.widgetId);
                            this.widgetId = null;
                        }

                        const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

                        this.widgetId = turnstile.render(this.$refs.container, {
                            sitekey: this.siteKey,
                            action: 'admin_login',
                            theme: theme,
                            size: 'flexible',
                            callback: (token) => $wire.set(this.statePath, token, false),
                            'expired-callback': () => $wire.set(this.statePath, '', false),
                            'error-callback': () => $wire.set(this.statePath, '', false),
                        });
                    } catch (e) {
                        this.loadError = true;
                    }
                },
                loadScript() {
                    if (window.turnstile) return Promise.resolve(window.turnstile);
                    if (!window.__duniaIkanTurnstilePromise) {
                        window.__duniaIkanTurnstilePromise = new Promise((resolve, reject) => {
                            window.__onDuniaIkanAdminTurnstileLoad = () => resolve(window.turnstile);
                            const existing = document.getElementById('cf-turnstile-script');
                            if (existing) {
                                if (window.turnstile) {
                                    resolve(window.turnstile);
                                } else {
                                    existing.addEventListener('load', () => resolve(window.turnstile), { once: true });
                                }
                                return;
                            }
                            const script = document.createElement('script');
                            script.id = 'cf-turnstile-script';
                            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__onDuniaIkanAdminTurnstileLoad';
                            script.async = true;
                            script.defer = true;
                            script.onerror = () => {
                                window.__duniaIkanTurnstilePromise = null;
                                reject(new Error('Unable to load Turnstile script'));
                            };
                            document.head.appendChild(script);
                        });
                    }
                    return window.__duniaIkanTurnstilePromise;
                },
                resetWidget() {
                    $wire.set(this.statePath, '', false);
                    if (this.widgetId !== null && window.turnstile) {
                        window.turnstile.reset(this.widgetId);
                    }
                },
            }"
            x-init="initWidget()"
            x-on:reset-turnstile.window="resetWidget()"
            class="space-y-1.5"
        >
            <div x-ref="container" class="min-h-[65px]"></div>

            <template x-if="loadError">
                <p class="text-xs text-danger-600 dark:text-danger-400">
                    {{ __('Gagal memuat verifikasi Cloudflare Turnstile. Muat ulang halaman atau nonaktifkan pemblokir skrip.') }}
                </p>
            </template>
        </div>
    @endif
</x-dynamic-component>
