import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PasswordInput from '@/Components/PasswordInput';
import TextInput from '@/Components/TextInput';
import TurnstileWidget from '@/Components/TurnstileWidget';
import GuestLayout, { authPrimaryButtonClass } from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Store, User } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { useState } from 'react';

export default function Login({
    status,
    canResetPassword,
    canUseDemoAccounts = false,
    demoAccounts = [],
}) {
    const { pick } = useLanguage();
    const { turnstileSiteKey = null } = usePage().props;
    const [turnstileResetKey, setTurnstileResetKey] = useState(0);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        'cf-turnstile-response': '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => {
                reset('password', 'cf-turnstile-response');
                setTurnstileResetKey((value) => value + 1);
            },
        });
    };

    const fillDemo = (account) => {
        setData((prev) => ({
            ...prev,
            email: account.email,
            password: account.password,
            remember: true,
        }));
    };

    return (
        <GuestLayout
            eyebrow={pick('Selamat datang kembali', 'Welcome back')}
            headline={pick(
                'Pantau pesanan, koleksi ikan hias, dan toko Anda di satu tempat.',
                'Track your orders, ornamental fish collection, and store in one place.',
            )}
        >
            <Head title={pick('Masuk — Dunia Ikan', 'Sign In — Dunia Ikan')} />

            <div>
                <h1 className="text-[24px] sm:text-[26px] font-bold tracking-[-0.025em] text-slate-900 dark:text-white">
                    {pick('Masuk', 'Sign In')}
                </h1>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                    {pick(
                        'Belanja ikan hias terkurasi, kelola toko penangkar, atau pantau pengiriman Anda.',
                        'Shop curated ornamental fish, manage your breeder store, or track shipments.',
                    )}
                </p>
            </div>

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

                <div>
                    <div className="flex items-center justify-between gap-2">
                        <InputLabel htmlFor="password" value={pick('Kata sandi', 'Password')} />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-medium text-[#2448f5] dark:text-sky-400 hover:underline"
                            >
                                {pick('Lupa kata sandi?', 'Forgot password?')}
                            </Link>
                        )}
                    </div>
                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        wrapperClassName="mt-1.5"
                        placeholder={pick('Masukkan kata sandi', 'Enter your password')}
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <label className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    {pick('Ingat saya di perangkat ini', 'Keep me signed in')}
                </label>

                <TurnstileWidget
                    action="login"
                    resetTrigger={turnstileResetKey}
                    error={errors['cf-turnstile-response']}
                    onVerify={(token) => setData('cf-turnstile-response', token)}
                    onExpire={() => setData('cf-turnstile-response', '')}
                />

                <button
                    type="submit"
                    disabled={processing || (Boolean(turnstileSiteKey) && !data['cf-turnstile-response'])}
                    className={authPrimaryButtonClass}
                >
                    {processing ? pick('Memproses...', 'Signing in...') : pick('Masuk', 'Sign In')}
                </button>
            </form>

            {canUseDemoAccounts && demoAccounts.length > 0 && (
                <>
                    <div className="my-5 flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-800" />
                        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                            {pick('atau isi akun demo', 'or try a demo account')}
                        </span>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-800" />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                        {demoAccounts.map((account) => {
                            const Icon = account.role === 'seller' ? Store : User;

                            return (
                                <button
                                    key={account.email}
                                    type="button"
                                    onClick={() => fillDemo(account)}
                                    className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-neutral-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition"
                                >
                                    <Icon className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                                    {pick(account.label, account.label_en || account.label)}
                                </button>
                            );
                        })}
                    </div>
                    {demoAccounts[0]?.password && (
                        <p className="mt-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
                            {pick('Kata sandi akun demo:', 'Demo account password:')}{' '}
                            <span className="font-medium text-slate-500 dark:text-slate-400">
                                {demoAccounts[0].password}
                            </span>
                        </p>
                    )}
                </>
            )}

            <p className="mt-5 text-center text-[13px] text-slate-500 dark:text-slate-400">
                {pick('Belum punya akun?', "Don't have an account?")}{' '}
                <Link
                    href="/register"
                    className="font-semibold text-[#2448f5] dark:text-sky-400 hover:underline"
                >
                    {pick('Daftar', 'Sign Up')}
                </Link>
            </p>
        </GuestLayout>
    );
}
