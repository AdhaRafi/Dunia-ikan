import InputError from '@/Components/InputError';
import { useLanguage } from '@/lib/i18n';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

let turnstileScriptPromise = null;

function loadTurnstileScript() {
    if (typeof window === 'undefined') {
        return Promise.reject(new Error('Window unavailable'));
    }

    if (window.turnstile) {
        return Promise.resolve(window.turnstile);
    }

    if (!turnstileScriptPromise) {
        turnstileScriptPromise = new Promise((resolve, reject) => {
            window.__onDuniaIkanTurnstileLoad = () => {
                resolve(window.turnstile);
            };

            const existing = document.getElementById('cf-turnstile-script');
            if (existing) {
                if (window.turnstile) {
                    resolve(window.turnstile);
                }
                return;
            }

            const script = document.createElement('script');
            script.id = 'cf-turnstile-script';
            script.src =
                'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__onDuniaIkanTurnstileLoad';
            script.async = true;
            script.defer = true;
            script.onerror = () => {
                turnstileScriptPromise = null;
                reject(new Error('Unable to load Turnstile script'));
            };
            document.head.appendChild(script);
        });
    }

    return turnstileScriptPromise;
}

/**
 * Explicit Cloudflare Turnstile widget integrated with Inertia forms.
 */
export default function TurnstileWidget({
    action,
    onVerify,
    onExpire,
    resetTrigger = 0,
    error,
}) {
    const { turnstileSiteKey = null } = usePage().props;
    const { pick } = useLanguage();
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);
    const callbacksRef = useRef({ onVerify, onExpire });
    const [loadError, setLoadError] = useState(false);

    callbacksRef.current = { onVerify, onExpire };

    useEffect(() => {
        if (!turnstileSiteKey || !containerRef.current) {
            return undefined;
        }

        let cancelled = false;
        setLoadError(false);

        loadTurnstileScript()
            .then((turnstile) => {
                if (cancelled || !containerRef.current || !turnstile) {
                    return;
                }

                if (widgetIdRef.current !== null) {
                    turnstile.remove(widgetIdRef.current);
                    widgetIdRef.current = null;
                }

                const theme = document.documentElement.classList.contains('dark')
                    ? 'dark'
                    : 'light';

                widgetIdRef.current = turnstile.render(containerRef.current, {
                    sitekey: turnstileSiteKey,
                    action,
                    theme,
                    size: 'flexible',
                    callback: (token) => {
                        callbacksRef.current.onVerify?.(token);
                    },
                    'expired-callback': () => {
                        callbacksRef.current.onExpire?.();
                    },
                    'error-callback': () => {
                        callbacksRef.current.onExpire?.();
                    },
                });
            })
            .catch(() => {
                if (!cancelled) {
                    setLoadError(true);
                }
            });

        return () => {
            cancelled = true;
            if (widgetIdRef.current !== null && window.turnstile) {
                try {
                    window.turnstile.remove(widgetIdRef.current);
                } catch (_) {
                    // ignore cleanup failures
                }
                widgetIdRef.current = null;
            }
        };
    }, [turnstileSiteKey, action]);

    useEffect(() => {
        if (resetTrigger > 0 && widgetIdRef.current !== null && window.turnstile) {
            try {
                window.turnstile.reset(widgetIdRef.current);
            } catch (_) {
                // ignore reset failures
            }
            callbacksRef.current.onExpire?.();
        }
    }, [resetTrigger]);

    if (!turnstileSiteKey) {
        return null;
    }

    return (
        <div>
            <div ref={containerRef} className="min-h-[65px] w-full" />
            {loadError && (
                <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
                    {pick(
                        'Gagal memuat verifikasi Cloudflare. Muat ulang halaman lalu coba lagi.',
                        'Failed to load Cloudflare verification. Reload the page and try again.',
                    )}
                </p>
            )}
            <InputError message={error} className="mt-1.5" />
        </div>
    );
}
