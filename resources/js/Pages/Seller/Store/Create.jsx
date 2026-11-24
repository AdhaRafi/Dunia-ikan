import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Clock,
    ShieldCheck,
    Store,
    XCircle,
} from '@/Components/Icons';
import { useLanguage } from '@/lib/i18n';
import { getPhoneValidationError } from '@/lib/validation';

export default function Create({
    verificationStatus = 'none',
    pendingStoreName = '',
    applicationNote = '',
}) {
    const { pick } = useLanguage();
    const { auth } = usePage().props;
    const user = auth?.user;
    const isVerifiedSeller = user?.role === 'seller' || user?.role === 'admin';
    const isPending = !isVerifiedSeller && verificationStatus === 'pending';
    const isRejected = !isVerifiedSeller && verificationStatus === 'rejected';

    const applicationForm = useForm({
        seller_store_name: pendingStoreName || '',
        phone: user?.phone || '',
        seller_application_note: applicationNote || '',
    });

    const applicationPhoneError = getPhoneValidationError(
        applicationForm.data.phone,
        applicationForm.errors.phone,
        pick,
    );

    const storeForm = useForm({
        name: pendingStoreName || '',
        city: 'Kota Bandung',
        province: 'Jawa Barat',
        address: '',
        phone: user?.phone || '',
        description: '',
        doa_policy: 'Garansi 100% ikan hidup sampai tujuan ke seluruh Pulau Jawa & Bali. Syarat klaim wajib menyertakan video unboxing utuh tanpa jeda maksimal 2 jam setelah paket tiba.',
        bank_name: 'BCA',
        bank_account_number: '',
        bank_account_name: '',
    });

    const storePhoneError = getPhoneValidationError(
        storeForm.data.phone,
        storeForm.errors.phone,
        pick,
    );

    const handleSubmitApplication = (e) => {
        e.preventDefault();
        if (getPhoneValidationError(applicationForm.data.phone, '', pick)) {
            return;
        }
        applicationForm.post('/seller/register');
    };

    const handleSubmitStore = (e) => {
        e.preventDefault();
        if (getPhoneValidationError(storeForm.data.phone, '', pick)) {
            return;
        }
        storeForm.post('/seller/register');
    };

    return (
        <AppLayout>
            <Head title={pick('Buka Toko Penangkar Ikan - Dunia Ikan', 'Open a Breeder Store — Dunia Ikan')} />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-dunia-blue dark:text-slate-400 dark:hover:text-sky-400 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {pick('Kembali', 'Back')}
                </Link>

                {isPending && (
                    <div className="bg-white dark:bg-[#0e1424] p-6 sm:p-8 rounded-3xl border border-amber-200 dark:border-amber-500/30 shadow-sm space-y-5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                                    {pick('Menunggu Verifikasi Admin', 'Pending Admin Verification')}
                                </span>
                                <h1 className="text-xl sm:text-2xl font-extrabold text-dunia-navy dark:text-white pt-1">
                                    {pick('Pengajuan Akun Penjual Sedang Ditinjau', 'Seller Application Under Review')}
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {pick(
                                        'Terima kasih telah mendaftar sebagai calon penangkar di Dunia Ikan. Admin kami akan memeriksa pengajuan Anda terlebih dahulu sebelum fitur toko diaktifkan.',
                                        'Thank you for applying as a breeder on Dunia Ikan. Our admin team will review your application before activating store features.'
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-slate-50 dark:bg-[#0b101d] border border-slate-200/80 dark:border-neutral-800 p-4 space-y-2.5 text-xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <span className="text-slate-500 dark:text-slate-400">
                                    {pick('Nama Rencana Toko', 'Planned Store Name')}
                                </span>
                                <span className="font-bold text-slate-900 dark:text-white">
                                    {pendingStoreName || '-'}
                                </span>
                            </div>
                            {applicationNote && (
                                <div className="pt-2 border-t border-slate-200/70 dark:border-neutral-800">
                                    <span className="block text-slate-500 dark:text-slate-400 mb-0.5">
                                        {pick('Catatan Pengajuan', 'Application Note')}
                                    </span>
                                    <p className="text-slate-700 dark:text-slate-200">{applicationNote}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <Link
                                href="/products"
                                className="px-5 py-2.5 rounded-xl bg-[#005A9D] text-white font-bold text-xs hover:bg-[#00477C] transition"
                            >
                                {pick('Jelajahi Katalog Ikan', 'Browse Fish Catalog')}
                            </Link>
                            <Link
                                href="/profile"
                                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-neutral-800 transition"
                            >
                                {pick('Buka Profil Saya', 'Open My Profile')}
                            </Link>
                        </div>
                    </div>
                )}

                {!isVerifiedSeller && !isPending && (
                    <div className="bg-white dark:bg-[#0e1424] p-6 sm:p-8 rounded-3xl border border-sky-100 dark:border-neutral-800 shadow-md space-y-6">
                        {isRejected && (
                            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/30 flex items-start gap-3 text-xs text-rose-800 dark:text-rose-200">
                                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold">
                                        {pick('Pengajuan Sebelumnya Ditolak', 'Previous Application Rejected')}
                                    </p>
                                    <p className="mt-0.5 text-rose-700 dark:text-rose-300">
                                        {pick(
                                            'Anda dapat memperbarui nama toko dan informasi penangkar di bawah untuk mengajukan verifikasi ulang.',
                                            'You can update your planned store name and breeder details below to resubmit for verification.'
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-neutral-800">
                            <div className="w-12 h-12 rounded-2xl bg-dunia-blue/10 text-dunia-blue flex items-center justify-center font-bold shrink-0">
                                <Store className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-extrabold text-dunia-navy dark:text-white">
                                    {pick('Ajukan Verifikasi Akun Penjual', 'Apply for Seller Verification')}
                                </h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {pick(
                                        'Setiap calon penjual perlu verifikasi admin sebelum dapat membuka toko dan menambahkan produk.',
                                        'Every seller applicant requires admin approval before opening a store and listing products.'
                                    )}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                    {pick('Nama Rencana Toko / Farm', 'Planned Store / Farm Name')}
                                </label>
                                <input
                                    type="text"
                                    placeholder={pick('Contoh: Bandung Betta Champion', 'Example: Bandung Betta Champion')}
                                    value={applicationForm.data.seller_store_name}
                                    onChange={(e) => applicationForm.setData('seller_store_name', e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                    required
                                />
                                {applicationForm.errors.seller_store_name && (
                                    <p className="text-rose-600 mt-1">{applicationForm.errors.seller_store_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                    {pick('Nomor HP / WhatsApp Aktif Penjual', 'Active Seller Phone / WhatsApp')}
                                </label>
                                <input
                                    type="tel"
                                    inputMode="tel"
                                    placeholder="081234567890"
                                    value={applicationForm.data.phone}
                                    onChange={(e) => applicationForm.setData('phone', e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                    required
                                />
                                {applicationPhoneError && (
                                    <p className="text-rose-600 mt-1">{applicationPhoneError}</p>
                                )}
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                    {pick('Catatan untuk Admin (Opsional)', 'Note for Admin (Optional)')}
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder={pick(
                                        'Ceritakan jenis ikan hias / perlengkapan yang ingin dijual dan kota domisili...',
                                        'Tell us what ornamental fish or equipment you plan to sell and your city...'
                                    )}
                                    value={applicationForm.data.seller_application_note}
                                    onChange={(e) => applicationForm.setData('seller_application_note', e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                />
                                {applicationForm.errors.seller_application_note && (
                                    <p className="text-rose-600 mt-1">{applicationForm.errors.seller_application_note}</p>
                                )}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={applicationForm.processing}
                                    className="w-full py-3.5 px-6 rounded-2xl bg-[#005A9D] text-white font-bold text-sm hover:bg-[#00477C] transition flex items-center justify-center gap-2 shadow-lg shadow-[#005A9D]/20"
                                >
                                    {applicationForm.processing
                                        ? pick('Mengirim Pengajuan...', 'Submitting Application...')
                                        : pick('Kirim Pengajuan Penjual', 'Submit Seller Application')}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {isVerifiedSeller && (
                    <div className="bg-white dark:bg-[#0e1424] p-6 sm:p-8 rounded-3xl border border-sky-100 dark:border-neutral-800 shadow-md space-y-6">
                        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>
                                {pick(
                                    'Akun penjual Anda telah disetujui admin. Lengkapi detail toko untuk mulai berjualan.',
                                    'Your seller account has been approved. Complete your store profile below to start selling.'
                                )}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-neutral-800">
                            <div className="w-12 h-12 rounded-2xl bg-dunia-blue/10 text-dunia-blue flex items-center justify-center font-bold">
                                <Store className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-extrabold text-dunia-navy dark:text-white">
                                    {pick('Pendaftaran Toko Penangkar Ikan', 'Breeder Store Registration')}
                                </h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {pick(
                                        'Mulai jual ikan hias, mutasi morph, dan aquascape dengan garansi hidup terstandarisasi.',
                                        'Start selling ornamental fish, morph variants, and aquascape gear with standardized live arrival protection.'
                                    )}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitStore} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                    {pick('Nama Toko Penangkar', 'Breeder Store Name')}
                                </label>
                                <input
                                    type="text"
                                    placeholder={pick('Contoh: Bandung Betta Champion', 'Example: Bandung Betta Champion')}
                                    value={storeForm.data.name}
                                    onChange={(e) => storeForm.setData('name', e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                    required
                                />
                                {storeForm.errors.name && <p className="text-rose-600 mt-1">{storeForm.errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                        {pick('Kota / Kabupaten', 'City / Regency')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={pick('Contoh: Kota Bandung', 'Example: Bandung')}
                                        value={storeForm.data.city}
                                        onChange={(e) => storeForm.setData('city', e.target.value)}
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                        required
                                    />
                                    {storeForm.errors.city && <p className="text-rose-600 mt-1">{storeForm.errors.city}</p>}
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                        {pick('Nomor Kontak Toko / WhatsApp', 'Store Contact / WhatsApp')}
                                    </label>
                                    <input
                                        type="tel"
                                        inputMode="tel"
                                        placeholder="081234567890"
                                        value={storeForm.data.phone}
                                        onChange={(e) => storeForm.setData('phone', e.target.value)}
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                        required
                                    />
                                    {storePhoneError && <p className="text-rose-600 mt-1">{storePhoneError}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                    {pick('Alamat Farm / Toko Lengkap', 'Full Farm / Store Address')}
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder={pick('Alamat lengkap lokasi farm atau workshop...', 'Full address of your farm or workshop...')}
                                    value={storeForm.data.address}
                                    onChange={(e) => storeForm.setData('address', e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                    required
                                />
                                {storeForm.errors.address && <p className="text-rose-600 mt-1">{storeForm.errors.address}</p>}
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                    {pick('Deskripsi & Spesialisasi Toko', 'Store Description & Specialty')}
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder={pick(
                                        'Jelaskan jenis ikan atau variasi yang biasa Anda tangkarkan...',
                                        'Describe the fish species or morphs you breed...'
                                    )}
                                    value={storeForm.data.description}
                                    onChange={(e) => storeForm.setData('description', e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                />
                            </div>

                            {/* DOA Guarantee Policy */}
                            <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-500/20 space-y-2">
                                <label className="block font-bold text-dunia-navy dark:text-sky-300 uppercase flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4 text-dunia-aqua" />
                                    {pick('Kebijakan Garansi Ikan Hidup (Live Arrival Policy)', 'Live Arrival Guarantee (DOA Policy)')}
                                </label>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    {pick(
                                        'Tuliskan syarat klaim untuk pembeli (seperti video unboxing tanpa jeda, batas waktu lapor, dll).',
                                        'Specify buyer claim conditions (e.g., continuous unboxing video, reporting window, etc.).'
                                    )}
                                </p>
                                <textarea
                                    rows={3}
                                    value={storeForm.data.doa_policy}
                                    onChange={(e) => storeForm.setData('doa_policy', e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 dark:text-white"
                                />
                            </div>

                            {/* Rekening Bank untuk Penerimaan Pembayaran */}
                            <div className="pt-2 border-t border-slate-100 dark:border-neutral-800 space-y-3">
                                <p className="font-bold text-slate-700 dark:text-slate-300 uppercase text-xs">
                                    {pick('Rekening Pembayaran Toko', 'Store Payout Bank Account')}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <input
                                        type="text"
                                        placeholder={pick('Nama Bank (e.g. BCA)', 'Bank Name (e.g. BCA)')}
                                        value={storeForm.data.bank_name}
                                        onChange={(e) => storeForm.setData('bank_name', e.target.value)}
                                        className="p-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                    />
                                    <input
                                        type="text"
                                        placeholder={pick('Nomor Rekening', 'Account Number')}
                                        value={storeForm.data.bank_account_number}
                                        onChange={(e) => storeForm.setData('bank_account_number', e.target.value)}
                                        className="p-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                    />
                                    <input
                                        type="text"
                                        placeholder={pick('Atas Nama Pemilik Rekening', 'Account Holder Name')}
                                        value={storeForm.data.bank_account_name}
                                        onChange={(e) => storeForm.setData('bank_account_name', e.target.value)}
                                        className="p-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={storeForm.processing}
                                    className="w-full py-3.5 px-6 rounded-2xl bg-[#005A9D] text-white font-bold text-sm hover:bg-[#00477C] transition flex items-center justify-center gap-2 shadow-lg shadow-[#005A9D]/20"
                                >
                                    {storeForm.processing
                                        ? pick('Mendaftarkan Toko...', 'Registering Store...')
                                        : pick('Selesaikan Pendaftaran Toko', 'Complete Store Registration')}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
