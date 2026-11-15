import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);
}

const fallbackFish =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450' fill='none'%3E%3Crect width='600' height='450' fill='%23f4f4f5'/%3E%3Cpath d='M300 155 C380 155 435 205 435 235 C435 265 380 315 300 315 C245 315 190 265 145 280 L145 190 C190 205 245 155 300 155 Z' fill='%23001454' opacity='0.22'/%3E%3C/svg%3E";

export default function ProductCard({ product }) {
    const { pick, trCategory } = useLanguage();
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const [buying, setBuying] = useState(false);

    const addToCart = (e, redirectToCheckout = false) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.stock <= 0 || adding || buying) {
            return;
        }

        if (redirectToCheckout) {
            setBuying(true);
        } else {
            setAdding(true);
        }

        router.post(
            '/cart',
            { product_id: product.id, quantity: 1 },
            {
                preserveScroll: !redirectToCheckout,
                onSuccess: () => {
                    if (redirectToCheckout) {
                        setBuying(false);
                        router.visit('/checkout');
                        return;
                    }
                    setAdding(false);
                    setAdded(true);
                    setTimeout(() => setAdded(false), 1800);
                },
                onError: () => {
                    setAdding(false);
                    setBuying(false);
                },
            },
        );
    };

    const subLabel = product.store?.city || product.store?.name || '';

    return (
        <article className="group flex flex-col justify-between bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-neutral-800 p-3 gap-3 hover:border-[#4AB8BD] hover:shadow-md transition-all duration-200 select-none">
            <div className="space-y-3">
                <div className="relative aspect-[4/3] rounded-xl bg-slate-100 dark:bg-[#162240] overflow-hidden">
                    <Link href={`/products/${product.slug}`} className="block w-full h-full">
                        <img
                            src={product.image || fallbackFish}
                            alt={product.name}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = fallbackFish;
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </Link>

                    {product.category?.name && (
                        <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-white/95 dark:bg-neutral-900/90 text-[10px] font-semibold text-slate-600 dark:text-neutral-300 shadow-xs">
                            {trCategory(product.category.name)}
                        </span>
                    )}

                    {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                            <span className="px-3 py-1 bg-white dark:bg-[#111a30] text-[#ba1a1a] dark:text-[#ffb4ab] font-bold text-xs rounded-full">
                                {pick('Habis', 'Sold Out')}
                            </span>
                        </div>
                    )}
                </div>

                <div className="px-0.5 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-0.5 sm:gap-2">
                        <Link
                            href={`/products/${product.slug}`}
                            className="text-xs sm:text-sm font-bold text-[#001454] dark:text-white hover:text-[#0684E5] dark:hover:text-[#4AB8BD] transition leading-snug line-clamp-1"
                            title={product.name}
                        >
                            {product.name}
                        </Link>
                        <p className="text-xs sm:text-sm font-extrabold text-[#001454] dark:text-cyan-400 tabular-nums shrink-0">
                            {formatPrice(product.price)}
                        </p>
                    </div>

                    {subLabel && (
                        <p className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">
                            {subLabel}
                        </p>
                    )}
                </div>
            </div>

            {product.stock > 0 && (
                <div className="flex items-center gap-1.5 sm:gap-2 pt-0.5">
                    <button
                        type="button"
                        onClick={(e) => addToCart(e, false)}
                        disabled={adding || buying}
                        className={`flex-1 py-2 sm:py-1.5 px-2 sm:px-3 rounded-full text-[11px] font-semibold border transition flex items-center justify-center gap-1 whitespace-nowrap ${
                            added
                                ? 'border-[#00696D] bg-[#00696D]/10 text-[#00696D] dark:text-[#4AB8BD]'
                                : 'border-slate-300 dark:border-neutral-700 text-[#001454] dark:text-neutral-200 hover:border-[#001454] dark:hover:border-[#4AB8BD]'
                        }`}
                    >
                        {added ? (
                            <>
                                <Check className="w-3.5 h-3.5" />
                                <span>{pick('Ditambah', 'Added')}</span>
                            </>
                        ) : (
                            <span>{pick('+ Keranjang', '+ Cart')}</span>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={(e) => addToCart(e, true)}
                        disabled={adding || buying}
                        className="flex-1 py-2 sm:py-1.5 px-2 sm:px-3 rounded-full text-[11px] font-bold bg-[#001454] dark:bg-[#4AB8BD] text-white dark:text-[#001454] hover:opacity-90 transition whitespace-nowrap"
                    >
                        {buying ? pick('Memproses...', 'Processing...') : pick('Beli', 'Buy Now')}
                    </button>
                </div>
            )}
        </article>
    );
}
