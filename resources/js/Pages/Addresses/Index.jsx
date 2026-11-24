import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { MapPin, Plus, Trash2, Edit3, CheckCircle2, ArrowLeft } from '@/Components/Icons';
import { useLanguage } from '@/lib/i18n';

export default function Index({ addresses }) {
    const { pick } = useLanguage();
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
        if (confirm(pick('Hapus alamat pengiriman ini?', 'Delete this shipping address?'))) {
            router.delete(`/addresses/${id}`);
        }
    };

    const handleSetPrimary = (id) => {
        router.post(`/addresses/${id}/primary`);
    };

    return (
        <AppLayout>
            <Head title={pick('Buku Alamat Pengiriman - Dunia Ikan', 'Address Book — Dunia Ikan')} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-dunia-navy dark:text-white tracking-tight">
                            {pick('Buku Alamat Pengiriman', 'Shipping Address Book')}
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {pick(
                                'Kelola alamat pengiriman ikan hidup ke rumah atau kantor Anda.',
                                'Manage live fish delivery addresses for your home or office.'
                            )}
                        </p>
                    </div>

                    {!showForm && (
                        <button
                            type="button"
                            onClick={openCreate}
                            className="px-4 py-2.5 rounded-xl bg-[#005A9D] hover:bg-[#006783] text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20"
                        >
                            <Plus className="w-4 h-4" />
                            {pick('Tambah Alamat Baru', 'Add New Address')}
                        </button>
                    )}
                </div>

                {/* Form Add / Edit */}
                {showForm && (
                    <div className="bg-white dark:bg-[#0e1424] p-6 rounded-2xl border border-sky-100 dark:border-slate-800 shadow-md space-y-4 animate-in fade-in">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="font-bold text-sm text-dunia-navy dark:text-white">
                                {editingAddress
                                    ? pick('Edit Alamat Pengiriman', 'Edit Shipping Address')
                                    : pick('Tambah Alamat Pengiriman Baru', 'Add New Shipping Address')}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                {pick('Batal', 'Cancel')}
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                        {pick('Nama Penerima', 'Recipient Name')}
                                    </label>
                                    <input
                                        type="text"
                                        value={data.recipient_name}
                                        onChange={(e) => setData('recipient_name', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                        required
                                    />
                                    {errors.recipient_name && <p className="text-rose-600 dark:text-rose-400 mt-1">{errors.recipient_name}</p>}
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                        {pick('Nomor Telepon / WhatsApp', 'Phone / WhatsApp')}
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                        required
                                    />
                                    {errors.phone && <p className="text-rose-600 dark:text-rose-400 mt-1">{errors.phone}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                                    {errors.city && <p className="text-rose-600 dark:text-rose-400 mt-1">{errors.city}</p>}
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                        {pick('Provinsi', 'Province')}
                                    </label>
                                    <input
                                        type="text"
                                        value={data.province}
                                        onChange={(e) => setData('province', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                        {pick('Kode Pos', 'Postal Code')}
                                    </label>
                                    <input
                                        type="text"
                                        value={data.postal_code}
                                        onChange={(e) => setData('postal_code', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                    {pick('Alamat Lengkap (Jalan, No. Rumah, RT/RW, Patokan)', 'Full Address (Street, House No., Landmark)')}
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.full_address}
                                    onChange={(e) => setData('full_address', e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                    required
                                />
                                {errors.full_address && <p className="text-rose-600 dark:text-rose-400 mt-1">{errors.full_address}</p>}
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer pt-1">
                                <input
                                    type="checkbox"
                                    checked={data.is_primary}
                                    onChange={(e) => setData('is_primary', e.target.checked)}
                                    className="rounded-sm text-dunia-blue focus:ring-dunia-aqua"
                                />
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                    {pick('Jadikan alamat pengiriman utama', 'Set as primary shipping address')}
                                </span>
                            </label>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
                                >
                                    {pick('Batal', 'Cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 rounded-xl bg-[#005A9D] hover:bg-[#006783] text-white font-bold transition cursor-pointer shadow-md shadow-blue-500/20"
                                >
                                    {processing
                                        ? pick('Menyimpan...', 'Saving...')
                                        : pick('Simpan Alamat', 'Save Address')}
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
                            className={`p-5 rounded-2xl bg-white dark:bg-[#0e1424] border transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                addr.is_primary ? 'border-dunia-blue ring-1 ring-dunia-blue/30' : 'border-sky-100 dark:border-slate-800'
                            }`}
                        >
                            <div className="text-xs space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-slate-900 dark:text-white">{addr.recipient_name}</span>
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">({addr.phone})</span>
                                    {addr.is_primary && (
                                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-[#005A9D]/20 text-dunia-blue dark:text-sky-300 font-bold text-[10px]">
                                            {pick('Alamat Utama', 'Primary Address')}
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {addr.full_address}
                                </p>
                                <p className="text-slate-400 dark:text-slate-500">
                                    {addr.city}, {addr.province} {addr.postal_code}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-xs">
                                {!addr.is_primary && (
                                    <button
                                        type="button"
                                        onClick={() => handleSetPrimary(addr.id)}
                                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
                                    >
                                        {pick('Set Utama', 'Set Primary')}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => openEdit(addr)}
                                    className="p-2 text-slate-500 dark:text-slate-400 hover:text-dunia-blue dark:hover:text-[#60C2E6] rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800"
                                    title={pick('Edit', 'Edit')}
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(addr.id)}
                                    className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50"
                                    title={pick('Hapus', 'Delete')}
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
