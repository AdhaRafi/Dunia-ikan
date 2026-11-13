import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ProductCard from '@/Components/ProductCard';
import { Store as StoreIcon, MapPin, Phone, ShieldCheck, ArrowLeft, PackageCheck } from 'lucide-react';

export default function Show({ store, products }) {
    return (
        <AppLayout>
            <Head title={`${store.name} - Toko Penangkar Ikan`} />

            {/* Store Header Banner */}
            <div className="bg-gradient-to-r from-dunia-navy via-dunia-marine to-dunia-blue text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/products" className="inline-flex items-center gap-1 text-xs font-semibold text-sky-200 hover:text-white mb-6 transition">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Kembali ke Katalog
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
                            {store.logo ? (
                                <img src={`/storage/${store.logo}`} alt={store.name} className="w-full h-full object-cover rounded-3xl" />
                            ) : (
                                <StoreIcon className="w-10 h-10 text-dunia-aqua" />
                            )}
                        </div>

                        <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                    {store.name}
                                </h1>
                                <span className="px-2.5 py-0.5 rounded-full bg-dunia-aqua/20 text-dunia-aqua text-xs font-bold border border-dunia-aqua/30">
                                    Penangkar Terverifikasi
                                </span>
                            </div>

                            <p className="text-xs sm:text-sm text-sky-100 flex items-center gap-2 flex-wrap">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-dunia-aqua" /> {store.city}, {store.province}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Phone className="w-3.5 h-3.5 text-dunia-aqua" /> {store.phone}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Store Policies & Description */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-sky-100 shadow-xs space-y-3">
                        <h2 className="font-bold text-sm text-dunia-navy uppercase tracking-wider">
                            Tentang Toko Penangkar
                        </h2>
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                            {store.description || 'Belum ada deskripsi yang ditambahkan untuk toko ini.'}
                        </p>
                    </div>

                    <div className="bg-sky-50/70 p-6 rounded-2xl border border-sky-100 shadow-xs space-y-2">
                        <h3 className="font-bold text-sm text-dunia-navy uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-dunia-aqua" />
                            Garansi Hidup (DOA) Toko
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            {store.doa_policy || 'Garansi hidup standar berlaku dengan melampirkan rekaman video unboxing tanpa cut.'}
                        </p>
                    </div>
                </div>

                {/* Products List from Store */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                        <h2 className="text-xl font-extrabold text-dunia-navy flex items-center gap-2">
                            <PackageCheck className="w-5 h-5 text-dunia-blue" />
                            Katalog Produk Toko Ini ({products?.total || 0})
                        </h2>
                    </div>

                    {products?.data?.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                            {products.data.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 text-slate-500 text-sm">
                            Toko ini belum memiliki produk aktif untuk dijual saat ini.
                        </div>
                    )}

                    {/* Pagination */}
                    {products?.links?.length > 3 && (
                        <div className="pt-6 flex justify-center gap-1.5">
                            {products.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    preserveScroll
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                                        link.active
                                            ? 'bg-dunia-blue text-white'
                                            : link.url
                                            ? 'bg-white border border-slate-200 text-slate-700 hover:bg-sky-50'
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
