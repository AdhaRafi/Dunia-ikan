import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Check, ShoppingCart, Heart } from 'lucide-react';

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);
}

const fallbackFish =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600' fill='none'%3E%3Crect width='600' height='600' fill='%23f8fafc'/%3E%3Cpath d='M300 220 C380 220 435 270 435 300 C435 330 380 380 300 380 C245 380 190 330 145 345 L145 255 C190 270 245 220 300 220 Z' fill='%23001454' opacity='0.25'/%3E%3C/svg%3E";

export default function ProductCard({ product }) {
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.stock <= 0 || adding) {
            return;
        }

        setAdding(true);
        router.post(
            '/cart',
            { product_id: product.id, quantity: 1 },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setAdding(false);
                    setAdded(true);
                    setTimeout(() => setAdded(false), 2000);
                },
                onError: () => setAdding(false),
            },
        );
    };

    const metaLine = [product.store?.name, product.store?.city].filter(Boolean).join(' · ');

    return (
        <article className="group flex flex-col select-none bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-neutral-800 overflow-hidden hover:border-[#4AB8BD] hover:shadow-md transition-all duration-200">
            <div className="relative aspect-[4/3] bg-slate-100 dark:bg-[#162240] overflow-hidden">
                <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    <img
                        src={product.image || fallbackFish}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = fallbackFish;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </Link>

                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsFavorite(!isFavorite);
                    }}
                    className={`p-1.5 rounded-full bg-white/90 dark:bg-neutral-900/90 text-slate-500 hover:text-[#0684E5] transition shadow-xs z-10 absolute top-2.5 right-2.5 ${
                        isFavorite ? 'opacity-100 text-[#0684E5]' : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
                    }`}
                    title="Simpan ke Favorit"
                    aria-label="Simpan ke Favorit"
                >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#0684E5] text-[#0684E5]' : ''}`} />
                </button>

                {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/55 flex items-center justify-center z-20">
                        <span className="px-3 py-1 bg-white dark:bg-[#111a30] text-[#ba1a1a] dark:text-[#ffb4ab] font-bold text-xs rounded-md">
                            Habis
                        </span>
                    </div>
                )}
            </div>

            <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
                <div className="space-y-1">
                    <Link
                        href={`/products/${product.slug}`}
                        className="block text-xs sm:text-sm font-semibold text-[#001454] dark:text-white hover:text-[#0684E5] dark:hover:text-[#4AB8BD] transition leading-snug line-clamp-2"
                        title={product.name}
                    >
                        {product.name}
                    </Link>

                    {metaLine && (
                        <p className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">
                            {metaLine}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                    <p className="text-sm sm:text-base font-bold text-[#001454] dark:text-cyan-400 tabular-nums">
                        {formatPrice(product.price)}
                    </p>

                    {product.stock > 0 && (
                        <button
                            type="button"
                            onClick={handleQuickAdd}
                            disabled={adding}
                            className={`p-1.5 rounded-lg transition flex items-center justify-center ${
                                added
                                    ? 'bg-[#00696D] text-white'
                                    : 'bg-slate-100 dark:bg-[#162240] text-[#001454] dark:text-cyan-400 hover:bg-[#0684E5] hover:text-white dark:hover:bg-[#4AB8BD] dark:hover:text-black'
                            }`}
                            title="Tambah ke Keranjang"
                            aria-label="Tambah ke Keranjang"
                        >
                            {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}
