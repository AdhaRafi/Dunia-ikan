import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { Store, ShieldCheck, Upload, Save, Trash2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function Edit({ store }) {
    const { pick } = useLanguage();
    const { data, setData, post, processing, errors } = useForm({
        name: store.name || '',
        city: store.city || '',
        province: store.province || 'Jawa Barat',
        address: store.address || '',
        phone: store.phone || '',
        description: store.description || '',
        doa_policy: store.doa_policy || '',
        bank_name: store.bank_name || '',
        bank_account_number: store.bank_account_number || '',
        bank_account_name: store.bank_account_name || '',
        logo: null,
        remove_logo: false,
        qris_image: null,
    });

    const [logoPreview, setLogoPreview] = useState(null);
    const [logoFailed, setLogoFailed] = useState(false);

    useEffect(() => {
        return () => {
            if (logoPreview) {
                URL.revokeObjectURL(logoPreview);
            }
        };
    }, [logoPreview]);

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }
        if (logoPreview) {
            URL.revokeObjectURL(logoPreview);
        }
        setLogoFailed(false);
        setData((prev) => ({ ...prev, logo: file, remove_logo: false }));
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleRemoveLogo = () => {
        if (logoPreview) {
            URL.revokeObjectURL(logoPreview);
        }
        setLogoPreview(null);
        setLogoFailed(false);
        setData((prev) => ({ ...prev, logo: null, remove_logo: true }));
    };

    const displayedLogo = data.remove_logo ? null : logoPreview || store.logo_url;

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/seller/store', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <SellerLayout>
            <Head title={pick('Profil Toko & Garansi DOA - Portal Penjual', 'Store Profile & DOA Warranty — Seller Portal')} />

            <div className="bg-white dark:bg-[#0e1424] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                <div>
                    <h1 className="text-xl font-extrabold text-dunia-navy dark:text-white">
                        {pick('Profil Toko & Kebijakan Garansi Hidup (DOA)', 'Store Profile & Live Arrival Guarantee (DOA)')}
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {pick(
                            'Atur foto profil toko, informasi penangkar, rekening pembayaran, dan ketentuan garansi hidup ikan.',
                            'Manage your store avatar, breeder info, payout bank details, and live arrival guarantee rules.'
                        )}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                    {/* Foto Profil / Logo Toko */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#131d33] border border-slate-200/80 dark:border-slate-700/80">
                        <div className="shrink-0">
                            {displayedLogo && !logoFailed ? (
                                <img
                                    src={displayedLogo}
                                    alt={data.name || store.name}
                                    onError={() => setLogoFailed(true)}
                                    className="w-16 h-16 rounded-full object-cover border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0e1424]"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-white dark:bg-[#0e1424] border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-lg text-dunia-navy dark:text-white">
                                    {(data.name || store.name || 'T').charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <div>
                                <p className="font-bold text-slate-700 dark:text-slate-200 uppercase">
                                    {pick('Foto Profil Toko', 'Store Profile Photo')}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    {pick(
                                        'Ditampilkan di halaman utama “Toko Pilihan” dan profil toko. Format JPG/PNG/WebP, maks 2 MB.',
                                        'Shown on the “Featured Stores” section and your store page. JPG/PNG/WebP, max 2 MB.'
                                    )}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0e1424] border border-slate-200 dark:border-slate-700 hover:border-dunia-blue text-slate-700 dark:text-slate-200 font-semibold cursor-pointer transition">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>
                                        {displayedLogo
                                            ? pick('Ganti Foto', 'Change Photo')
                                            : pick('Upload Foto Toko', 'Upload Store Photo')}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                </label>
                                {displayedLogo && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveLogo}
                                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/15 font-semibold transition"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>{pick('Hapus Foto', 'Remove Photo')}</span>
                                    </button>
                                )}
                            </div>
                            {errors.logo && <p className="text-rose-600">{errors.logo}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                            {pick('Nama Toko', 'Store Name')}
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                            required
                        />
                        {errors.name && <p className="text-rose-600 mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                {pick('Kota / Kabupaten', 'City / Regency')}
                            </label>
                            <input
                                type="text"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                {pick('Kontak WhatsApp / Telepon', 'WhatsApp / Phone')}
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                            {pick('Alamat Farm / Toko Lengkap', 'Full Farm / Store Address')}
                        </label>
                        <textarea
                            rows={2}
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                            {pick('Deskripsi & Profil Toko', 'Store Description & Profile')}
                        </label>
                        <textarea
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                        />
                    </div>

                    {/* Live Arrival DOA Guarantee */}
                    <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-[#111c33] border border-sky-100 dark:border-slate-700/80 space-y-2">
                        <label className="block font-bold text-dunia-navy dark:text-white uppercase flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-dunia-aqua" />
                            {pick('Kebijakan Garansi Ikan Hidup (Live Arrival Policy)', 'Live Arrival Guarantee (DOA Policy)')}
                        </label>
                        <textarea
                            rows={3}
                            value={data.doa_policy}
                            onChange={(e) => setData('doa_policy', e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0e1424] text-slate-900 dark:text-white"
                        />
                    </div>

                    {/* Bank Account Settings */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                        <p className="font-bold text-slate-700 dark:text-slate-200 uppercase text-xs">
                            {pick('Rekening Bank untuk Pembayaran Manual', 'Bank Account for Manual Transfers')}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-slate-500 dark:text-slate-400 mb-1">Bank</label>
                                <input
                                    type="text"
                                    placeholder={pick('e.g. BCA / Mandiri', 'e.g. BCA / Mandiri')}
                                    value={data.bank_name}
                                    onChange={(e) => setData('bank_name', e.target.value)}
                                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-500 dark:text-slate-400 mb-1">
                                    {pick('Nomor Rekening', 'Account Number')}
                                </label>
                                <input
                                    type="text"
                                    value={data.bank_account_number}
                                    onChange={(e) => setData('bank_account_number', e.target.value)}
                                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-500 dark:text-slate-400 mb-1">
                                    {pick('Atas Nama Rekening', 'Account Holder Name')}
                                </label>
                                <input
                                    type="text"
                                    value={data.bank_account_name}
                                    onChange={(e) => setData('bank_account_name', e.target.value)}
                                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* QRIS Upload */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase text-xs">
                            {pick('Foto QRIS Toko (Opsional)', 'Store QRIS Image (Optional)')}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('qris_image', e.target.files[0])}
                            className="text-xs text-slate-500 dark:text-slate-400"
                        />
                        {store.qris_image && (
                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                {pick('QRIS saat ini sudah terpasang.', 'QRIS image is currently set.')}
                            </p>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 rounded-xl bg-dunia-blue text-white font-bold text-xs hover:bg-sky-600 transition flex items-center gap-2 shadow-xs cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            {processing
                                ? pick('Menyimpan...', 'Saving...')
                                : pick('Simpan Perubahan Toko', 'Save Store Changes')}
                        </button>
                    </div>
                </form>
            </div>
        </SellerLayout>
    );
}
