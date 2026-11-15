import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PasswordInput from '@/Components/PasswordInput';
import TextInput from '@/Components/TextInput';
import GuestLayout, { authPrimaryButtonClass } from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Store, User } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const fillDemo = (email, password = 'password') => {
        setData({ email, password, remember: true });
    };

    return (
        <GuestLayout
            eyebrow="Selamat datang kembali"
            headline="Pantau pesanan, koleksi ikan hias, dan toko Anda di satu tempat."
        >
            <Head title="Masuk — Dunia Ikan" />

            <div>
                <h1 className="text-[24px] sm:text-[26px] font-bold tracking-[-0.025em] text-slate-900 dark:text-white">
                    Masuk
                </h1>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Belanja ikan hias terkurasi, kelola toko penangkar, atau pantau pengiriman Anda.
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
                        placeholder="nama@email.com"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div>
                    <div className="flex items-center justify-between gap-2">
                        <InputLabel htmlFor="password" value="Kata sandi" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-medium text-[#2448f5] dark:text-sky-400 hover:underline"
                            >
                                Lupa kata sandi?
                            </Link>
                        )}
                    </div>
                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        wrapperClassName="mt-1.5"
                        placeholder="Masukkan kata sandi"
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
                    Ingat saya di perangkat ini
                </label>

                <button
                    type="submit"
                    disabled={processing}
                    className={authPrimaryButtonClass}
                >
                    {processing ? 'Memproses...' : 'Masuk'}
                </button>
            </form>

            <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-800" />
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    atau isi akun demo
                </span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-800" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
                <button
                    type="button"
                    onClick={() => fillDemo('pembeli@duniaikan.test')}
                    className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-neutral-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition"
                >
                    <User className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                    Pembeli
                </button>
                <button
                    type="button"
                    onClick={() => fillDemo('penjual1@duniaikan.test')}
                    className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-neutral-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition"
                >
                    <Store className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                    Penjual
                </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
                Kata sandi akun demo: <span className="font-medium text-slate-500 dark:text-slate-400">password</span>
            </p>

            <p className="mt-5 text-center text-[13px] text-slate-500 dark:text-slate-400">
                Belum punya akun?{' '}
                <Link
                    href="/register"
                    className="font-semibold text-[#2448f5] dark:text-sky-400 hover:underline"
                >
                    Daftar
                </Link>
            </p>
        </GuestLayout>
    );
}
