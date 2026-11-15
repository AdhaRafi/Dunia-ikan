import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PasswordInput from '@/Components/PasswordInput';
import TextInput from '@/Components/TextInput';
import GuestLayout, { authPrimaryButtonClass } from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout
            eyebrow="Atur ulang kata sandi"
            headline="Buat kata sandi baru yang kuat untuk melindungi akun Anda."
        >
            <Head title="Password baru — Dunia Ikan" />

            <h1 className="text-[24px] sm:text-[26px] font-bold tracking-[-0.025em] text-slate-900 dark:text-white">
                Kata sandi baru
            </h1>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                Buat kata sandi baru untuk <span className="font-medium text-slate-700 dark:text-slate-300">{email}</span>.
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
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Kata sandi baru" />
                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        wrapperClassName="mt-1.5"
                        placeholder="Minimal 8 karakter"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
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
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1.5"
                    />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className={authPrimaryButtonClass}
                >
                    {processing ? 'Menyimpan...' : 'Simpan Kata Sandi'}
                </button>
            </form>
        </GuestLayout>
    );
}
