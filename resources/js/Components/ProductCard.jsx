import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Check, ShoppingCart, ShieldCheck, Heart } from 'lucide-react';

function sexLabel(sex) {
    switch (sex) {
        case 'male':
            return { label: '♂ Jantan', bg: 'bg-slate-900 text-white' };
        case 'female':
            return { label: '♀ Betina', bg: 'bg-rose-600 text-white' };
        case 'pair':
            return { label: 'Sepasang', bg: 'bg-purple-600 text-white' };
        default:
            return { label: 'Unsexed', bg: 'bg-slate-700 text-white' };
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);
}

const fallbackFish = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='750' viewBox='0 0 600 750' fill='none'%3E%3Crect width='600' height='750' fill='%23F1F5F9'/%3E%3Cpath d='M300 280 C390 280 450 340 450 380 C450 420 390 480 300 480 C240 480 180 420 130 435 L130 325 C180 340 240 280 300 280 Z' fill='%230F172A' opacity='0.7'/%3E%3Ccircle cx='390' cy='350' r='10' fill='white'/%3E%3Ctext x='50%25' y='560' text-anchor='middle' fill='%2364748B' font-family='sans-serif' font-weight='600' font-size='18'%3EDunia Ikan Specimen%3C/text%3E%3C/svg%3E";

export default function ProductCard({ product }) {
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const fish = product.fish_detail || product.fishDetail;

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

    const sexBadge = fish?.sex ? sexLabel(fish.sex) : null;

    return (
        <article className="group flex flex-col select-none">
            {/* Catalyst-style Studio Card Image Container */}
            <div className="relative aspect-[3/4] rounded-2xl bg-[#ECECEC] overflow-hidden border border-slate-200/60 shadow-xs group-hover:shadow-md transition-all duration-300">
                <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    <img
                        src={product.image || fallbackFish}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = fallbackFish;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </Link>

                {/* Top Right: Wishlist Heart Button */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsFavorite(!isFavorite);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-xs text-slate-700 hover:text-rose-600 transition shadow-xs"
                    title="Simpan ke Favorit"
                >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                {/* Top Left: Live Arrival Guarantee (DOA) Badge */}
                {product.store?.doa_policy && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs border border-slate-200/50">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>DOA 100%</span>
                    </div>
                )}

                {/* Stock Out Badge */}
                {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                        <span className="px-3 py-1 bg-white text-slate-900 font-extrabold text-xs rounded-full uppercase tracking-wider shadow-sm">
                            Habis
                        </span>
                    </div>
                )}

                {/* Bottom Left on Image: Sex Badge */}
                {sexBadge && (
                    <div className="absolute bottom-3 left-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${sexBadge.bg}`}>
                            {sexBadge.label}
                        </span>
                    </div>
                )}
            </div>

            {/* Product Meta (Catalyst Minimalist Typography) */}
            <div className="pt-3 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="truncate">{fish?.morph_trait || product.category?.name}</span>
                    <span className="text-[11px] text-slate-400 shrink-0">{product.store?.city}</span>
                </div>

                <div className="flex items-start justify-between gap-2">
                    <Link
                        href={`/products/${product.slug}`}
                        className="text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-700 transition leading-snug line-clamp-1"
                    >
                        {product.name}
                    </Link>

                    {product.stock > 0 && (
                        <button
                            type="button"
                            onClick={handleQuickAdd}
                            disabled={adding}
                            className={`p-1.5 rounded-full transition shrink-0 ${
                                added
                                    ? 'bg-emerald-600 text-white'
                                    : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                            title="Tambah ke Keranjang"
                        >
                            {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                        </button>
                    )}
                </div>

                <p className="text-xs sm:text-sm font-extrabold text-slate-900 tabular-nums">
                    {formatPrice(product.price)}
                </p>
            </div>
        </article>
    );
}
