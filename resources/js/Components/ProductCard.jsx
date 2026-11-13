import { Link, router } from '@inertiajs/react';
import { ShoppingCart, ShieldCheck, MapPin, Check } from 'lucide-react';
import { useState } from 'react';

export default function ProductCard({ product }) {
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);

    const fish = product.fishDetail;

    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.stock <= 0 || adding) return;

        setAdding(true);
        router.post('/cart', {
            product_id: product.id,
            quantity: 1,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setAdding(false);
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
            },
            onError: () => {
                setAdding(false);
            }
        });
    };

    // Helper formatting currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    // Helper for sex badge colors (MorphMarket style)
    const getSexBadge = (sex) => {
        switch (sex) {
            case 'male':
                return { label: '♂ Jantan', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
            case 'female':
                return { label: '♀ Betina', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
            case 'pair':
                return { label: 'Pair (Sepasang)', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
            default:
                return { label: 'Unsexed', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
        }
    };

    return (
        <div className="group bg-white rounded-lg border border-sky-100 hover:border-dunia-aqua/60 hover:shadow-lg hover:shadow-sky-100/50 transition-all duration-200 flex flex-col overflow-hidden relative">
            {/* Image Container with 4:5 Aspect Ratio */}
            <Link href={`/products/${product.slug}`} className="block relative aspect-4/5 bg-slate-100 overflow-hidden">
                <img
                    src={product.image || 'https://images.unsplash.com/photo-1544943910-4c1dc44a0b27?auto=format&fit=crop&w=600&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />

                {/* Live Arrival (DOA) Guarantee Badge */}
                {product.store?.doa_policy && (
                    <div className="absolute top-2 left-2 bg-dunia-navy/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                        <ShieldCheck className="w-3 h-3 text-dunia-aqua" />
                        Garansi DOA
                    </div>
                )}

                {/* Stock Tag if low */}
                {product.stock <= 0 ? (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                        <span className="px-3 py-1 bg-rose-600 text-white font-bold text-xs rounded-md uppercase tracking-wider">
                            Habis
                        </span>
                    </div>
                ) : product.stock <= 3 ? (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        Sisa {product.stock}
                    </div>
                ) : null}

                {/* Sex Badge Bottom Left on Image */}
                {fish && fish.sex && (
                    <div className="absolute bottom-2 left-2">
                        {(() => {
                            const badge = getSexBadge(fish.sex);
                            return (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shadow-xs ${badge.bg}`}>
                                    {badge.label}
                                </span>
                            );
                        })()}
                    </div>
                )}
            </Link>

            {/* Product Meta & Details */}
            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                    {/* Morph / Trait or Category */}
                    <div className="flex items-center gap-1.5 flex-wrap text-[11px] mb-1">
                        {fish?.morph_trait ? (
                            <span className="font-semibold text-dunia-marine bg-sky-50 px-1.5 py-0.5 rounded-sm">
                                {fish.morph_trait}
                            </span>
                        ) : (
                            <span className="text-slate-500 font-medium">
                                {product.category?.name}
                            </span>
                        )}

                        {fish?.care_level && (
                            <span className="text-[10px] text-slate-500 capitalize">
                                • {fish.care_level}
                            </span>
                        )}
                    </div>

                    {/* Product Name */}
                    <Link
                        href={`/products/${product.slug}`}
                        className="font-bold text-sm text-slate-900 hover:text-dunia-blue line-clamp-2 leading-snug transition"
                    >
                        {product.name}
                    </Link>
                </div>

                {/* Price & Store Info */}
                <div className="pt-2 border-t border-slate-100 flex items-end justify-between gap-2">
                    <div>
                        <p className="text-base font-extrabold text-dunia-blue tracking-tight">
                            {formatPrice(product.price)}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[110px]">{product.store?.city || 'Indonesia'}</span>
                        </div>
                    </div>

                    {/* Quick Add Button */}
                    {product.stock > 0 && (
                        <button
                            type="button"
                            onClick={handleQuickAdd}
                            disabled={adding}
                            title="Tambah ke Keranjang"
                            className={`p-2 rounded-lg font-medium transition cursor-pointer flex items-center justify-center shrink-0 ${
                                added
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-dunia-blue text-white hover:bg-sky-600 active:scale-95'
                            }`}
                        >
                            {added ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <ShoppingCart className="w-4 h-4" />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
