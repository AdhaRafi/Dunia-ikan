import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
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
        <GuestLayout>
            <Head title="Daftar — Dunia Ikan" />

            <div>
                <h1 className="display-type">Daftar</h1>
                <p className="mt-4 max-w-[40ch] text-[20px] leading-snug">
                    Buat akun pembeli untuk memesan ikan dan menyimpan riwayat
                    konsultasi.
                </p>
            </div>

            <p className="mt-5 border-l-4 border-field3 bg-surface p-4 text-[16px] leading-relaxed">
                Pendaftaran ini untuk pembeli. Ingin menjual ikan? Buka toko
                setelah masuk.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-[16px] font-medium"
                    >
                        Nama lengkap
                    </label>
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-1" />
                </div>

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
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div>
                    <label
                        htmlFor="password_confirmation"
                        className="block text-[16px] font-medium"
                    >
                        Konfirmasi password
                    </label>
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1"
                    />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="press w-full bg-ink px-4 py-3 text-[16px] font-medium text-bone hover:bg-accent disabled:opacity-50"
                >
                    {processing ? 'Mendaftarkan' : 'Daftar'}
                </button>
            </form>

            <p className="mt-6 text-[16px] text-muted">
                Sudah punya akun?{' '}
                <Link
                    href="/login"
                    className="text-ink underline decoration-1 underline-offset-4 hover:text-accent"
                >
                    Masuk
                </Link>
            </p>
        </GuestLayout>
    );
}
