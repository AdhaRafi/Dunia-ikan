import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Store, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        city: 'Kota Bandung',
        province: 'Jawa Barat',
        address: '',
        phone: '',
        description: '',
        doa_policy: 'Garansi 100% ikan hidup sampai tujuan ke seluruh Pulau Jawa & Bali. Syarat klaim wajib menyertakan video unboxing utuh tanpa jeda maksimal 2 jam setelah paket tiba.',
        bank_name: 'BCA',
        bank_account_number: '',
        bank_account_name: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/seller/register');
    };

    return (
        <AppLayout>
            <Head title="Buka Toko Penangkar Ikan - Dunia Ikan" />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
                <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-dunia-blue transition">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                </Link>

                <div className="bg-white p-8 rounded-3xl border border-sky-100 shadow-md space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <div className="w-12 h-12 rounded-2xl bg-dunia-blue/10 text-dunia-blue flex items-center justify-center font-bold">
                            <Store className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-dunia-navy">
                                Pendaftaran Toko Penangkar Ikan
                            </h1>
                            <p className="text-xs text-slate-500">
                                Mulai jual ikan hias, mutasi morph, dan aquascape dengan garansi hidup terstandarisasi.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                        <div>
                            <label className="block font-bold text-slate-700 uppercase mb-1">Nama Toko Penangkar</label>
                            <input
                                type="text"
                                placeholder="Contoh: Bandung Betta Champion"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full p-3 rounded-xl border border-slate-200"
                                required
                            />
                            {errors.name && <p className="text-rose-600 mt-1">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold text-slate-700 uppercase mb-1">Kota / Kabupaten</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Kota Bandung"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200"
                                    required
                                />
                                {errors.city && <p className="text-rose-600 mt-1">{errors.city}</p>}
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 uppercase mb-1">Nomor Kontak Toko / WhatsApp</label>
                                <input
                                    type="text"
                                    placeholder="0812xxxx"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200"
                                    required
                                />
                                {errors.phone && <p className="text-rose-600 mt-1">{errors.phone}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 uppercase mb-1">Alamat Farm / Toko Lengkap</label>
                            <textarea
                                rows={2}
                                placeholder="Alamat lengkap lokasi farm atau workshop..."
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="w-full p-3 rounded-xl border border-slate-200"
                                required
                            />
                            {errors.address && <p className="text-rose-600 mt-1">{errors.address}</p>}
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 uppercase mb-1">Deskripsi & Spesialisasi Toko</label>
                            <textarea
                                rows={3}
                                placeholder="Jelaskan jenis ikan atau variasi yang biasa Anda tangkarkan..."
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full p-3 rounded-xl border border-slate-200"
                            />
                        </div>

                        {/* DOA Guarantee Policy */}
                        <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100 space-y-2">
                            <label className="block font-bold text-dunia-navy uppercase flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-dunia-aqua" />
                                Kebijakan Garansi Ikan Hidup (D.O.A. Policy)
                            </label>
                            <p className="text-[11px] text-slate-500">
                                Tuliskan syarat klaim untuk pembeli (seperti video unboxing tanpa jeda, batas waktu lapor, dll).
                            </p>
                            <textarea
                                rows={3}
                                value={data.doa_policy}
                                onChange={(e) => setData('doa_policy', e.target.value)}
                                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                            />
                        </div>

                        {/* Rekening Bank untuk Penerimaan Pembayaran */}
                        <div className="pt-2 border-t border-slate-100 space-y-3">
                            <p className="font-bold text-slate-700 uppercase text-xs">Rekening Pembayaran Toko</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <input
                                    type="text"
                                    placeholder="Nama Bank (e.g. BCA)"
                                    value={data.bank_name}
                                    onChange={(e) => setData('bank_name', e.target.value)}
                                    className="p-2.5 rounded-xl border border-slate-200"
                                />
                                <input
                                    type="text"
                                    placeholder="Nomor Rekening"
                                    value={data.bank_account_number}
                                    onChange={(e) => setData('bank_account_number', e.target.value)}
                                    className="p-2.5 rounded-xl border border-slate-200"
                                />
                                <input
                                    type="text"
                                    placeholder="Atas Nama Pemilik Rekening"
                                    value={data.bank_account_name}
                                    onChange={(e) => setData('bank_account_name', e.target.value)}
                                    className="p-2.5 rounded-xl border border-slate-200"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 px-6 rounded-2xl bg-dunia-blue text-white font-bold text-sm hover:bg-sky-600 transition flex items-center justify-center gap-2 shadow-lg shadow-dunia-blue/20"
                            >
                                {processing ? 'Mendaftarkan Toko...' : 'Selesaikan Pendaftaran Toko'}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
