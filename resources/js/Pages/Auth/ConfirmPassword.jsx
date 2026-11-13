import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Konfirmasi password — Dunia Ikan" />

            <h1 className="display-type">Konfirmasi</h1>
            <p className="mt-4 max-w-[40ch] text-[20px] leading-snug">
                Area ini terlindungi. Masukkan password Anda untuk melanjutkan.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 w-full"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-1" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="press w-full bg-ink px-4 py-3 text-[16px] font-medium text-bone hover:bg-accent disabled:opacity-50"
                >
                    {processing ? 'Memeriksa' : 'Lanjutkan'}
                </button>
            </form>
        </GuestLayout>
    );
}
