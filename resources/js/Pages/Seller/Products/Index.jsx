import { Head, Link, router } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { PlusCircle, Edit3, Trash2, Eye, ShieldCheck, Fish, AlertCircle } from 'lucide-react';

export default function Index({ store, products }) {
    const handleDelete = (id, name) => {
        if (confirm(`Yakin ingin menghapus produk "${name}"?`)) {
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
            <Head title="Manajemen Produk & Morf Ikan - Portal Penjual" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-dunia-navy">
                            Katalog Produk & Morf Toko
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Kelola stok, harga, dan karakteristik morfologi spesifik ikan hias Anda.
                        </p>
                    </div>

                    <Link
                        href="/seller/products/create"
                        className="px-4 py-2.5 rounded-xl bg-dunia-blue text-white font-bold text-xs hover:bg-sky-600 transition flex items-center gap-2 shrink-0 shadow-xs cursor-pointer"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Tambah Produk / Ikan
                    </Link>
                </div>

                {products?.data?.length > 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">Produk / Ikan</th>
                                        <th className="p-4">Kategori</th>
                                        <th className="p-4">Morf / Trait</th>
                                        <th className="p-4">Harga</th>
                                        <th className="p-4">Stok</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {products.data.map((product) => (
                                        <tr key={product.id} className="hover:bg-slate-50/80 transition">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={product.image || 'https://images.unsplash.com/photo-1544943910-4c1dc44a0b27?auto=format&fit=crop&w=100&q=80'}
                                                        alt={product.name}
                                                        className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-slate-900 truncate max-w-[200px] text-xs">
                                                            {product.name}
                                                        </p>
                                                        {product.fishDetail?.species_name && (
                                                            <p className="text-[10px] italic text-slate-400 truncate">
                                                                {product.fishDetail.species_name}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4 font-semibold text-slate-600">
                                                {product.category?.name}
                                            </td>

                                            <td className="p-4">
                                                {product.fishDetail?.morph_trait ? (
                                                    <span className="px-2 py-0.5 rounded-md bg-sky-50 text-dunia-marine font-bold text-[10px]">
                                                        {product.fishDetail.morph_trait}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>

                                            <td className="p-4 font-extrabold text-dunia-blue">
                                                {formatPrice(product.price)}
                                            </td>

                                            <td className="p-4">
                                                <span className={`font-bold ${product.stock > 0 ? 'text-slate-800' : 'text-rose-600'}`}>
                                                    {product.stock} ekor
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    product.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {product.is_active ? 'Aktif' : 'Non-aktif'}
                                                </span>
                                            </td>

                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/products/${product.slug}`}
                                                        className="p-1.5 text-slate-400 hover:text-dunia-blue rounded-lg hover:bg-sky-50"
                                                        title="Lihat di Toko"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/seller/products/${product.id}/edit`}
                                                        className="p-1.5 text-slate-500 hover:text-dunia-blue rounded-lg hover:bg-sky-50"
                                                        title="Edit"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(product.id, product.name)}
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
                ) : (
                    <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs space-y-3">
                        <Fish className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="font-bold text-slate-700">Toko Anda belum memiliki produk terdaftar</p>
                        <p className="text-slate-400">Tambahkan ikan atau produk pertama Anda untuk mulai berjualan.</p>
                        <Link
                            href="/seller/products/create"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-dunia-blue text-white font-bold"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Tambah Produk Sekarang
                        </Link>
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}
