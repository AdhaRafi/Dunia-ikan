import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PasswordInput from '@/Components/PasswordInput';
import TextInput from '@/Components/TextInput';
import GuestLayout, { authPrimaryButtonClass } from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout
            eyebrow="Bergabung dengan Dunia Ikan"
            headline="Temukan ikan hias terkurasi dan konsultasi langsung bersama Kiko."
        >
            <Head title="Daftar — Dunia Ikan" />

            <div>
                <h1 className="text-[24px] sm:text-[26px] font-bold tracking-[-0.025em] text-slate-900 dark:text-white">
                    Buat akun
                </h1>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Daftar gratis sebagai pembeli untuk memesan ikan dan menyimpan riwayat konsultasi.
                </p>
            </div>

            <form onSubmit={submit} className="mt-5 space-y-3.5">
                <div>
                    <InputLabel htmlFor="name" value="Nama lengkap" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1.5"
                        placeholder="Nama lengkap Anda"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-1.5" />
                </div>

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
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Kata sandi" />
                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        wrapperClassName="mt-1.5"
                        placeholder="Minimal 8 karakter"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi kata sandi" />
                    <PasswordInput
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        wrapperClassName="mt-1.5"
                        placeholder="Ulangi kata sandi"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1.5"
                    />
                </div>

                <div className="pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className={authPrimaryButtonClass}
                    >
                        {processing ? 'Mendaftarkan...' : 'Buat Akun'}
                    </button>
                </div>
            </form>

            <div className="mt-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-800" />
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    info penangkar
                </span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-800" />
            </div>

            <p className="mt-2.5 text-center text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
                Ingin menjual ikan? Buka toko penangkar setelah masuk ke akun Anda.
            </p>

            <p className="mt-4 text-center text-[13px] text-slate-500 dark:text-slate-400">
                Sudah punya akun?{' '}
                <Link
                    href="/login"
                    className="font-semibold text-[#2448f5] dark:text-sky-400 hover:underline"
                >
                    Masuk
                </Link>
            </p>
        </GuestLayout>
    );
}
