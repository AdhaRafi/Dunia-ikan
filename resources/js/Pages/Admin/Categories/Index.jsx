import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Folders, Plus, Edit3, Trash2, X } from 'lucide-react';

export default function Index({ categories }) {
    const [editingCategory, setEditingCategory] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
        description: '',
        icon: 'Fish',
    });

    const openCreate = () => {
        setEditingCategory(null);
        reset();
        setShowForm(true);
    };

    const openEdit = (cat) => {
        setEditingCategory(cat);
        setData({
            name: cat.name,
            description: cat.description || '',
            icon: cat.icon || 'Fish',
        });
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            put(`/admin/categories/${editingCategory.id}`, {
                onSuccess: () => setShowForm(false),
            });
        } else {
            post('/admin/categories', {
                onSuccess: () => setShowForm(false),
            });
        }
    };

    const handleDelete = (id, name) => {
        if (confirm(`Hapus kategori "${name}"?`)) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Kategori - Panel Admin" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                            Kelola Kategori Produk
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Atur taksonomi kategori utama untuk mengelompokkan ikan, perlengkapan, dan aquascape.
                        </p>
                    </div>

                    {!showForm && (
                        <button
                            type="button"
                            onClick={openCreate}
                            className="px-4 py-2.5 rounded-xl bg-dunia-blue text-white font-bold text-xs hover:bg-sky-600 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Kategori Baru
                        </button>
                    )}
                </div>

                {/* Form Modal / Inline */}
                {showForm && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4 animate-in fade-in">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h2 className="font-bold text-sm text-slate-900">
                                {editingCategory ? `Edit Kategori: ${editingCategory.name}` : 'Tambah Kategori Baru'}
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
                            <div>
                                <label className="block font-bold text-slate-700 uppercase mb-1">Nama Kategori</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Ikan Hias Air Laut"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-slate-200"
                                    required
                                />
                                {errors.name && <p className="text-rose-600 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 uppercase mb-1">Deskripsi Singkat</label>
                                <textarea
                                    rows={2}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-slate-200"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 rounded-xl bg-dunia-blue text-white font-bold hover:bg-sky-600 cursor-pointer"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Kategori'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Categories Table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Nama Kategori</th>
                                <th className="p-4">Slug URL</th>
                                <th className="p-4">Deskripsi</th>
                                <th className="p-4">Jumlah Produk</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {categories?.map((cat) => (
                                <tr key={cat.id} className="hover:bg-slate-50/80 transition">
                                    <td className="p-4 font-bold text-slate-900">{cat.name}</td>
                                    <td className="p-4 text-slate-500 font-mono text-[11px]">{cat.slug}</td>
                                    <td className="p-4 text-slate-600 max-w-xs truncate">{cat.description || '-'}</td>
                                    <td className="p-4 font-bold text-dunia-blue">{cat.products_count ?? 0} produk</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(cat)}
                                                className="p-1.5 text-slate-500 hover:text-dunia-blue rounded-lg hover:bg-sky-50"
                                                title="Edit"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(cat.id, cat.name)}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                                                title="Hapus"
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
