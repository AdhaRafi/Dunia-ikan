import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Check, ShoppingCart, ShieldCheck, MapPin } from 'lucide-react';

function sexLabel(sex) {
    switch (sex) {
        case 'male':
            return { label: '♂ Jantan', bg: 'bg-blue-900/80 text-blue-200 border-blue-400/30' };
        case 'female':
            return { label: '♀ Betina', bg: 'bg-rose-900/80 text-rose-200 border-rose-400/30' };
        case 'pair':
            return { label: 'Sepasang', bg: 'bg-purple-900/80 text-purple-200 border-purple-400/30' };
        default:
            return { label: 'Unsexed', bg: 'bg-slate-900/80 text-slate-300 border-slate-500/30' };
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);
}

const fallbackFish = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='750' viewBox='0 0 600 750' fill='none'%3E%3Crect width='600' height='750' fill='%230E1719'/%3E%3Cpath d='M300 280 C390 280 450 340 450 380 C450 420 390 480 300 480 C240 480 180 420 130 435 L130 325 C180 340 240 280 300 280 Z' fill='%2300C882' opacity='0.8'/%3E%3Ccircle cx='390' cy='350' r='10' fill='white'/%3E%3Ctext x='50%25' y='560' text-anchor='middle' fill='%2394A3B8' font-family='sans-serif' font-weight='600' font-size='18'%3EDunia Ikan Specimen%3C/text%3E%3C/svg%3E";

export default function ProductCard({ product }) {
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);
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
        <article className="group bg-white rounded-xl border border-slate-200/90 hover:border-[#00C882] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
            {/* Image Tile */}
            <Link
                href={`/products/${product.slug}`}
                className="block relative aspect-[4/5] bg-slate-900 overflow-hidden"
            >
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

                {/* Live Arrival (DOA) Guarantee Badge */}
                {product.store?.doa_policy && (
                    <div className="absolute top-2.5 left-2.5 bg-[#0E1719]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm border border-emerald-500/30">
                        <ShieldCheck className="w-3 h-3 text-[#00C882]" />
                        <span>DOA 100%</span>
                    </div>
                )}

                {/* Stock Out or Low Stock Tag */}
                {product.stock <= 0 ? (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
                        <span className="px-3 py-1 bg-rose-600 text-white font-bold text-xs rounded-md uppercase tracking-wider">
                            Habis
                        </span>
                    </div>
                ) : product.stock <= 3 ? (
                    <span className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        Sisa {product.stock}
                    </span>
                ) : null}

                {/* Sex Badge Bottom Left on Image (MorphMarket style) */}
                {sexBadge && (
                    <div className="absolute bottom-2.5 left-2.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border backdrop-blur-xs shadow-xs ${sexBadge.bg}`}>
                            {sexBadge.label}
                        </span>
                    </div>
                )}
            </Link>

            {/* Product Meta */}
            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                    {/* Morph or Category */}
                    <div className="flex items-center gap-1.5 flex-wrap text-[11px] mb-1 font-semibold text-[#00C882]">
                        {fish?.morph_trait ? (
                            <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md">
                                {fish.morph_trait}
                            </span>
                        ) : (
                            <span className="text-slate-400">
                                {product.category?.name}
                            </span>
                        )}
                    </div>

                    <Link
                        href={`/products/${product.slug}`}
                        className="block text-sm font-extrabold text-slate-900 group-hover:text-[#00C882] transition leading-snug line-clamp-2"
                    >
                        {product.name}
                    </Link>

                    {/* Parametric Traits */}
                    {fish && (
                        <p className="mt-1.5 text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
                            {fish.water_type && (
                                <span className="capitalize">{fish.water_type}</span>
                            )}
                            {fish.min_tank_liters && (
                                <span>• Min. {fish.min_tank_liters}L</span>
                            )}
                            {fish.temp_min && (
                                <span>• {fish.temp_min}-{fish.temp_max}°C</span>
                            )}
                        </p>
                    )}
                </div>

                {/* Price and Cart Action */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                        <p className="text-sm font-extrabold text-slate-900 tabular-nums">
                            {formatPrice(product.price)}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-2.5 h-2.5 text-[#00C882]" />
                            {product.store?.city || 'Indonesia'}
                        </p>
                    </div>

                    {product.stock > 0 && (
                        <button
                            type="button"
                            onClick={handleQuickAdd}
                            disabled={adding}
                            title="Tambah ke keranjang"
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition shadow-xs ${
                                added
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-[#0E1719] text-[#00C882] hover:bg-[#00C882] hover:text-slate-950'
                            }`}
                        >
                            {added ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <ShoppingCart className="h-3.5 w-3.5" />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}
