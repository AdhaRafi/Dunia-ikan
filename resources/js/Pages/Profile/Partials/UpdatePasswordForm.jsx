import InputError from '@/Components/InputError';
import PasswordInput from '@/Components/PasswordInput';
import { useLanguage } from '@/lib/i18n';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm() {
    const { pick } = useLanguage();
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (formErrors) => {
                if (formErrors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (formErrors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <form
            onSubmit={updatePassword}
            className="rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-neutral-800 overflow-hidden"
        >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {pick('Pengaturan Keamanan', 'Security Settings')}
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                        {pick(
                            'Masukkan kata sandi saat ini dan sandi baru untuk memperbarui keamanan akun.',
                            'Enter your current and new password to update your account security.'
                        )}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            {pick('Kata sandi diperbarui', 'Password updated')}
                        </span>
                    </Transition>

                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-[#0684E5] dark:hover:bg-[#0267C1] text-white text-xs font-semibold disabled:opacity-50 transition"
                    >
                        {processing ? pick('Menyimpan...', 'Saving...') : pick('Simpan', 'Save')}
                    </button>
                </div>
            </div>

            <div className="divide-y divide-dashed divide-slate-200/80 dark:divide-neutral-800">
                <div className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-6">
                    <label
                        htmlFor="current_password"
                        className="sm:w-44 shrink-0 text-xs sm:text-[13px] font-medium text-slate-600 dark:text-neutral-400"
                    >
                        {pick('Kata sandi saat ini', 'Current password')}
                    </label>
                    <div className="flex-1 min-w-0">
                        <PasswordInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) =>
                                setData('current_password', e.target.value)
                            }
                            placeholder={pick('Masukkan kata sandi saat ini', 'Enter current password')}
                            autoComplete="current-password"
                            required
                            className="!h-10 !text-[13px] bg-slate-50/70 focus:bg-white dark:bg-[#0b101d]"
                        />
                        <InputError
                            message={errors.current_password}
                            className="mt-1.5"
                        />
                    </div>
                </div>

                <div className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-6">
                    <label
                        htmlFor="password"
                        className="sm:w-44 shrink-0 text-xs sm:text-[13px] font-medium text-slate-600 dark:text-neutral-400"
                    >
                        {pick('Kata sandi baru', 'New password')}
                    </label>
                    <div className="flex-1 min-w-0">
                        <PasswordInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={pick('Minimal 8 karakter', 'At least 8 characters')}
                            autoComplete="new-password"
                            required
                            className="!h-10 !text-[13px] bg-slate-50/70 focus:bg-white dark:bg-[#0b101d]"
                        />
                        <InputError message={errors.password} className="mt-1.5" />
                    </div>
                </div>

                <div className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-6">
                    <label
                        htmlFor="password_confirmation"
                        className="sm:w-44 shrink-0 text-xs sm:text-[13px] font-medium text-slate-600 dark:text-neutral-400"
                    >
                        {pick('Konfirmasi sandi baru', 'Confirm new password')}
                    </label>
                    <div className="flex-1 min-w-0">
                        <PasswordInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            placeholder={pick('Ulangi kata sandi baru', 'Repeat new password')}
                            autoComplete="new-password"
                            required
                            className="!h-10 !text-[13px] bg-slate-50/70 focus:bg-white dark:bg-[#0b101d]"
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-1.5"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
