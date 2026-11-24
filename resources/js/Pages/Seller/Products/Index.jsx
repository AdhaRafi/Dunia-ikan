import { Head, Link, router } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { PlusCircle, Edit3, Trash2, Eye, ShieldCheck, Fish, AlertCircle } from '@/Components/Icons';
import { useLanguage } from '@/lib/i18n';

export default function Index({ store, products }) {
    const { pick, trCategory } = useLanguage();
    const handleDelete = (id, name) => {
        if (confirm(pick(`Yakin ingin menghapus produk "${name}"?`, `Are you sure you want to delete "${name}"?`))) {
            router.delete(`/seller/products/${id}`);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <SellerLayout>
            <Head title={pick('Manajemen Produk & Morf Ikan - Portal Penjual', 'Product & Morph Management — Seller Portal')} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-dunia-navy dark:text-white">
                            {pick('Katalog Produk & Morf Toko', 'Store Catalog & Morphs')}
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {pick(
                                'Kelola stok, harga, dan karakteristik morfologi spesifik ikan hias Anda.',
                                'Manage stock, pricing, and specific ornamental fish traits.'
                            )}
                        </p>
                    </div>

                    <Link
                        href="/seller/products/create"
                        className="px-4 py-2.5 rounded-xl bg-dunia-blue text-white font-bold text-xs hover:bg-sky-600 transition inline-flex items-center justify-center gap-2 self-start sm:self-auto shrink-0 shadow-xs cursor-pointer"
                    >
                        <PlusCircle className="w-4 h-4" />
                        {pick('Tambah Produk / Ikan', 'Add Product / Fish')}
                    </Link>
                </div>

                {products?.data?.length > 0 ? (
                    <div className="bg-white dark:bg-[#0e1424] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                        {/* Mobile Card List */}
                        <div className="md:hidden divide-y divide-slate-100">
                            {products.data.map((product) => (
                                <div key={product.id} className="p-4 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <img
                                            src={product.image || '/images/hero/aquarium-poster.webp'}
                                            alt={product.name}
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = '/images/hero/aquarium-poster.webp';
                                            }}
                                            className="w-14 h-14 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0"
                                        />
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2">
                                                    {product.name}
                                                </p>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                                                    product.is_active ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                                }`}>
                                                    {product.is_active ? pick('Aktif', 'Active') : pick('Non-aktif', 'Inactive')}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                                                {product.category?.name && <span>{trCategory(product.category.name)}</span>}
                                                {product.fish_detail?.morph_trait && (
                                                    <span className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-500/15 text-dunia-marine dark:text-sky-300 font-bold text-[10px]">
                                                        {product.fish_detail.morph_trait}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                                        <div>
                                            <p className="font-extrabold text-sm text-dunia-blue tabular-nums">
                                                {formatPrice(product.price)}
                                            </p>
                                            <p className={`text-[11px] font-semibold ${product.stock > 0 ? 'text-slate-600 dark:text-slate-300' : 'text-rose-600 dark:text-rose-400'}`}>
                                                {pick('Stok:', 'Stock:')} {product.stock} {pick('ekor', 'pcs')}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <Link
                                                href={`/products/${product.slug}`}
                                                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-dunia-blue rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-500/15"
                                                title={pick('Lihat di Toko', 'View in Store')}
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>{pick('Lihat', 'View')}</span>
                                            </Link>
                                            <Link
                                                href={`/seller/products/${product.id}/edit`}
                                                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-dunia-blue dark:text-sky-300 rounded-xl bg-sky-50 dark:bg-sky-500/15 hover:bg-sky-100 dark:hover:bg-sky-500/25"
                                                title="Edit"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                                <span>Edit</span>
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(product.id, product.name)}
                                                className="p-2 text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 rounded-xl bg-rose-50 dark:bg-rose-500/15 hover:bg-rose-100 dark:hover:bg-rose-500/25"
                                                title={pick('Hapus', 'Delete')}
                                                aria-label={`${pick('Hapus', 'Delete')} ${product.name}`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-[#131d33] border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">{pick('Produk / Ikan', 'Product / Fish')}</th>
                                        <th className="p-4">{pick('Kategori', 'Category')}</th>
                                        <th className="p-4">{pick('Morf / Trait', 'Morph / Trait')}</th>
                                        <th className="p-4">{pick('Harga', 'Price')}</th>
                                        <th className="p-4">{pick('Stok', 'Stock')}</th>
                                        <th className="p-4">{pick('Status', 'Status')}</th>
                                        <th className="p-4 text-right">{pick('Aksi', 'Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {products.data.map((product) => (
                                        <tr key={product.id} className="hover:bg-slate-50/80 dark:hover:bg-[#131d33]/60 transition">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={product.image || '/images/hero/aquarium-poster.webp'}
                                                        alt={product.name}
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = '/images/hero/aquarium-poster.webp';
                                                        }}
                                                        className="w-12 h-12 rounded-lg object-cover border border-slate-100 dark:border-slate-800 shrink-0"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-slate-900 dark:text-white truncate max-w-[200px] text-xs">
                                                            {product.name}
                                                        </p>
                                                        {product.fish_detail?.species_name && (
                                                            <p className="text-[10px] italic text-slate-400 dark:text-slate-500 truncate">
                                                                {product.fish_detail.species_name}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4 font-semibold text-slate-600 dark:text-slate-300">
                                                {product.category?.name ? trCategory(product.category.name) : '-'}
                                            </td>

                                            <td className="p-4">
                                                {product.fish_detail?.morph_trait ? (
                                                    <span className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-500/15 text-dunia-marine dark:text-sky-300 font-bold text-[10px]">
                                                        {product.fish_detail.morph_trait}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 dark:text-slate-500">-</span>
                                                )}
                                            </td>

                                            <td className="p-4 font-extrabold text-dunia-blue dark:text-sky-400">
                                                {formatPrice(product.price)}
                                            </td>

                                            <td className="p-4">
                                                <span className={`font-bold ${product.stock > 0 ? 'text-slate-800 dark:text-slate-200' : 'text-rose-600 dark:text-rose-400'}`}>
                                                    {product.stock} {pick('ekor', 'pcs')}
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    product.is_active ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                                }`}>
                                                    {product.is_active ? pick('Aktif', 'Active') : pick('Non-aktif', 'Inactive')}
                                                </span>
                                            </td>

                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/products/${product.slug}`}
                                                        className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-dunia-blue rounded-lg hover:bg-sky-50 dark:hover:bg-sky-500/15"
                                                        title={pick('Lihat di Toko', 'View in Store')}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/seller/products/${product.id}/edit`}
                                                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-dunia-blue rounded-lg hover:bg-sky-50 dark:hover:bg-sky-500/15"
                                                        title="Edit"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                        className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/15"
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
                ) : (
                    <div className="p-12 text-center bg-white dark:bg-[#0e1424] rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs space-y-3">
                        <Fish className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                        <p className="font-bold text-slate-700 dark:text-slate-200">
                            {pick('Toko Anda belum memiliki produk terdaftar', 'Your store has no listed products yet')}
                        </p>
                        <p className="text-slate-400 dark:text-slate-500">
                            {pick(
                                'Tambahkan ikan atau produk pertama Anda untuk mulai berjualan.',
                                'Add your first fish or product to start selling.'
                            )}
                        </p>
                        <Link
                            href="/seller/products/create"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-dunia-blue text-white font-bold"
                        >
                            <PlusCircle className="w-4 h-4" />
                            {pick('Tambah Produk Sekarang', 'Add Product Now')}
                        </Link>
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}
