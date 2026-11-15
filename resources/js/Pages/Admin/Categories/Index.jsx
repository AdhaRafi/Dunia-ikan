import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Folders, Plus, Edit3, Trash2, X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function Index({ categories }) {
    const { pick, trCategory } = useLanguage();
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
        if (confirm(pick(`Hapus kategori "${name}"?`, `Delete category "${name}"?`))) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title={pick('Kelola Kategori - Panel Admin', 'Manage Categories - Admin Panel')} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                            {pick('Kelola Kategori Produk', 'Manage Product Categories')}
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            {pick('Atur taksonomi kategori utama untuk mengelompokkan ikan, perlengkapan, dan aquascape.', 'Manage main category taxonomy to group fish, equipment, and aquascape items.')}
                        </p>
                    </div>

                    {!showForm && (
                        <button
                            type="button"
                            onClick={openCreate}
                            className="px-4 py-2.5 rounded-xl bg-dunia-blue text-white font-bold text-xs hover:bg-sky-600 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                            <Plus className="w-4 h-4" />
                            {pick('Tambah Kategori Baru', 'Add New Category')}
                        </button>
                    )}
                </div>

                {/* Form Modal / Inline */}
                {showForm && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4 animate-in fade-in">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h2 className="font-bold text-sm text-slate-900">
                                {editingCategory ? `${pick('Edit Kategori', 'Edit Category')}: ${editingCategory.name}` : pick('Tambah Kategori Baru', 'Add New Category')}
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
                                <label className="block font-bold text-slate-700 uppercase mb-1">{pick('Nama Kategori', 'Category Name')}</label>
                                <input
                                    type="text"
                                    placeholder={pick('Contoh: Ikan Hias Air Laut', 'Example: Marine Ornamental Fish')}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-slate-200"
                                    required
                                />
                                {errors.name && <p className="text-rose-600 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 uppercase mb-1">{pick('Deskripsi Singkat', 'Short Description')}</label>
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
                                    {pick('Batal', 'Cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 rounded-xl bg-dunia-blue text-white font-bold hover:bg-sky-600 cursor-pointer"
                                >
                                    {processing ? pick('Menyimpan...', 'Saving...') : pick('Simpan Kategori', 'Save Category')}
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
                                <th className="p-4">{pick('Nama Kategori', 'Category Name')}</th>
                                <th className="p-4">{pick('Slug URL', 'URL Slug')}</th>
                                <th className="p-4">{pick('Deskripsi', 'Description')}</th>
                                <th className="p-4">{pick('Jumlah Produk', 'Product Count')}</th>
                                <th className="p-4 text-right">{pick('Aksi', 'Actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {categories?.map((cat) => (
                                <tr key={cat.id} className="hover:bg-slate-50/80 transition">
                                    <td className="p-4 font-bold text-slate-900">{trCategory(cat.name)}</td>
                                    <td className="p-4 text-slate-500 font-mono text-[11px]">{cat.slug}</td>
                                    <td className="p-4 text-slate-600 max-w-xs truncate">{cat.description || '-'}</td>
                                    <td className="p-4 font-bold text-dunia-blue">{cat.products_count ?? 0} {pick('produk', 'products')}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(cat)}
                                                className="p-1.5 text-slate-500 hover:text-dunia-blue rounded-lg hover:bg-sky-50"
                                                title={pick('Edit', 'Edit')}
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(cat.id, trCategory(cat.name))}
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
