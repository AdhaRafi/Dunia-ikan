import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Lupa password — Dunia Ikan" />

            <h1 className="display-type">Lupa password</h1>
            <p className="mt-4 max-w-[40ch] text-[20px] leading-snug">
                Masukkan email akun Anda. Kami kirim tautan untuk membuat
                password baru.
            </p>

            {status && (
                <p className="mt-5 bg-field4 px-4 py-3 text-[16px] text-white">
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
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="press w-full bg-ink px-4 py-3 text-[16px] font-medium text-bone hover:bg-accent disabled:opacity-50"
                >
                    {processing ? 'Mengirim' : 'Kirim tautan'}
                </button>
            </form>

            <p className="mt-6 text-[16px] text-muted">
                Ingat password?{' '}
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
