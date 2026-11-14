import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Check, ShoppingCart, ShieldCheck, Heart, Store, Dna, Thermometer, Droplets } from 'lucide-react';

function sexLabel(sex) {
    switch (sex) {
        case 'male':
            return { label: '♂ Jantan', bg: 'bg-[#001454] text-white' };
        case 'female':
            return { label: '♀ Betina', bg: 'bg-[#006783] text-white' };
        case 'pair':
            return { label: 'Sepasang', bg: 'bg-[#0D2E92] text-white' };
        default:
            return { label: 'Unsexed', bg: 'bg-[#3d4949] text-white' };
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);
}

const fallbackFish = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='750' viewBox='0 0 600 750' fill='none'%3E%3Crect width='600' height='750' fill='%23f3f2ff'/%3E%3Cpath d='M300 280 C390 280 450 340 450 380 C450 420 390 480 300 480 C240 480 180 420 130 435 L130 325 C180 340 240 280 300 280 Z' fill='%23001454' opacity='0.7'/%3E%3Ccircle cx='390' cy='350' r='10' fill='white'/%3E%3Ctext x='50%25' y='560' text-anchor='middle' fill='%231E80A0' font-family='sans-serif' font-weight='600' font-size='18'%3EDunia Ikan Specimen%3C/text%3E%3C/svg%3E";

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
        <article className="group flex flex-col select-none bg-white dark:bg-[#0f172a] rounded-2xl border border-[#1E80A0]/10 dark:border-neutral-800 overflow-hidden hover:border-[#4AB8BD]/50 hover:shadow-lg transition-all duration-300">
            {/* MorphMarket Specimen Image Container */}
            <div className="relative aspect-[4/5] sm:aspect-[3/4] bg-[#f3f2ff] dark:bg-[#162240] overflow-hidden">
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

                {/* Top Right: Wishlist Heart */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsFavorite(!isFavorite);
                    }}
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xs text-[#1E80A0] dark:text-[#4AB8BD] hover:text-[#0684E5] transition shadow-xs z-10"
                    title="Simpan ke Favorit"
                    aria-label="Simpan ke Favorit"
                >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#0684E5] text-[#0684E5]' : ''}`} />
                </button>

                {/* Top Left: DOA 100% Guarantee Badge */}
                {product.store?.doa_policy && (
                    <div className="absolute top-2.5 left-2.5 bg-[#C0ECB8] text-[#0D2E92] text-[10px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs uppercase z-10">
                        <ShieldCheck className="w-3 h-3 text-[#0D2E92]" />
                        <span>Garansi Hidup 100%</span>
                    </div>
                )}

                {/* Stock Out Overlay */}
                {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-[#001454]/65 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center z-20">
                        <span className="px-3 py-1 bg-white dark:bg-[#111a30] text-[#ba1a1a] dark:text-[#ffb4ab] border border-transparent dark:border-red-500/30 font-extrabold text-xs rounded-full uppercase tracking-wider shadow-sm">
                            Habis Terjual
                        </span>
                    </div>
                )}

                {/* Bottom Left: Sex Badge (♂ / ♀) */}
                {sexBadge && (
                    <div className="absolute bottom-2.5 left-2.5 z-10">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${sexBadge.bg}`}>
                            {sexBadge.label}
                        </span>
                    </div>
                )}

                {/* Bottom Right: Captive-Bred / F1 Tag */}
                {fish?.breeding_origin === 'captive_bred' && (
                    <div className="absolute bottom-2.5 right-2.5 z-10">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xs text-[#00696D] dark:text-[#4AB8BD] shadow-xs">
                            Captive-Bred
                        </span>
                    </div>
                )}
            </div>

            {/* Specimen Details & Morph Taxonomy (MorphMarket Style) */}
            <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
                <div className="space-y-1">
                    {/* Morph Gene Trait Pill */}
                    {fish?.morph_trait ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ececff] dark:bg-[#162240] text-[#001454] dark:text-cyan-300 text-[10px] font-bold tracking-tight">
                            <Dna className="w-3 h-3 text-[#4AB8BD]" />
                            <span className="truncate max-w-[170px]">{fish.morph_trait}</span>
                        </div>
                    ) : (
                        <span className="text-[10px] font-bold text-[#1E80A0] dark:text-[#4AB8BD] uppercase tracking-wider">
                            {product.category?.name}
                        </span>
                    )}

                    {/* Specimen Name */}
                    <Link
                        href={`/products/${product.slug}`}
                        className="block text-xs sm:text-sm font-bold text-[#001454] dark:text-white hover:text-[#0684E5] dark:hover:text-[#4AB8BD] transition leading-snug line-clamp-1"
                        title={product.name}
                    >
                        {product.name}
                    </Link>

                    {/* Scientific Name (Latin) */}
                    {fish?.species_name && (
                        <p className="text-[11px] italic text-[#6d797a] dark:text-neutral-400 truncate">
                            {fish.species_name}
                        </p>
                    )}
                </div>

                {/* Biological Parameter Chips (Water, pH, Temp) */}
                {fish && (
                    <div className="pt-1 flex items-center gap-2 text-[10px] text-[#3d4949] dark:text-neutral-300 font-medium border-t border-[#1E80A0]/10 dark:border-neutral-800">
                        <span className="flex items-center gap-0.5">
                            <Droplets className="w-3 h-3 text-[#1E80A0] dark:text-[#4AB8BD]" />
                            <span>pH {fish.ph_min || 6.5}-{fish.ph_max || 7.5}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                            <Thermometer className="w-3 h-3 text-[#0684E5] dark:text-cyan-400" />
                            <span>{fish.temp_min || 24}-{fish.temp_max || 29}°C</span>
                        </span>
                    </div>
                )}

                {/* Breeder / Farm Info */}
                <div className="flex items-center justify-between text-[11px] text-[#1E80A0] dark:text-[#4AB8BD] pt-1">
                    <span className="flex items-center gap-1 truncate font-semibold">
                        <Store className="w-3 h-3 shrink-0 text-[#4AB8BD]" />
                        <span className="truncate">{product.store?.name}</span>
                    </span>
                    <span className="text-[10px] text-[#6d797a] dark:text-neutral-400 shrink-0">{product.store?.city}</span>
                </div>

                {/* Price & Action Button */}
                <div className="pt-2 border-t border-[#1E80A0]/10 dark:border-neutral-800 flex items-center justify-between gap-2">
                    <p className="text-sm sm:text-base font-extrabold text-[#0684E5] dark:text-cyan-400 tabular-nums">
                        {formatPrice(product.price)}
                    </p>

                    {product.stock > 0 && (
                        <button
                            type="button"
                            onClick={handleQuickAdd}
                            disabled={adding}
                            className={`p-2 rounded-xl transition-all shadow-xs flex items-center justify-center ${
                                added
                                    ? 'bg-[#00696D] text-white scale-105'
                                    : 'bg-[#f3f2ff] dark:bg-[#162240] text-[#0684E5] dark:text-cyan-400 hover:bg-[#0684E5] hover:text-white dark:hover:bg-[#4AB8BD] dark:hover:text-black'
                            }`}
                            title="Beli / Tambah ke Keranjang"
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
