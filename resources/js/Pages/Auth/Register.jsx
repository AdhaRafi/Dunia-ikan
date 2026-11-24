import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PasswordInput, { getPasswordConfirmationError } from '@/Components/PasswordInput';
import SocialAuthButtons from '@/Components/SocialAuthButtons';
import TextInput from '@/Components/TextInput';
import TurnstileWidget from '@/Components/TurnstileWidget';
import GuestLayout, { authPrimaryButtonClass } from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ShoppingBag, Store } from '@/Components/Icons';
import { useLanguage } from '@/lib/i18n';
import { getEmailValidationError, getPhoneValidationError } from '@/lib/validation';
import { useState } from 'react';

export default function Register() {
    const { pick } = useLanguage();
    const { turnstileSiteKey = null } = usePage().props;
    const [turnstileResetKey, setTurnstileResetKey] = useState(0);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        account_type: 'buyer',
        seller_store_name: '',
        seller_application_note: '',
        'cf-turnstile-response': '',
    });

    const isSellerApplicant = data.account_type === 'seller';
    const emailError = getEmailValidationError(data.email, errors.email, pick);
    const phoneError = getPhoneValidationError(data.phone, errors.phone, pick);
    const hasPasswordMismatch = Boolean(data.password_confirmation) && data.password !== data.password_confirmation;
    const passwordConfirmationError = getPasswordConfirmationError(
        data.password,
        data.password_confirmation,
        errors.password_confirmation,
        pick,
    );
    const hasClientValidationError =
        Boolean(getEmailValidationError(data.email, '', pick)) ||
        Boolean(getPhoneValidationError(data.phone, '', pick)) ||
        hasPasswordMismatch;

    const submit = (e) => {
        e.preventDefault();

        if (hasClientValidationError) {
            return;
        }

        post(route('register'), {
            onFinish: () => {
                reset('password', 'password_confirmation', 'cf-turnstile-response');
                setTurnstileResetKey((value) => value + 1);
            },
        });
    };

    return (
        <GuestLayout
            eyebrow={pick('Bergabung dengan Dunia Ikan', 'Join Dunia Ikan')}
            headline={pick(
                'Temukan ikan hias terkurasi dan konsultasi langsung bersama Kiko.',
                'Discover curated ornamental fish and consult directly with Kiko.'
            )}
        >
            <Head title={pick('Daftar | Dunia Ikan', 'Sign Up | Dunia Ikan')} />

            <div>
                <h1 className="text-[24px] sm:text-[26px] font-bold tracking-[-0.025em] text-slate-900 dark:text-white">
                    {pick('Buat akun', 'Create account')}
                </h1>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                    {isSellerApplicant
                        ? pick(
                              'Ajukan akun penjual untuk membuka toko. Admin akan memverifikasi pengajuan Anda.',
                              'Apply for a seller account to open a store. An admin will review your application.'
                          )
                        : pick(
                              'Daftar gratis sebagai pembeli untuk memesan ikan dan menyimpan riwayat konsultasi.',
                              'Sign up free as a buyer to order fish and save your consultation history.'
                          )}
                </p>
            </div>

            <form onSubmit={submit} className="mt-4 space-y-3.5">
                <div>
                    <InputLabel value={pick('Daftar sebagai', 'Register as')} />
                    <div
                        role="radiogroup"
                        aria-label={pick('Jenis akun', 'Account type')}
                        className="mt-1.5 grid grid-cols-2 gap-2.5"
                    >
                        <button
                            type="button"
                            role="radio"
                            aria-checked={!isSellerApplicant}
                            onClick={() => setData('account_type', 'buyer')}
                            className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition ${
                                !isSellerApplicant
                                    ? 'border-[#005A9D] bg-[#005A9D]/[0.06] ring-1 ring-[#005A9D] dark:border-sky-400 dark:bg-sky-500/10 dark:ring-sky-400'
                                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700'
                            }`}
                        >
                            <ShoppingBag
                                className={`mt-0.5 h-4 w-4 shrink-0 ${
                                    !isSellerApplicant
                                        ? 'text-[#005A9D] dark:text-sky-400'
                                        : 'text-slate-400'
                                }`}
                            />
                            <span className="min-w-0">
                                <span className="block text-[13px] font-semibold text-slate-900 dark:text-white leading-tight">
                                    {pick('Pembeli', 'Buyer')}
                                </span>
                                <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                                    {pick('Belanja langsung', 'Shop directly')}
                                </span>
                            </span>
                        </button>

                        <button
                            type="button"
                            role="radio"
                            aria-checked={isSellerApplicant}
                            onClick={() => setData('account_type', 'seller')}
                            className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition ${
                                isSellerApplicant
                                    ? 'border-[#005A9D] bg-[#005A9D]/[0.06] ring-1 ring-[#005A9D] dark:border-sky-400 dark:bg-sky-500/10 dark:ring-sky-400'
                                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700'
                            }`}
                        >
                            <Store
                                className={`mt-0.5 h-4 w-4 shrink-0 ${
                                    isSellerApplicant
                                        ? 'text-[#005A9D] dark:text-sky-400'
                                        : 'text-slate-400'
                                }`}
                            />
                            <span className="min-w-0">
                                <span className="block text-[13px] font-semibold text-slate-900 dark:text-white leading-tight">
                                    {pick('Ingin Berjualan', 'Sell on Platform')}
                                </span>
                                <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                                    {pick('Perlu acc admin', 'Admin approval')}
                                </span>
                            </span>
                        </button>
                    </div>
                    <InputError message={errors.account_type} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="name" value={pick('Nama lengkap', 'Full name')} />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1.5"
                        placeholder={pick('Nama lengkap Anda', 'Your full name')}
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className={`mt-1.5 ${
                            emailError
                                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-400'
                                : ''
                        }`}
                        placeholder="nama@gmail.com"
                        autoComplete="username"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        aria-invalid={Boolean(emailError)}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={emailError} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="phone"
                        value={pick('Nomor HP / WhatsApp', 'Phone / WhatsApp Number')}
                    />
                    <TextInput
                        id="phone"
                        type="tel"
                        name="phone"
                        value={data.phone}
                        className={`mt-1.5 ${
                            phoneError
                                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-400'
                                : ''
                        }`}
                        placeholder={pick('Contoh: 081234567890', 'Example: 081234567890')}
                        autoComplete="tel"
                        inputMode="tel"
                        aria-invalid={Boolean(phoneError)}
                        onChange={(e) => setData('phone', e.target.value)}
                        required
                    />
                    <InputError message={phoneError} className="mt-1.5" />
                </div>

                {isSellerApplicant && (
                    <div className="space-y-3 rounded-xl border border-amber-200/80 bg-amber-50/60 p-3 dark:border-amber-500/30 dark:bg-amber-950/20">
                        <div>
                            <InputLabel
                                htmlFor="seller_store_name"
                                value={pick('Nama rencana toko / farm', 'Planned store / farm name')}
                            />
                            <TextInput
                                id="seller_store_name"
                                name="seller_store_name"
                                value={data.seller_store_name}
                                className="mt-1.5"
                                placeholder={pick('Contoh: Nusantara Betta Farm', 'Example: Nusantara Betta Farm')}
                                onChange={(e) => setData('seller_store_name', e.target.value)}
                                required
                            />
                            <InputError message={errors.seller_store_name} className="mt-1.5" />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="seller_application_note"
                                value={pick('Catatan untuk admin (opsional)', 'Note for admin (optional)')}
                            />
                            <TextInput
                                id="seller_application_note"
                                name="seller_application_note"
                                value={data.seller_application_note}
                                className="mt-1.5"
                                placeholder={pick('Jenis ikan yang dijual / domisili toko', 'Fish species sold / store city')}
                                onChange={(e) => setData('seller_application_note', e.target.value)}
                            />
                            <InputError message={errors.seller_application_note} className="mt-1.5" />
                        </div>

                        <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-200/90">
                            {pick(
                                'Akun langsung aktif untuk belanja. Fitur penjual terbuka setelah admin menyetujui pengajuan Anda.',
                                'Your buyer account is active right away. Seller features unlock once an admin approves your application.'
                            )}
                        </p>
                    </div>
                )}

                <div>
                    <InputLabel htmlFor="password" value={pick('Kata sandi', 'Password')} />
                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        wrapperClassName="mt-1.5"
                        placeholder={pick('Minimal 8 karakter', 'At least 8 characters')}
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
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
                        required
                    />
                    <InputError
                        message={passwordConfirmationError}
                        className="mt-1.5"
                    />
                </div>

                <TurnstileWidget
                    action="signup"
                    resetTrigger={turnstileResetKey}
                    error={errors['cf-turnstile-response']}
                    onVerify={(token) => setData('cf-turnstile-response', token)}
                    onExpire={() => setData('cf-turnstile-response', '')}
                />

                <div className="pt-1">
                    <button
                        type="submit"
                        disabled={
                            processing ||
                            hasClientValidationError ||
                            (Boolean(turnstileSiteKey) && !data['cf-turnstile-response'])
                        }
                        className={authPrimaryButtonClass}
                    >
                        {processing
                            ? pick('Mendaftarkan...', 'Registering...')
                            : isSellerApplicant
                              ? pick('Daftar & Ajukan Penjual', 'Sign Up & Apply as Seller')
                              : pick('Buat Akun', 'Create Account')}
                    </button>
                </div>
            </form>

            <SocialAuthButtons error={errors.social} mode="register" />

            <p className="mt-4 text-center text-[13px] text-slate-500 dark:text-slate-400">
                {pick('Sudah punya akun?', 'Already have an account?')}{' '}
                <Link
                    href="/login"
                    className="font-semibold text-[#005A9D] dark:text-sky-400 hover:underline"
                >
                    {pick('Masuk', 'Sign in')}
                </Link>
            </p>
        </GuestLayout>
    );
}
