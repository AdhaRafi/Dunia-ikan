import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout, { authPrimaryButtonClass } from '@/Layouts/GuestLayout';
import { useLanguage } from '@/lib/i18n';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { pick } = useLanguage();
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout
            eyebrow={pick('Pemulihan akses akun', 'Account recovery')}
            headline={pick(
                'Dapatkan tautan aman untuk mengatur ulang kata sandi akun Anda.',
                'Get a secure link to reset your account password.'
            )}
        >
            <Head title={pick('Lupa password — Dunia Ikan', 'Forgot Password — Dunia Ikan')} />

            <h1 className="text-[24px] sm:text-[26px] font-bold tracking-[-0.025em] text-slate-900 dark:text-white">
                {pick('Lupa kata sandi', 'Forgot password')}
            </h1>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                {pick(
                    'Masukkan email akun Anda. Kami akan mengirimkan tautan untuk membuat kata sandi baru.',
                    'Enter your account email and we will send you a link to set a new password.'
                )}
            </p>

            {status && (
                <p className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 px-3.5 py-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    {status}
                </p>
            )}

            <form onSubmit={submit} className="mt-5 space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1.5"
                        placeholder={pick('nama@email.com', 'name@email.com')}
                        autoComplete="username"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className={authPrimaryButtonClass}
                >
                    {processing ? pick('Mengirim...', 'Sending...') : pick('Kirim Tautan Pemulihan', 'Send Reset Link')}
                </button>
            </form>

            <p className="mt-5 text-center text-[13px] text-slate-500 dark:text-slate-400">
                {pick('Ingat kata sandi Anda?', 'Remember your password?')}{' '}
                <Link
                    href="/login"
                    className="font-semibold text-[#2448f5] dark:text-sky-400 hover:underline"
                >
                    {pick('Masuk', 'Sign in')}
                </Link>
            </p>
        </GuestLayout>
    );
}
