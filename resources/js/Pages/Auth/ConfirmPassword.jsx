import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PasswordInput from '@/Components/PasswordInput';
import GuestLayout, { authPrimaryButtonClass } from '@/Layouts/GuestLayout';
import { useLanguage } from '@/lib/i18n';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { pick } = useLanguage();
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
            eyebrow={pick('Keamanan akun', 'Account security')}
            headline={pick(
                'Verifikasi identitas Anda sebelum mengakses pengaturan sensitif.',
                'Verify your identity before accessing sensitive settings.'
            )}
        >
            <Head title={pick('Konfirmasi password — Dunia Ikan', 'Confirm Password — Dunia Ikan')} />

            <h1 className="text-[24px] sm:text-[26px] font-bold tracking-[-0.025em] text-slate-900 dark:text-white">
                {pick('Konfirmasi', 'Confirm password')}
            </h1>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                {pick(
                    'Area ini terlindungi. Masukkan kata sandi Anda untuk melanjutkan.',
                    'This area is protected. Please enter your password to continue.'
                )}
            </p>

            <form onSubmit={submit} className="mt-5 space-y-4">
                <div>
                    <InputLabel htmlFor="password" value={pick('Kata sandi', 'Password')} />
                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        wrapperClassName="mt-1.5"
                        placeholder={pick('Masukkan kata sandi', 'Enter password')}
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
                    {processing ? pick('Memeriksa...', 'Checking...') : pick('Lanjutkan', 'Continue')}
                </button>
            </form>
        </GuestLayout>
    );
}
