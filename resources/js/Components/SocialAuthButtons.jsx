import InputError from '@/Components/InputError';
import { useLanguage } from '@/lib/i18n';
import { usePage } from '@inertiajs/react';

export default function SocialAuthButtons({ error = null, mode = 'login' }) {
    const { pick } = useLanguage();
    const { errors: pageErrors = {} } = usePage().props;
    const displayError = error || pageErrors.social || null;

    const dividerText = mode === 'register'
        ? pick('atau daftar cepat dengan', 'or quick sign up with')
        : pick('atau masuk dengan', 'or continue with');

    const googleHref = typeof route === 'function'
        ? route('social.redirect', 'google')
        : '/auth/google/redirect';

    const facebookHref = typeof route === 'function'
        ? route('social.redirect', 'facebook')
        : '/auth/facebook/redirect';

    return (
        <div className="mt-4">
            <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-800" />
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    {dividerText}
                </span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-800" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
                <a
                    href={googleHref}
                    className="h-10 rounded-xl bg-white hover:bg-slate-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-xs font-semibold text-slate-700 dark:text-slate-100 flex items-center justify-center gap-2 shadow-2xs transition"
                >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                        />
                    </svg>
                    <span>Google</span>
                </a>

                <a
                    href={facebookHref}
                    className="h-10 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-xs font-semibold text-white flex items-center justify-center gap-2 shadow-2xs transition"
                >
                    <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
                    </svg>
                    <span>Facebook</span>
                </a>
            </div>

            <InputError message={displayError} className="mt-2 text-center" />
        </div>
    );
}
