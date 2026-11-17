import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);

export default function Index({ groupedCart = [], totalItems = 0, grandTotal = 0 }) {
    const { pick, trCategory } = useLanguage();
    const cartItems = groupedCart.flatMap((group) =>
        (group.items || []).map((item) => ({
            ...item,
            storeName: group.store?.name,
        }))
    );

    const handleUpdateQuantity = (cartItemId, newQuantity) => {
        if (newQuantity < 1) {
            return;
        }

        router.patch(
            `/cart/${cartItemId}`,
            { quantity: newQuantity },
            { preserveScroll: true }
        );
    };

    const handleDelete = (cartItemId) => {
        if (confirm(pick('Hapus produk ini dari keranjang?', 'Remove this item from cart?'))) {
            router.delete(`/cart/${cartItemId}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout>
            <Head title={pick('Keranjang — Dunia Ikan', 'Cart — Dunia Ikan')} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {cartItems.length > 0 ? (
                    <div className="bg-white dark:bg-[#0e1424] rounded-3xl border border-slate-200/80 dark:border-neutral-800 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-12">
                            {/* Left Column: Cart List */}
                            <div className="lg:col-span-8 p-4 sm:p-8 lg:border-r border-slate-200/80 dark:border-neutral-800">
                                <div className="flex items-center justify-between pb-6 border-b border-dashed border-slate-200 dark:border-neutral-800">
                                    <h1 className="text-mask text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                                        <span className="text-mask-inner">
                                            {pick('Keranjang', 'Cart')}
                                            <sup className="ml-1.5 text-xs font-bold text-slate-400 tabular-nums">
                                                {String(cartItems.length).padStart(2, '0')}
                                            </sup>
                                        </span>
                                    </h1>
                                    <span className="text-xs font-medium text-slate-400 dark:text-neutral-500">
                                        {groupedCart.length} {pick('toko', groupedCart.length === 1 ? 'store' : 'stores')}
                                    </span>
                                </div>

                                <div className="divide-y divide-dashed divide-slate-200 dark:divide-neutral-800">
                                    {cartItems.map((item, idx) => {
                                        const categoryLabel = item.product?.category?.name
                                            ? trCategory(item.product.category.name)
                                            : pick('Spesimen', 'Specimen');
                                        const metaParts = [
                                            item.storeName,
                                            item.product?.fish_detail?.morph_trait,
                                        ].filter(Boolean);

                                        return (
                                            <div
                                                key={item.id}
                                                style={{ '--overlap-i': idx }}
                                                className="overlap-enter py-4 sm:py-6 flex items-stretch gap-3.5 sm:gap-5"
                                            >
                                                <Link
                                                    href={`/products/${item.product?.slug}`}
                                                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-neutral-800 overflow-hidden shrink-0"
                                                >
                                                    <img
                                                        src={
                                                            item.product?.image ||
                                                            '/images/hero/aquarium-poster.webp'
                                                        }
                                                        alt={item.product?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </Link>

                                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 sm:gap-4">
                                                        <div className="min-w-0 space-y-1">
                                                            <span className="inline-block rounded-full border border-slate-200 dark:border-neutral-700 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                                {categoryLabel}
                                                            </span>
                                                            <Link
                                                                href={`/products/${item.product?.slug}`}
                                                                className="block font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:underline line-clamp-2 sm:truncate"
                                                            >
                                                                {item.product?.name}
                                                            </Link>
                                                            {metaParts.length > 0 && (
                                                                <p className="text-xs text-slate-500 dark:text-neutral-400 truncate">
                                                                    {metaParts.join(' · ')}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tabular-nums shrink-0">
                                                            {formatPrice(
                                                                (item.product?.price || 0) *
                                                                    item.quantity
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-end gap-3 pt-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(item.id)}
                                                            className="p-1.5 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                                                            aria-label={`${pick('Hapus', 'Remove')} ${item.product?.name}`}
                                                            title={pick('Hapus', 'Remove')}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>

                                                        <div className="inline-flex items-center rounded-full border border-slate-200 dark:border-neutral-700 bg-white dark:bg-slate-900 px-1 py-0.5">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleUpdateQuantity(
                                                                        item.id,
                                                                        item.quantity - 1
                                                                    )
                                                                }
                                                                disabled={item.quantity <= 1}
                                                                aria-label={pick('Kurangi jumlah', 'Decrease quantity')}
                                                                className="btn-motion w-7 h-7 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                                                            >
                                                                <Minus className="w-3.5 h-3.5" />
                                                            </button>
                                                            <span
                                                                key={item.quantity}
                                                                className="micro-pop w-8 text-center text-xs font-bold text-slate-900 dark:text-white tabular-nums"
                                                            >
                                                                {String(item.quantity).padStart(
                                                                    2,
                                                                    '0'
                                                                )}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleUpdateQuantity(
                                                                        item.id,
                                                                        item.quantity + 1
                                                                    )
                                                                }
                                                                disabled={
                                                                    item.quantity >=
                                                                    (item.product?.stock ?? 0)
                                                                }
                                                                aria-label={pick('Tambah jumlah', 'Increase quantity')}
                                                                className="btn-motion w-7 h-7 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                                                            >
                                                                <Plus className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Right Column: Summary */}
                            <div className="lg:col-span-4 p-4 sm:p-8 flex flex-col justify-between bg-white dark:bg-[#0e1424]">
                                <div className="lg:sticky lg:top-28 space-y-5">
                                    <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                                        {pick('Ringkasan', 'Summary')}
                                    </h2>

                                    <div className="rounded-2xl bg-[#f7f7f8] dark:bg-slate-900/70 border border-slate-200/70 dark:border-neutral-800 p-5 space-y-3 text-xs sm:text-sm">
                                        <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400">
                                            <span>{pick('Total item', 'Total items')}</span>
                                            <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                                                {String(totalItems).padStart(2, '0')} {pick('item', totalItems === 1 ? 'item' : 'items')}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400">
                                            <span>Subtotal</span>
                                            <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                                                {formatPrice(grandTotal)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400">
                                            <span>{pick('Ongkos kirim', 'Shipping')}</span>
                                            <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                                                {pick('Saat checkout', 'At checkout')}
                                            </span>
                                        </div>

                                        <div className="pt-3 border-t border-slate-200/80 dark:border-neutral-800 flex items-center justify-between">
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {pick('Total bayar', 'Total')}
                                            </span>
                                            <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tabular-nums">
                                                {formatPrice(grandTotal)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5 pt-1">
                                        <Link
                                            href="/checkout"
                                            className="btn-motion btn-sheen w-full h-12 rounded-full bg-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center shadow-sm"
                                        >
                                            Checkout
                                        </Link>

                                        <Link
                                            href="/products"
                                            className="btn-motion w-full h-11 rounded-full bg-white dark:bg-transparent border border-slate-200 dark:border-neutral-700 hover:border-slate-400 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center"
                                        >
                                            {pick('Lanjut Belanja', 'Continue Shopping')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty Cart State */
                    <div className="swap-in max-w-md mx-auto py-16 px-6 text-center bg-white dark:bg-[#0e1424] rounded-3xl border border-slate-200/80 dark:border-neutral-800 space-y-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mx-auto flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <h1 className="text-mask text-lg font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                            <span className="text-mask-inner">
                                {pick('Keranjang Kosong', 'Your Cart is Empty')}
                            </span>
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                            {pick(
                                'Belum ada produk yang ditambahkan ke keranjang Anda.',
                                'No items have been added to your cart yet.'
                            )}
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/products"
                                className="btn-motion btn-sheen inline-flex h-11 px-7 rounded-full bg-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 text-white text-xs font-bold uppercase tracking-wider items-center justify-center shadow-sm"
                            >
                                {pick('Jelajahi Katalog', 'Browse Catalog')}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
