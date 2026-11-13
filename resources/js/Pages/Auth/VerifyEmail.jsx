import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi email — Dunia Ikan" />

            <h1 className="display-type">Verifikasi email</h1>
            <p className="mt-4 max-w-[40ch] text-[20px] leading-snug">
                Kami mengirim tautan verifikasi ke email Anda. Buka tautan itu
                untuk mengaktifkan akun.
            </p>

            {status === 'verification-link-sent' && (
                <p className="mt-5 bg-field4 px-4 py-3 text-[16px] text-white">
                    Tautan verifikasi baru sudah dikirim ke email Anda.
                </p>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4">
                <button
                    type="submit"
                    disabled={processing}
                    className="press w-full bg-ink px-4 py-3 text-[16px] font-medium text-bone hover:bg-accent disabled:opacity-50"
                >
                    {processing ? 'Mengirim' : 'Kirim ulang email'}
                </button>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="press block w-full bg-surface px-4 py-3 text-center text-[16px] font-medium text-ink hover:bg-field3"
                >
                    Keluar
                </Link>
            </form>
        </GuestLayout>
    );
}
