import { Head, useForm } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { Store, ShieldCheck, Upload, Save } from 'lucide-react';

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
        qris_image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/seller/store');
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
                        Atur profil toko penangkar Anda, rekening pembayaran, dan ketentuan garansi hidup ikan.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 text-xs">
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
