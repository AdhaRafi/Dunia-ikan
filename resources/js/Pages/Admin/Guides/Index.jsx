import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BookOpen, Plus, Edit3, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function Index({ guides }) {
    const { pick, trGuideCategory } = useLanguage();
    const [editingGuide, setEditingGuide] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        title: '',
        fish_type: 'Semua Ikan Air Tawar',
        category: 'Penyakit Parasit',
        symptoms: '',
        possible_causes: '',
        care_instructions: '',
        prevention: '',
        source: 'Standar Perawatan Ikan Hias',
        is_active: true,
    });

    const openCreate = () => {
        setEditingGuide(null);
        reset();
        setShowForm(true);
    };

    const openEdit = (g) => {
        setEditingGuide(g);
        setData({
            title: g.title,
            fish_type: g.fish_type,
            category: g.category,
            symptoms: g.symptoms,
            possible_causes: g.possible_causes,
            care_instructions: g.care_instructions,
            prevention: g.prevention || '',
            source: g.source || '',
            is_active: g.is_active,
        });
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingGuide) {
            put(`/admin-portal/guides/${editingGuide.id}`, {
                onSuccess: () => setShowForm(false),
            });
        } else {
            post('/admin-portal/guides', {
                onSuccess: () => setShowForm(false),
            });
        }
    };

    const handleToggleActive = (id) => {
        router.post(`/admin-portal/guides/${id}/toggle`);
    };

    const handleDelete = (id, title) => {
        if (confirm(pick(`Hapus panduan "${title}"?`, `Delete guide "${title}"?`))) {
            router.delete(`/admin-portal/guides/${id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title={pick('Kelola Panduan Ikan Chatbot - Panel Admin', 'Manage Chatbot Fish Guides - Admin Panel')} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                            {pick('Basis Panduan Kesehatan Ikan (Chatbot AI)', 'Fish Health Guide Knowledge Base (Chatbot AI)')}
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            {pick('Artikel panduan ini diindeks oleh Asisten Virtual Dunia Ikan saat menjawab konsultasi kesehatan pembeli.', 'These guide articles are indexed by Dunia Ikan Virtual Assistant when answering buyer health consultations.')}
                        </p>
                    </div>

                    {!showForm && (
                        <button
                            type="button"
                            onClick={openCreate}
                            className="px-4 py-2.5 rounded-xl bg-dunia-blue text-white font-bold text-xs hover:bg-sky-600 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                            <Plus className="w-4 h-4" />
                            {pick('Tambah Panduan Baru', 'Add New Guide')}
                        </button>
                    )}
                </div>

                {/* Form Modal / Panel */}
                {showForm && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4 animate-in fade-in">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h2 className="font-bold text-sm text-slate-900">
                                {editingGuide ? `${pick('Edit Panduan', 'Edit Guide')}: ${editingGuide.title}` : pick('Buat Panduan Kesehatan Ikan Baru', 'Create New Fish Health Guide')}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block font-bold text-slate-700 uppercase mb-1">{pick('Judul Panduan / Penyakit', 'Guide / Disease Title')}</label>
                                    <input
                                        type="text"
                                        placeholder={pick('Contoh: Pencegahan & Pengobatan White Spot (Ich)', 'Example: White Spot (Ich) Prevention & Treatment')}
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200"
                                        required
                                    />
                                    {errors.title && <p className="text-rose-600 mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 uppercase mb-1">{pick('Target Jenis Ikan', 'Target Fish Species')}</label>
                                    <input
                                        type="text"
                                        placeholder={pick('e.g. Ikan Cupang / Semua Air Tawar', 'e.g. Betta Fish / All Freshwater')}
                                        value={data.fish_type}
                                        onChange={(e) => setData('fish_type', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase mb-1">{pick('Kategori Masalah', 'Issue Category')}</label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200"
                                    >
                                        <option value="Penyakit Parasit">{trGuideCategory('Penyakit Parasit')}</option>
                                        <option value="Infeksi Bakteri / Jamur">{trGuideCategory('Infeksi Bakteri / Jamur')}</option>
                                        <option value="Kualitas Air & Filter">{trGuideCategory('Kualitas Air & Filter')}</option>
                                        <option value="Gangguan Pencernaan & Organ">{trGuideCategory('Gangguan Pencernaan & Organ')}</option>
                                        <option value="Perawatan Dasar">{trGuideCategory('Perawatan Dasar')}</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 uppercase mb-1">{pick('Sumber Referensi / Asosiasi', 'Reference Source / Association')}</label>
                                    <input
                                        type="text"
                                        value={data.source}
                                        onChange={(e) => setData('source', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 uppercase mb-1">{pick('Gejala yang Terlihat (Symptoms)', 'Observed Symptoms')}</label>
                                <textarea
                                    rows={2}
                                    placeholder={pick('Jelaskan bintik putih, sirip robek, berenang miring, dsb...', 'Describe white spots, torn fins, tilted swimming, etc...')}
                                    value={data.symptoms}
                                    onChange={(e) => setData('symptoms', e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-slate-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 uppercase mb-1">{pick('Kemungkinan Penyebab Utama', 'Likely Root Causes')}</label>
                                <textarea
                                    rows={2}
                                    placeholder={pick('Penurunan suhu mendadak, amonia tinggi, pakan membusuk...', 'Sudden temperature drop, high ammonia, spoiled feed...')}
                                    value={data.possible_causes}
                                    onChange={(e) => setData('possible_causes', e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-slate-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 uppercase mb-1">{pick('Langkah Penanganan / Pertolongan Pertama', 'Treatment / First Aid Steps')}</label>
                                <textarea
                                    rows={3}
                                    placeholder={pick('Tindakan karantina, suhu heater, takaran garam non-yodium per liter...', 'Quarantine action, heater temperature, non-iodized salt dosage per liter...')}
                                    value={data.care_instructions}
                                    onChange={(e) => setData('care_instructions', e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-slate-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 uppercase mb-1">{pick('Pencegahan Jangka Panjang', 'Long-Term Prevention')}</label>
                                <textarea
                                    rows={2}
                                    placeholder={pick('Tips water change rutin, cycling akuarium...', 'Routine water change tips, aquarium cycling...')}
                                    value={data.prevention}
                                    onChange={(e) => setData('prevention', e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-slate-200"
                                />
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded-sm text-dunia-blue"
                                />
                                <span className="font-bold text-slate-700">{pick('Aktifkan untuk referensi Chatbot & Halaman Publik', 'Enable for Chatbot & Public Pages reference')}</span>
                            </label>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                                >
                                    {pick('Batal', 'Cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 rounded-xl bg-dunia-blue text-white font-bold hover:bg-sky-600 cursor-pointer"
                                >
                                    {processing ? pick('Menyimpan...', 'Saving...') : pick('Simpan Panduan', 'Save Guide')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Guides Table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                            <tr>
                                <th className="p-4">{pick('Judul Panduan', 'Guide Title')}</th>
                                <th className="p-4">{pick('Kategori', 'Category')}</th>
                                <th className="p-4">{pick('Jenis Ikan', 'Fish Species')}</th>
                                <th className="p-4">{pick('Status', 'Status')}</th>
                                <th className="p-4 text-right">{pick('Aksi', 'Actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {guides?.data?.map((g) => (
                                <tr key={g.id} className="hover:bg-slate-50/80 transition">
                                    <td className="p-4 font-bold text-slate-900 max-w-xs">{g.title}</td>
                                    <td className="p-4 font-semibold text-slate-600">{trGuideCategory(g.category)}</td>
                                    <td className="p-4 text-slate-500">{g.fish_type}</td>
                                    <td className="p-4">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleActive(g.id)}
                                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] cursor-pointer transition ${
                                                g.is_active
                                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                            }`}
                                        >
                                            {g.is_active ? pick('Aktif', 'Active') : pick('Non-aktif', 'Inactive')}
                                        </button>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(g)}
                                                className="p-1.5 text-slate-500 hover:text-dunia-blue rounded-lg hover:bg-sky-50"
                                                title={pick('Edit', 'Edit')}
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(g.id, g.title)}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                                                title={pick('Hapus', 'Delete')}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
