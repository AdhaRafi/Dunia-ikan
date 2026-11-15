import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PasswordInput from '@/Components/PasswordInput';
import TextInput from '@/Components/TextInput';
import GuestLayout, { authPrimaryButtonClass } from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ShoppingBag, Store } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        account_type: 'buyer',
        seller_store_name: '',
        seller_application_note: '',
    });

    const isSellerApplicant = data.account_type === 'seller';

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout
            eyebrow="Bergabung dengan Dunia Ikan"
            headline="Temukan ikan hias terkurasi dan konsultasi langsung bersama Kiko."
        >
            <Head title="Daftar — Dunia Ikan" />

            <div>
                <h1 className="text-[24px] sm:text-[26px] font-bold tracking-[-0.025em] text-slate-900 dark:text-white">
                    Buat akun
                </h1>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                    {isSellerApplicant
                        ? 'Ajukan akun penjual untuk membuka toko. Admin akan memverifikasi pengajuan Anda.'
                        : 'Daftar gratis sebagai pembeli untuk memesan ikan dan menyimpan riwayat konsultasi.'}
                </p>
            </div>

            <form onSubmit={submit} className="mt-4 space-y-3.5">
                <div>
                    <InputLabel value="Daftar sebagai" />
                    <div
                        role="radiogroup"
                        aria-label="Jenis akun"
                        className="mt-1.5 grid grid-cols-2 gap-2.5"
                    >
                        <button
                            type="button"
                            role="radio"
                            aria-checked={!isSellerApplicant}
                            onClick={() => setData('account_type', 'buyer')}
                            className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition ${
                                !isSellerApplicant
                                    ? 'border-[#2448f5] bg-[#2448f5]/[0.06] ring-1 ring-[#2448f5] dark:border-sky-400 dark:bg-sky-500/10 dark:ring-sky-400'
                                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700'
                            }`}
                        >
                            <ShoppingBag
                                className={`mt-0.5 h-4 w-4 shrink-0 ${
                                    !isSellerApplicant
                                        ? 'text-[#2448f5] dark:text-sky-400'
                                        : 'text-slate-400'
                                }`}
                            />
                            <span className="min-w-0">
                                <span className="block text-[13px] font-semibold text-slate-900 dark:text-white leading-tight">
                                    Pembeli
                                </span>
                                <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                                    Belanja langsung
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
                                    ? 'border-[#2448f5] bg-[#2448f5]/[0.06] ring-1 ring-[#2448f5] dark:border-sky-400 dark:bg-sky-500/10 dark:ring-sky-400'
                                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700'
                            }`}
                        >
                            <Store
                                className={`mt-0.5 h-4 w-4 shrink-0 ${
                                    isSellerApplicant
                                        ? 'text-[#2448f5] dark:text-sky-400'
                                        : 'text-slate-400'
                                }`}
                            />
                            <span className="min-w-0">
                                <span className="block text-[13px] font-semibold text-slate-900 dark:text-white leading-tight">
                                    Ingin Berjualan
                                </span>
                                <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                                    Perlu acc admin
                                </span>
                            </span>
                        </button>
                    </div>
                    <InputError message={errors.account_type} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Nama lengkap" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1.5"
                        placeholder="Nama lengkap Anda"
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
                        className="mt-1.5"
                        placeholder="nama@email.com"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                {isSellerApplicant && (
                    <div className="space-y-3 rounded-xl border border-amber-200/80 bg-amber-50/60 p-3 dark:border-amber-500/30 dark:bg-amber-950/20">
                        <div>
                            <InputLabel htmlFor="seller_store_name" value="Nama rencana toko / farm" />
                            <TextInput
                                id="seller_store_name"
                                name="seller_store_name"
                                value={data.seller_store_name}
                                className="mt-1.5"
                                placeholder="Contoh: Nusantara Betta Farm"
                                onChange={(e) => setData('seller_store_name', e.target.value)}
                                required
                            />
                            <InputError message={errors.seller_store_name} className="mt-1.5" />
                        </div>

                        <div>
                            <InputLabel htmlFor="seller_application_note" value="Catatan untuk admin (opsional)" />
                            <TextInput
                                id="seller_application_note"
                                name="seller_application_note"
                                value={data.seller_application_note}
                                className="mt-1.5"
                                placeholder="Jenis ikan yang dijual / domisili toko"
                                onChange={(e) => setData('seller_application_note', e.target.value)}
                            />
                            <InputError message={errors.seller_application_note} className="mt-1.5" />
                        </div>

                        <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-200/90">
                            Akun langsung aktif untuk belanja. Fitur penjual terbuka setelah admin menyetujui pengajuan Anda.
                        </p>
                    </div>
                )}

                <div>
                    <InputLabel htmlFor="password" value="Kata sandi" />
                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        wrapperClassName="mt-1.5"
                        placeholder="Minimal 8 karakter"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
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
                        required
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1.5"
                    />
                </div>

                <div className="pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className={authPrimaryButtonClass}
                    >
                        {processing
                            ? 'Mendaftarkan...'
                            : isSellerApplicant
                              ? 'Daftar & Ajukan Penjual'
                              : 'Buat Akun'}
                    </button>
                </div>
            </form>

            <p className="mt-4 text-center text-[13px] text-slate-500 dark:text-slate-400">
                Sudah punya akun?{' '}
                <Link
                    href="/login"
                    className="font-semibold text-[#2448f5] dark:text-sky-400 hover:underline"
                >
                    Masuk
                </Link>
            </p>
        </GuestLayout>
    );
}
