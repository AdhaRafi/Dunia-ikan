import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

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
        <GuestLayout>
            <Head title="Masuk — Dunia Ikan" />

            <div>
                <h1 className="display-type">Masuk</h1>
                <p className="mt-4 max-w-[36ch] text-[20px] leading-snug">
                    Belanja, kelola toko, atau pantau pesanan Anda.
                </p>
            </div>

            <div className="mt-6 bg-bone p-4">
                <p className="text-[13px] font-medium">Akun demo</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                    <button
                        type="button"
                        onClick={() => fillDemo('pembeli@duniaikan.test')}
                        className="press bg-surface py-2 text-[16px] font-medium hover:bg-field3"
                    >
                        Pembeli
                    </button>
                    <button
                        type="button"
                        onClick={() => fillDemo('penjual1@duniaikan.test')}
                        className="press bg-surface py-2 text-[16px] font-medium hover:bg-field3"
                    >
                        Penjual
                    </button>
                    <button
                        type="button"
                        onClick={() => fillDemo('admin@duniaikan.test')}
                        className="press bg-surface py-2 text-[16px] font-medium hover:bg-field3"
                    >
                        Admin
                    </button>
                </div>
                <p className="mt-3 text-[16px] text-muted">
                    Password semua akun: password
                </p>
            </div>

            {status && (
                <p className="mt-4 bg-field4 px-4 py-3 text-[13px] text-white">
                    {status}
                </p>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-[16px] font-medium"
                    >
                        Email
                    </label>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-[16px] font-medium"
                    >
                        Password
                    </label>
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <label className="flex items-center gap-2 text-[16px] text-muted">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        Ingat saya
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-[13px] underline decoration-1 underline-offset-4 hover:text-accent"
                        >
                            Lupa password?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="press w-full bg-ink px-4 py-3 text-[16px] font-medium text-bone hover:bg-accent disabled:opacity-50"
                >
                    {processing ? 'Memproses' : 'Masuk'}
                </button>
            </form>

            <p className="mt-6 text-[16px] text-muted">
                Belum punya akun?{' '}
                <Link
                    href="/register"
                    className="text-ink underline decoration-1 underline-offset-4 hover:text-accent"
                >
                    Daftar sebagai pembeli
                </Link>
            </p>
        </GuestLayout>
    );
}
