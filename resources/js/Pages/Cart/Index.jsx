import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
    ShoppingCart, 
    Trash2, 
    Store, 
    ArrowRight, 
    ShieldCheck, 
    AlertCircle, 
    ArrowLeft 
} from 'lucide-react';

export default function Index({ groupedCart, totalItems, grandTotal }) {
    const handleUpdateQuantity = (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;

        router.patch(`/cart/${cartItemId}`, {
            quantity: newQuantity,
        }, {
            preserveScroll: true,
        });
    };

    const handleDelete = (cartItemId) => {
        if (confirm('Hapus produk ini dari keranjang?')) {
            router.delete(`/cart/${cartItemId}`, {
                preserveScroll: true,
            });
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
        <AppLayout>
            <Head title="Keranjang Belanja - Dunia Ikan" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-dunia-blue/10 text-dunia-blue flex items-center justify-center font-bold">
                        <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-dunia-navy tracking-tight">
                            Keranjang Belanja
                        </h1>
                        <p className="text-xs text-slate-500">
                            Pesanan dikelompokkan per toko penangkar untuk keamanan pengiriman hidup.
                        </p>
                    </div>
                </div>

                {groupedCart?.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Cart Items Grouped by Store */}
                        <div className="lg:col-span-8 space-y-6">
                            {groupedCart.map((group, groupIndex) => (
                                <div
                                    key={groupIndex}
                                    className="bg-white rounded-2xl border border-sky-100 shadow-xs overflow-hidden"
                                >
                                    {/* Store Header */}
                                    <div className="bg-sky-50/60 px-5 py-3 border-b border-sky-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Store className="w-4 h-4 text-dunia-marine" />
                                            <span className="font-bold text-sm text-dunia-navy">
                                                {group.store.name}
                                            </span>
                                            <span className="text-xs text-slate-400">({group.store.city})</span>
                                        </div>

                                        {group.store.doa_policy && (
                                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                                                <ShieldCheck className="w-3.5 h-3.5" /> Garansi DOA Aktif
                                            </span>
                                        )}
                                    </div>

                                    {/* Store Items List */}
                                    <div className="divide-y divide-slate-100 p-5 space-y-4">
                                        {group.items.map((item) => (
                                            <div key={item.id} className="pt-4 first:pt-0 flex items-center gap-4">
                                                <img
                                                    src={item.product?.image || 'https://images.unsplash.com/photo-1544943910-4c1dc44a0b27?auto=format&fit=crop&w=200&q=80'}
                                                    alt={item.product?.name}
                                                    className="w-20 h-20 rounded-xl object-cover border border-slate-100 shrink-0"
                                                />

                                                <div className="flex-1 min-w-0">
                                                    <Link
                                                        href={`/products/${item.product?.slug}`}
                                                        className="font-bold text-sm text-slate-900 hover:text-dunia-blue transition truncate block"
                                                    >
                                                        {item.product?.name}
                                                    </Link>

                                                    <p className="text-xs font-extrabold text-dunia-blue mt-0.5">
                                                        {formatPrice(item.product?.price)}
                                                    </p>

                                                    {item.product?.fish_detail?.morph_trait && (
                                                        <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                                                            Morph: {item.product.fish_detail.morph_trait}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Quantity Selector */}
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                            className="w-7 h-7 rounded hover:bg-white flex items-center justify-center font-bold text-xs disabled:opacity-30"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-8 text-center text-xs font-bold text-slate-800">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                            disabled={item.quantity >= item.product?.stock}
                                                            className="w-7 h-7 rounded hover:bg-white flex items-center justify-center font-bold text-xs disabled:opacity-30"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Store Subtotal */}
                                        <div className="pt-3 flex justify-between items-center text-xs font-semibold text-slate-600">
                                            <span>Subtotal Toko:</span>
                                            <span className="font-bold text-slate-900 text-sm">
                                                {formatPrice(group.storeTotal)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary & Checkout CTA */}
                        <div className="lg:col-span-4">
                            <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs space-y-5 sticky top-24">
                                <h3 className="font-extrabold text-base text-dunia-navy pb-3 border-b border-slate-100">
                                    Ringkasan Keranjang
                                </h3>

                                <div className="space-y-2.5 text-xs text-slate-600">
                                    <div className="flex justify-between">
                                        <span>Total Jumlah Ikan/Produk</span>
                                        <span className="font-bold text-slate-900">{totalItems} item</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Jumlah Toko Terlibat</span>
                                        <span className="font-bold text-slate-900">{groupedCart.length} Toko</span>
                                    </div>
                                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm font-bold text-dunia-navy">
                                        <span>Total Produk</span>
                                        <span className="text-lg font-extrabold text-dunia-blue">
                                            {formatPrice(grandTotal)}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                    * Ongkos kirim khusus live fish (kemasan oksigen + box styrofoam) dihitung per toko pada halaman checkout berikutnya.
                                </p>

                                <Link
                                    href="/checkout"
                                    className="w-full py-3.5 px-6 rounded-2xl bg-dunia-blue hover:bg-sky-600 text-white font-bold text-sm shadow-lg shadow-dunia-blue/20 transition flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    Lanjut ke Checkout
                                    <ArrowRight className="w-4 h-4" />
                                </Link>

                                <Link
                                    href="/products"
                                    className="w-full py-2.5 text-center text-xs font-semibold text-slate-500 hover:text-dunia-blue transition block"
                                >
                                    ← Lanjut Belanja Ikan Lainnya
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty Cart State */
                    <div className="p-16 text-center bg-white rounded-3xl border border-sky-100 shadow-xs max-w-lg mx-auto space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-sky-50 text-dunia-blue mx-auto flex items-center justify-center">
                            <ShoppingCart className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-dunia-navy">Keranjang Anda Masih Kosong</h2>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Belum ada ikan hias atau perlengkapan yang Anda pilih. Jelajahi katalog kami untuk menemukan ikan idaman!
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-dunia-blue text-white text-xs font-bold hover:bg-sky-600 transition shadow-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Jelajahi Katalog Sekarang
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
