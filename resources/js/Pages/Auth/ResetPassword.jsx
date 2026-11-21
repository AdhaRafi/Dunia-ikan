import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PasswordInput, { getPasswordConfirmationError } from '@/Components/PasswordInput';
import TextInput from '@/Components/TextInput';
import GuestLayout, { authPrimaryButtonClass } from '@/Layouts/GuestLayout';
import { useLanguage } from '@/lib/i18n';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { pick } = useLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const hasPasswordMismatch = Boolean(data.password_confirmation) && data.password !== data.password_confirmation;
    const passwordConfirmationError = getPasswordConfirmationError(
        data.password,
        data.password_confirmation,
        errors.password_confirmation,
        pick,
    );

    const submit = (e) => {
        e.preventDefault();

        if (hasPasswordMismatch) {
            return;
        }

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout
            eyebrow={pick('Atur ulang kata sandi', 'Reset password')}
            headline={pick(
                'Buat kata sandi baru yang kuat untuk melindungi akun Anda.',
                'Create a strong new password to protect your account.'
            )}
        >
            <Head title={pick('Password baru — Dunia Ikan', 'New Password — Dunia Ikan')} />

            <h1 className="text-[24px] sm:text-[26px] font-bold tracking-[-0.025em] text-slate-900 dark:text-white">
                {pick('Kata sandi baru', 'New password')}
            </h1>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                {pick('Buat kata sandi baru untuk', 'Create a new password for')}{' '}
                <span className="font-medium text-slate-700 dark:text-slate-300">{email}</span>.
            </p>

            <form onSubmit={submit} className="mt-5 space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1.5"
                        autoComplete="username"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value={pick('Kata sandi baru', 'New password')} />
                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        wrapperClassName="mt-1.5"
                        placeholder={pick('Minimal 8 karakter', 'At least 8 characters')}
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value={pick('Konfirmasi kata sandi', 'Confirm password')}
                    />
                    <PasswordInput
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        wrapperClassName="mt-1.5"
                        placeholder={pick('Ulangi kata sandi', 'Repeat password')}
                        autoComplete="new-password"
                        invalid={Boolean(passwordConfirmationError)}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                    />
                    <InputError
                        message={passwordConfirmationError}
                        className="mt-1.5"
                    />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className={authPrimaryButtonClass}
                >
                    {processing ? pick('Menyimpan...', 'Saving...') : pick('Simpan Kata Sandi', 'Save Password')}
                </button>
            </form>
        </GuestLayout>
    );
}
