import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { MapPin, Plus, Trash2, Edit3, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function Index({ addresses }) {
    const [editingAddress, setEditingAddress] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        recipient_name: '',
        phone: '',
        city: '',
        province: 'Jawa Barat',
        postal_code: '',
        full_address: '',
        is_primary: false,
    });

    const openCreate = () => {
        setEditingAddress(null);
        reset();
        setShowForm(true);
    };

    const openEdit = (addr) => {
        setEditingAddress(addr);
        setData({
            recipient_name: addr.recipient_name,
            phone: addr.phone,
            city: addr.city,
            province: addr.province,
            postal_code: addr.postal_code,
            full_address: addr.full_address,
            is_primary: addr.is_primary,
        });
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingAddress) {
            put(`/addresses/${editingAddress.id}`, {
                onSuccess: () => setShowForm(false),
            });
        } else {
            post('/addresses', {
                onSuccess: () => setShowForm(false),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Hapus alamat pengiriman ini?')) {
            router.delete(`/addresses/${id}`);
        }
    };

    const handleSetPrimary = (id) => {
        router.post(`/addresses/${id}/primary`);
    };

    return (
        <AppLayout>
            <Head title="Buku Alamat Pengiriman - Dunia Ikan" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-dunia-navy tracking-tight">
                            Buku Alamat Pengiriman
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Kelola alamat pengiriman ikan hidup ke rumah atau kantor Anda.
                        </p>
                    </div>

                    {!showForm && (
                        <button
                            type="button"
                            onClick={openCreate}
                            className="px-4 py-2.5 rounded-xl bg-dunia-blue text-white font-bold text-xs hover:bg-sky-600 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Alamat Baru
                        </button>
                    )}
                </div>

                {/* Form Add / Edit */}
                {showForm && (
                    <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-md space-y-4 animate-in fade-in">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h2 className="font-bold text-sm text-dunia-navy">
                                {editingAddress ? 'Edit Alamat Pengiriman' : 'Tambah Alamat Pengiriman Baru'}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="text-xs text-slate-400 hover:text-slate-600"
                            >
                                Batal
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase mb-1">Nama Penerima</label>
                                    <input
                                        type="text"
                                        value={data.recipient_name}
                                        onChange={(e) => setData('recipient_name', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200"
                                        required
                                    />
                                    {errors.recipient_name && <p className="text-rose-600 mt-1">{errors.recipient_name}</p>}
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 uppercase mb-1">Nomor Telepon / WhatsApp</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200"
                                        required
                                    />
                                    {errors.phone && <p className="text-rose-600 mt-1">{errors.phone}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase mb-1">Kota / Kabupaten</label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200"
                                        required
                                    />
                                    {errors.city && <p className="text-rose-600 mt-1">{errors.city}</p>}
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 uppercase mb-1">Provinsi</label>
                                    <input
                                        type="text"
                                        value={data.province}
                                        onChange={(e) => setData('province', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 uppercase mb-1">Kode Pos</label>
                                    <input
                                        type="text"
                                        value={data.postal_code}
                                        onChange={(e) => setData('postal_code', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 uppercase mb-1">Alamat Lengkap (Jalan, No. Rumah, RT/RW, Patokan)</label>
                                <textarea
                                    rows={3}
                                    value={data.full_address}
                                    onChange={(e) => setData('full_address', e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-slate-200"
                                    required
                                />
                                {errors.full_address && <p className="text-rose-600 mt-1">{errors.full_address}</p>}
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer pt-1">
                                <input
                                    type="checkbox"
                                    checked={data.is_primary}
                                    onChange={(e) => setData('is_primary', e.target.checked)}
                                    className="rounded-sm text-dunia-blue focus:ring-dunia-aqua"
                                />
                                <span className="font-semibold text-slate-700">Jadikan alamat pengiriman utama</span>
                            </label>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 rounded-xl bg-dunia-blue text-white font-bold hover:bg-sky-600"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Alamat'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Address Cards List */}
                <div className="space-y-4">
                    {addresses?.map((addr) => (
                        <div
                            key={addr.id}
                            className={`p-5 rounded-2xl bg-white border transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                addr.is_primary ? 'border-dunia-blue ring-1 ring-dunia-blue/30' : 'border-sky-100'
                            }`}
                        >
                            <div className="text-xs space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-slate-900">{addr.recipient_name}</span>
                                    <span className="text-slate-500 font-medium">({addr.phone})</span>
                                    {addr.is_primary && (
                                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-dunia-blue font-bold text-[10px]">
                                            Alamat Utama
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    {addr.full_address}
                                </p>
                                <p className="text-slate-400">
                                    {addr.city}, {addr.province} {addr.postal_code}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-xs">
                                {!addr.is_primary && (
                                    <button
                                        type="button"
                                        onClick={() => handleSetPrimary(addr.id)}
                                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-sky-50 text-slate-700 font-semibold"
                                    >
                                        Set Utama
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => openEdit(addr)}
                                    className="p-2 text-slate-500 hover:text-dunia-blue rounded-lg hover:bg-sky-50"
                                    title="Edit"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(addr.id)}
                                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                                    title="Hapus"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
