import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm() {
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

    const hasInput =
        data.current_password || data.password || data.password_confirmation;

    return (
        <form
            onSubmit={updatePassword}
            className="rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-neutral-800 overflow-hidden"
        >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between gap-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Pengaturan Keamanan
                </h2>

                <div className="flex items-center gap-3">
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                            Kata sandi diperbarui
                        </span>
                    </Transition>

                    <button
                        type="submit"
                        disabled={processing || !hasInput}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 text-white text-xs font-semibold disabled:opacity-40 transition"
                    >
                        Simpan
                    </button>
                </div>
            </div>

            <div className="divide-y divide-dashed divide-slate-200/80 dark:divide-neutral-800">
                <div className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-6">
                    <label
                        htmlFor="current_password"
                        className="sm:w-44 shrink-0 text-xs sm:text-[13px] text-slate-400 dark:text-neutral-500"
                    >
                        Kata sandi saat ini:
                    </label>
                    <div className="flex-1 min-w-0">
                        <input
                            id="current_password"
                            ref={currentPasswordInput}
                            type="password"
                            value={data.current_password}
                            onChange={(e) =>
                                setData('current_password', e.target.value)
                            }
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className="w-full bg-transparent border-0 rounded-md px-2 py-1 -mx-2 text-xs sm:text-[13px] font-medium text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-neutral-600 hover:bg-slate-50 dark:hover:bg-slate-900/50 focus:bg-slate-50 dark:focus:bg-slate-900/70 focus:ring-1 focus:ring-slate-300 dark:focus:ring-neutral-700 transition"
                        />
                        <InputError
                            message={errors.current_password}
                            className="mt-1"
                        />
                    </div>
                </div>

                <div className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-6">
                    <label
                        htmlFor="password"
                        className="sm:w-44 shrink-0 text-xs sm:text-[13px] text-slate-400 dark:text-neutral-500"
                    >
                        Kata sandi baru:
                    </label>
                    <div className="flex-1 min-w-0">
                        <input
                            id="password"
                            ref={passwordInput}
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Minimal 8 karakter"
                            autoComplete="new-password"
                            className="w-full bg-transparent border-0 rounded-md px-2 py-1 -mx-2 text-xs sm:text-[13px] font-medium text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-neutral-600 hover:bg-slate-50 dark:hover:bg-slate-900/50 focus:bg-slate-50 dark:focus:bg-slate-900/70 focus:ring-1 focus:ring-slate-300 dark:focus:ring-neutral-700 transition"
                        />
                        <InputError message={errors.password} className="mt-1" />
                    </div>
                </div>

                <div className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-6">
                    <label
                        htmlFor="password_confirmation"
                        className="sm:w-44 shrink-0 text-xs sm:text-[13px] text-slate-400 dark:text-neutral-500"
                    >
                        Konfirmasi sandi:
                    </label>
                    <div className="flex-1 min-w-0">
                        <input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            placeholder="Ulangi kata sandi baru"
                            autoComplete="new-password"
                            className="w-full bg-transparent border-0 rounded-md px-2 py-1 -mx-2 text-xs sm:text-[13px] font-medium text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-neutral-600 hover:bg-slate-50 dark:hover:bg-slate-900/50 focus:bg-slate-50 dark:focus:bg-slate-900/70 focus:ring-1 focus:ring-slate-300 dark:focus:ring-neutral-700 transition"
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-1"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
