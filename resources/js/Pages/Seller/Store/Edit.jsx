import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { Store, ShieldCheck, Upload, Save, Trash2 } from 'lucide-react';

export default function Edit({ store }) {
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
        setData((prev) => ({ ...prev, logo: file, remove_logo: false }));
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleRemoveLogo = () => {
        if (logoPreview) {
            URL.revokeObjectURL(logoPreview);
        }
        setLogoPreview(null);
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
            <Head title="Profil Toko & Garansi DOA - Portal Penjual" />

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div>
                    <h1 className="text-xl font-extrabold text-dunia-navy">
                        Profil Toko & Kebijakan Garansi Hidup (DOA)
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Atur foto profil toko, informasi penangkar, rekening pembayaran, dan ketentuan garansi hidup ikan.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                    {/* Foto Profil / Logo Toko */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <div className="shrink-0">
                            {displayedLogo ? (
                                <img
                                    src={displayedLogo}
                                    alt={data.name || store.name}
                                    className="w-16 h-16 rounded-full object-cover border border-slate-200 bg-white"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-lg text-dunia-navy">
                                    {(data.name || store.name || 'T').charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <div>
                                <p className="font-bold text-slate-700 uppercase">Foto Profil Toko</p>
                                <p className="text-[11px] text-slate-500">
                                    Ditampilkan di halaman utama &ldquo;Toko Pilihan&rdquo; dan profil toko. Format JPG/PNG/WebP, maks 2 MB.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-dunia-blue text-slate-700 font-semibold cursor-pointer transition">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>{displayedLogo ? 'Ganti Foto' : 'Upload Foto Toko'}</span>
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
                                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold transition"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Hapus Foto</span>
                                    </button>
                                )}
                            </div>
                            {errors.logo && <p className="text-rose-600">{errors.logo}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">Nama Toko</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200"
                            required
                        />
                        {errors.name && <p className="text-rose-600 mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold text-slate-700 uppercase mb-1">Kota / Kabupaten</label>
                            <input
                                type="text"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                className="w-full p-2.5 rounded-xl border border-slate-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 uppercase mb-1">Kontak WhatsApp / Telepon</label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full p-2.5 rounded-xl border border-slate-200"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">Alamat Farm / Toko Lengkap</label>
                        <textarea
                            rows={2}
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">Deskripsi & Profil Toko</label>
                        <textarea
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200"
                        />
                    </div>

                    {/* Live Arrival DOA Guarantee */}
                    <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100 space-y-2">
                        <label className="block font-bold text-dunia-navy uppercase flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-dunia-aqua" />
                            Kebijakan Garansi Ikan Hidup (Live Arrival Policy)
                        </label>
                        <textarea
                            rows={3}
                            value={data.doa_policy}
                            onChange={(e) => setData('doa_policy', e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                        />
                    </div>

                    {/* Bank Account Settings */}
                    <div className="pt-2 border-t border-slate-100 space-y-3">
                        <p className="font-bold text-slate-700 uppercase text-xs">Rekening Bank untuk Pembayaran Manual</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-slate-500 mb-1">Bank</label>
                                <input
                                    type="text"
                                    placeholder="e.g. BCA / Mandiri"
                                    value={data.bank_name}
                                    onChange={(e) => setData('bank_name', e.target.value)}
                                    className="w-full p-2 rounded-xl border border-slate-200"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-500 mb-1">Nomor Rekening</label>
                                <input
                                    type="text"
                                    value={data.bank_account_number}
                                    onChange={(e) => setData('bank_account_number', e.target.value)}
                                    className="w-full p-2 rounded-xl border border-slate-200"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-500 mb-1">Atas Nama Rekening</label>
                                <input
                                    type="text"
                                    value={data.bank_account_name}
                                    onChange={(e) => setData('bank_account_name', e.target.value)}
                                    className="w-full p-2 rounded-xl border border-slate-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* QRIS Upload */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                        <label className="block font-bold text-slate-700 uppercase text-xs">Foto QRIS Toko (Opsional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('qris_image', e.target.files[0])}
                            className="text-xs text-slate-500"
                        />
                        {store.qris_image && (
                            <p className="text-[11px] text-slate-400">QRIS saat ini sudah terpasang.</p>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 rounded-xl bg-dunia-blue text-white font-bold text-xs hover:bg-sky-600 transition flex items-center gap-2 shadow-xs cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan Toko'}
                        </button>
                    </div>
                </form>
            </div>
        </SellerLayout>
    );
}
