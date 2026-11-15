import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PasswordInput from '@/Components/PasswordInput';
import GuestLayout, { authPrimaryButtonClass } from '@/Layouts/GuestLayout';
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
        <GuestLayout
            eyebrow="Keamanan akun"
            headline="Verifikasi identitas Anda sebelum mengakses pengaturan sensitif."
        >
            <Head title="Konfirmasi password — Dunia Ikan" />

            <h1 className="text-[24px] sm:text-[26px] font-bold tracking-[-0.025em] text-slate-900 dark:text-white">
                Konfirmasi
            </h1>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                Area ini terlindungi. Masukkan kata sandi Anda untuk melanjutkan.
            </p>

            <form onSubmit={submit} className="mt-5 space-y-4">
                <div>
                    <InputLabel htmlFor="password" value="Kata sandi" />
                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        wrapperClassName="mt-1.5"
                        placeholder="Masukkan kata sandi"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className={authPrimaryButtonClass}
                >
                    {processing ? 'Memeriksa...' : 'Lanjutkan'}
                </button>
            </form>
        </GuestLayout>
    );
}
