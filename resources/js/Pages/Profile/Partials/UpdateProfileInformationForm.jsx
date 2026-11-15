import InputError from '@/Components/InputError';
import { useLanguage } from '@/lib/i18n';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    roleLabel,
    joinedAt,
}) {
    const { pick } = useLanguage();
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful, isDirty } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), { preserveScroll: true });
    };

    return (
        <form
            onSubmit={submit}
            className="rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-neutral-800 overflow-hidden"
        >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between gap-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {pick('Detail Pribadi', 'Personal Details')}
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
                            {pick('Tersimpan', 'Saved')}
                        </span>
                    </Transition>

                    <button
                        type="submit"
                        disabled={processing || !isDirty}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 text-white text-xs font-semibold disabled:opacity-40 transition"
                    >
                        {pick('Simpan', 'Save')}
                    </button>
                </div>
            </div>

            <div className="divide-y divide-dashed divide-slate-200/80 dark:divide-neutral-800">
                <div className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-6">
                    <label
                        htmlFor="name"
                        className="sm:w-44 shrink-0 text-xs sm:text-[13px] text-slate-400 dark:text-neutral-500"
                    >
                        {pick('Nama lengkap:', 'Full name:')}
                    </label>
                    <div className="flex-1 min-w-0">
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                            className="w-full bg-transparent border-0 rounded-md px-2 py-1 -mx-2 text-xs sm:text-[13px] font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900/50 focus:bg-slate-50 dark:focus:bg-slate-900/70 focus:ring-1 focus:ring-slate-300 dark:focus:ring-neutral-700 transition"
                        />
                        <InputError className="mt-1" message={errors.name} />
                    </div>
                </div>

                <div className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-6">
                    <label
                        htmlFor="email"
                        className="sm:w-44 shrink-0 text-xs sm:text-[13px] text-slate-400 dark:text-neutral-500"
                    >
                        Email:
                    </label>
                    <div className="flex-1 min-w-0">
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            className="w-full bg-transparent border-0 rounded-md px-2 py-1 -mx-2 text-xs sm:text-[13px] font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900/50 focus:bg-slate-50 dark:focus:bg-slate-900/70 focus:ring-1 focus:ring-slate-300 dark:focus:ring-neutral-700 transition"
                        />
                        <InputError className="mt-1" message={errors.email} />
                    </div>
                </div>

                <div className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-6">
                    <span className="sm:w-44 shrink-0 text-xs sm:text-[13px] text-slate-400 dark:text-neutral-500">
                        {pick('Peran akun:', 'Account role:')}
                    </span>
                    <span className="flex-1 text-xs sm:text-[13px] font-medium text-slate-900 dark:text-white">
                        {roleLabel}
                    </span>
                </div>

                <div className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-6">
                    <span className="sm:w-44 shrink-0 text-xs sm:text-[13px] text-slate-400 dark:text-neutral-500">
                        {pick('Bergabung sejak:', 'Member since:')}
                    </span>
                    <span className="flex-1 text-xs sm:text-[13px] font-medium text-slate-900 dark:text-white">
                        {joinedAt || '-'}
                    </span>
                </div>

                <div className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-6">
                    <span className="sm:w-44 shrink-0 text-xs sm:text-[13px] text-slate-400 dark:text-neutral-500">
                        {pick('Alamat pengiriman:', 'Shipping address:')}
                    </span>
                    <div className="flex-1">
                        <Link
                            href="/addresses"
                            className="text-xs sm:text-[13px] font-medium text-slate-900 dark:text-white underline underline-offset-4 decoration-slate-300 dark:decoration-neutral-700 hover:decoration-slate-900 dark:hover:decoration-white transition"
                        >
                            {pick('Kelola buku alamat', 'Manage address book')}
                        </Link>
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="px-6 py-3.5 bg-slate-50/70 dark:bg-slate-900/40 text-xs text-slate-600 dark:text-neutral-400">
                        {pick('Email belum terverifikasi.', 'Email not verified yet.')}{' '}
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="font-semibold text-slate-900 dark:text-white underline underline-offset-2"
                        >
                            {pick('Kirim ulang tautan verifikasi', 'Resend verification link')}
                        </Link>
                        {status === 'verification-link-sent' && (
                            <span className="ml-2 text-slate-700 dark:text-neutral-300 font-medium">
                                {pick('(Tautan baru telah dikirim)', '(New link sent)')}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </form>
    );
}
