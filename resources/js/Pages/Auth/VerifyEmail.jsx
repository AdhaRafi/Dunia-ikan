import GuestLayout, { authPrimaryButtonClass } from '@/Layouts/GuestLayout';
import { useLanguage } from '@/lib/i18n';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { pick } = useLanguage();
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout
            eyebrow={pick('Aktivasi akun', 'Account activation')}
            headline={pick(
                'Satu langkah lagi untuk mengaktifkan akun Dunia Ikan Anda.',
                'One more step to activate your Dunia Ikan account.'
            )}
        >
            <Head title={pick('Verifikasi email — Dunia Ikan', 'Verify Email — Dunia Ikan')} />

            <h1 className="text-[24px] sm:text-[26px] font-bold tracking-[-0.025em] text-slate-900 dark:text-white">
                {pick('Verifikasi email', 'Verify email')}
            </h1>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                {pick(
                    'Kami telah mengirim tautan verifikasi ke email Anda. Buka tautan tersebut untuk mengaktifkan akun.',
                    'We have sent a verification link to your email. Open that link to activate your account.'
                )}
            </p>

            {status === 'verification-link-sent' && (
                <p className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 px-3.5 py-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    {pick(
                        'Tautan verifikasi baru sudah dikirim ke email Anda.',
                        'A new verification link has been sent to your email.'
                    )}
                </p>
            )}

            <form onSubmit={submit} className="mt-5 space-y-3">
                <button
                    type="submit"
                    disabled={processing}
                    className={authPrimaryButtonClass}
                >
                    {processing ? pick('Mengirim...', 'Sending...') : pick('Kirim Ulang Email', 'Resend Email')}
                </button>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="block w-full h-11 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-center text-sm font-semibold text-slate-700 dark:text-slate-200 transition"
                >
                    {pick('Keluar', 'Log out')}
                </Link>
            </form>
        </GuestLayout>
    );
}
