import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import FavoriteButton from '@/Components/FavoriteButton';
import ProductCard from '@/Components/ProductCard';
import StoreRatingSection from '@/Components/StoreRatingSection';
import {
    Check,
    ChevronDown,
    ChevronLeft,
    Clock,
    Droplets,
    Fish,
    MapPin,
    MessageSquare,
    Minus,
    Package,
    Plus,
    ShieldCheck,
    ShoppingCart,
    Star,
    Store,
    Thermometer,
} from '@/Components/Icons';
import { useLanguage } from '@/lib/i18n';

const fallbackFish =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450' fill='none'%3E%3Crect width='600' height='450' fill='%23f4f4f5'/%3E%3Cpath d='M300 155 C380 155 435 205 435 235 C435 265 380 315 300 315 C245 315 190 265 145 280 L145 190 C190 205 245 155 300 155 Z' fill='%23001454' opacity='0.22'/%3E%3C/svg%3E";

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);
}

function getSexLabel(sex, isEn) {
    switch (sex) {
        case 'male':
            return isEn ? 'Male' : 'Jantan';
        case 'female':
            return isEn ? 'Female' : 'Betina';
        case 'pair':
            return isEn ? 'Pair' : 'Sepasang';
        default:
            return 'Unsexed';
    }
}

function getWaterLabel(water, isEn) {
    switch (water) {
        case 'saltwater':
            return isEn ? 'Saltwater' : 'Air Laut';
        case 'brackish':
            return isEn ? 'Brackish' : 'Air Payau';
        default:
            return isEn ? 'Freshwater' : 'Air Tawar';
    }
}

function getOriginLabel(origin, isEn) {
    switch (origin) {
        case 'wild_caught':
            return isEn ? 'Wild Caught' : 'Tangkapan Liar';
        case 'farm_raised':
            return isEn ? 'Farm Raised' : 'Peternakan';
        default:
            return 'Captive Bred';
    }
}

function AccordionCard({ title, defaultOpen = true, children }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="card-hover-subtle rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-neutral-800 px-4 sm:px-5 py-4 shadow-[0_1px_4px_rgba(15,23,42,0.02)]">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                className="group w-full flex items-center justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00477C] rounded-lg"
            >
                <span className="text-sm font-bold text-slate-900 dark:text-white">{title}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
            </button>

            {open && <div className="swap-in mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">{children}</div>}
        </div>
    );
}

function MetaIconItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3 min-w-0">
            <span className="w-9 h-9 rounded-full border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-slate-800/70 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                <Icon className="w-4 h-4" strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{label}</p>
                <p className="text-xs sm:text-[13px] font-semibold text-slate-900 dark:text-white truncate">
                    {value}
                </p>
            </div>
        </div>
    );
}

export default function Show({ product, relatedProducts, storeRating }) {
    const { auth } = usePage().props;
    const { pick, isEn, trCategory } = useLanguage();
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [buying, setBuying] = useState(false);
    const [added, setAdded] = useState(false);

    const fish = product.fish_detail;
    const store = product.store;
    const avgRating = storeRating?.count > 0 ? Number(storeRating.average).toFixed(1) : null;

    const handleCartAction = (redirectToCheckout = false) => {
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
            { product_id: product.id, quantity },
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
                    setTimeout(() => setAdded(false), 2600);
                },
                onError: () => {
                    setAdding(false);
                    setBuying(false);
                },
            },
        );
    };

    const quickHighlights = fish
        ? [
              {
                  icon: Thermometer,
                  label: pick('Suhu & pH', 'Temp & pH'),
                  value:
                      fish.temp_min != null && fish.ph_min != null
                          ? `${fish.temp_min}–${fish.temp_max}°C · pH ${fish.ph_min}–${fish.ph_max}`
                          : pick('Terukur', 'Measured'),
              },
              {
                  icon: Droplets,
                  label: pick('Perawatan', 'Care Level'),
                  value: [fish.care_level, fish.temperament].filter(Boolean).join(' · ') || pick('Standar', 'Standard'),
              },
              {
                  icon: Fish,
                  label: pick('Spesimen', 'Specimen'),
                  value: fish.size_stage
                      ? `${getSexLabel(fish.sex, isEn)} · ${fish.size_stage}`
                      : getSexLabel(fish.sex, isEn),
              },
          ]
        : [
              {
                  icon: Package,
                  label: pick('Kategori', 'Category'),
                  value: trCategory(product.category?.name) || pick('Perlengkapan', 'Equipment'),
              },
              {
                  icon: ShieldCheck,
                  label: pick('Stok Penangkar', 'Breeder Stock'),
                  value:
                      product.stock > 0
                          ? pick(`${product.stock} unit siap`, `${product.stock} units ready`)
                          : pick('Habis', 'Sold Out'),
              },
              {
                  icon: Store,
                  label: pick('Asal Toko', 'Store Location'),
                  value: store?.city || 'Indonesia',
              },
          ];

    return (
        <AppLayout>
            <Head title={`${product.name} — Dunia Ikan`}>
                <meta
                    head-key="description"
                    name="description"
                    content={String(product.description || product.name).slice(0, 155)}
                />
            </Head>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Breadcrumb */}
                <nav
                    className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400"
                    aria-label="Breadcrumb"
                >
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        {pick('Katalog', 'Catalog')}
                    </Link>
                    <span>/</span>
                    {product.category && (
                        <>
                            <Link
                                href={`/products?category=${product.category.slug}`}
                                className="hover:text-slate-900 dark:hover:text-white transition"
                            >
                                {trCategory(product.category.name)}
                            </Link>
                            <span>/</span>
                        </>
                    )}
                    <span className="max-w-[26ch] sm:max-w-[40ch] truncate text-slate-900 dark:text-white font-semibold">
                        {product.name}
                    </span>
                </nav>

                {/* Main 2-Column Showcase */}
                <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Column: Hero Photo + 3 Highlight Tiles + Store Trust Card */}
                    <div className="lg:col-span-6 space-y-3.5 min-w-0">
                        <div className="relative aspect-[4/3] rounded-[22px] sm:rounded-[24px] overflow-hidden bg-[#f4f5f7] dark:bg-[#131d33] border border-slate-200/80 dark:border-neutral-800">
                            <img
                                src={product.image || fallbackFish}
                                alt={product.name}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = fallbackFish;
                                }}
                                className="w-full h-full object-cover"
                            />

                            {fish?.water_type && (
                                <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/95 dark:bg-neutral-900/90 text-[11px] font-semibold text-slate-800 dark:text-slate-200 shadow-xs">
                                    {getWaterLabel(fish.water_type, isEn)}
                                </span>
                            )}

                            <FavoriteButton
                                productId={product.id}
                                className="absolute top-3.5 right-3.5 z-10 h-10 w-10 rounded-full bg-white/95 dark:bg-[#0e1424]/90 shadow-md hover:scale-110 transition flex items-center justify-center"
                                iconClassName="w-5 h-5"
                            />

                            {product.stock <= 0 && (
                                <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                                    <span className="px-4 py-1.5 rounded-full bg-white dark:bg-[#111a30] text-rose-600 dark:text-rose-400 font-bold text-xs shadow-sm">
                                        {pick('Stok Habis', 'Out of Stock')}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* 3-Tile Quick Highlights Strip (mirrors Dribbble bottom thumbnail strip) */}
                        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                            {quickHighlights.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.label}
                                        className="rounded-2xl bg-[#f4f5f7] dark:bg-[#131d33] border border-slate-200/70 dark:border-neutral-800 p-3 min-w-0"
                                    >
                                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                            <Icon className="w-3.5 h-3.5 shrink-0" />
                                            <span className="text-[11px] font-medium truncate">
                                                {item.label}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xs font-semibold leading-snug text-slate-900 dark:text-white line-clamp-2 capitalize">
                                            {item.value}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Store Banner Card with Live Store Rating */}
                        {store && (
                            <div className="rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-neutral-800 p-4 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    {store.logo_url ? (
                                        <img
                                            src={store.logo_url}
                                            alt={store.name}
                                            className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-neutral-700 shrink-0"
                                        />
                                    ) : (
                                        <div className="w-11 h-11 rounded-full bg-[#14335D] dark:bg-[#14335D] text-white font-bold text-sm flex items-center justify-center shrink-0">
                                            {store.name?.charAt(0)?.toUpperCase() || 'T'}
                                        </div>
                                    )}

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Link
                                                href={`/stores/${store.slug}`}
                                                className="text-sm font-bold text-slate-900 dark:text-white hover:text-[#00477C] dark:hover:text-sky-400 truncate"
                                            >
                                                {store.name}
                                            </Link>
                                            <a
                                                href="#rating-toko"
                                                className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200/70 dark:border-amber-900/60 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300 shrink-0 hover:bg-amber-100/70 transition"
                                            >
                                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                {avgRating ? `${avgRating} (${storeRating.count})` : pick('Baru', 'New')}
                                            </a>
                                        </div>
                                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                                            {store.city}, {store.province}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    {auth?.user?.store?.id === store.id ? (
                                        <Link
                                            href="/chat?tab=store"
                                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#14335D] hover:bg-[#005A9D] dark:bg-[#60C2E6] dark:hover:bg-[#49b3db] text-white dark:text-[#14335D] text-xs font-bold transition"
                                        >
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            {pick('Chat Pembeli', 'Buyer Chats')}
                                        </Link>
                                    ) : auth?.user ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.post(`/stores/${store.slug}/chat`, {
                                                    product_id: product.id,
                                                })
                                            }
                                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#14335D] hover:bg-[#005A9D] dark:bg-[#60C2E6] dark:hover:bg-[#49b3db] text-white dark:text-[#14335D] text-xs font-bold transition cursor-pointer"
                                        >
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            {pick('Chat Toko', 'Chat Store')}
                                        </button>
                                    ) : (
                                        <Link
                                            href="/login"
                                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#14335D] hover:bg-[#005A9D] dark:bg-[#60C2E6] dark:hover:bg-[#49b3db] text-white dark:text-[#14335D] text-xs font-bold transition"
                                        >
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            {pick('Chat Toko', 'Chat Store')}
                                        </Link>
                                    )}
                                    <Link
                                        href={`/stores/${store.slug}`}
                                        className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-neutral-700 bg-white dark:bg-[#111a30] hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
                                    >
                                        {pick('Kunjungi Toko', 'Visit Store')}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Meta, Price, Accordions, Quantity & Pill CTAs */}
                    <div className="lg:col-span-6 space-y-5 min-w-0">
                        <div>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-xs font-semibold text-[#00477C] dark:text-sky-400">
                                    {trCategory(product.category?.name)}
                                    {fish?.species_name ? ` · ${fish.species_name}` : ''}
                                </p>
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                        product.stock > 0
                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                    }`}
                                >
                                    {product.stock > 0
                                        ? pick(`Stok ${product.stock}`, `${product.stock} in stock`)
                                        : pick('Stok Habis', 'Out of Stock')}
                                </span>
                            </div>

                            <h1 className="text-mask mt-1.5 text-2xl sm:text-[32px] font-bold tracking-[-0.025em] leading-[1.15] text-slate-900 dark:text-white break-words">
                                <span className="text-mask-inner">
                                    {product.name}
                                </span>
                            </h1>

                            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
                                <p className="text-2xl sm:text-[28px] font-bold tabular-nums text-slate-900 dark:text-white">
                                    {formatPrice(product.price)}
                                </p>
                                {avgRating && (
                                    <a
                                        href="#rating-toko"
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                                    >
                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        <span>{pick(`Rating Toko ${avgRating}/5`, `Store Rating ${avgRating}/5`)}</span>
                                        <span className="text-slate-400">({storeRating.count})</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Collapsible Description Card */}
                        <AccordionCard title={pick('Deskripsi', 'Description')} defaultOpen={true}>
                            <p className="whitespace-pre-line text-xs sm:text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">
                                {product.description}
                            </p>
                        </AccordionCard>

                        {/* Specimen Characteristic Pills */}
                        {fish && (
                            <div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                                    {pick('Karakteristik Spesimen', 'Specimen Characteristics')}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-[#0e1424] text-xs font-medium text-slate-700 dark:text-slate-200">
                                        {getWaterLabel(fish.water_type, isEn)}
                                    </span>
                                    <span className="px-3 py-1 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-[#0e1424] text-xs font-medium text-slate-700 dark:text-slate-200">
                                        {getSexLabel(fish.sex, isEn)}
                                    </span>
                                    {fish.size_stage && (
                                        <span className="px-3 py-1 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-[#0e1424] text-xs font-medium text-slate-700 dark:text-slate-200">
                                            {pick('Ukuran', 'Size')} {fish.size_stage}
                                        </span>
                                    )}
                                    {fish.min_tank_liters && (
                                        <span className="px-3 py-1 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-[#0e1424] text-xs font-medium text-slate-700 dark:text-slate-200">
                                            {pick('Tank min.', 'Min. tank')} {fish.min_tank_liters}L
                                        </span>
                                    )}
                                    <span className="px-3 py-1 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-[#0e1424] text-xs font-medium text-slate-700 dark:text-slate-200">
                                        {getOriginLabel(fish.breeding_origin, isEn)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Quantity Stepper + Single-Row Outline & Solid Dark Pill CTAs */}
                        {product.stock > 0 ? (
                            <div className="space-y-3">
                                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-neutral-700 bg-white dark:bg-[#0b101d] p-1 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            aria-label={pick('Kurangi jumlah', 'Decrease quantity')}
                                            className="btn-motion w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-700 dark:bg-slate-800 text-white flex items-center justify-center"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span key={quantity} className="micro-pop w-7 text-center text-sm font-bold tabular-nums text-slate-900 dark:text-white">
                                            {quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity(Math.min(product.stock, quantity + 1))
                                            }
                                            aria-label={pick('Tambah jumlah', 'Increase quantity')}
                                            className="btn-motion w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-700 dark:bg-slate-800 text-white flex items-center justify-center"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleCartAction(false)}
                                        disabled={adding || buying}
                                        className={`btn-motion flex-1 min-w-[140px] h-11 px-4 rounded-full border border-slate-300 dark:border-neutral-700 bg-white dark:bg-[#0e1424] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 ${
                                            added ? 'micro-pop border-emerald-500/60 bg-emerald-50/70 dark:bg-emerald-950/30' : ''
                                        }`}
                                    >
                                        {added ? (
                                            <>
                                                <Check className="w-4 h-4 text-emerald-600 micro-pop" />
                                                {pick('Masuk Keranjang', 'In Cart')}
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-4 h-4" />
                                                {adding ? pick('Menambahkan...', 'Adding...') : pick('Keranjang', 'Add to Cart')}
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleCartAction(true)}
                                        disabled={adding || buying}
                                        className="btn-motion btn-sheen flex-1 min-w-[140px] h-11 px-5 rounded-full bg-slate-950 hover:bg-slate-800 dark:bg-[#005A9D] dark:hover:bg-[#00477C] text-white text-xs sm:text-sm font-semibold shadow-[0_6px_18px_rgba(15,23,42,0.18)] flex items-center justify-center disabled:opacity-50"
                                    >
                                        {buying ? pick('Memproses...', 'Processing...') : pick('Beli Sekarang', 'Buy Now')}
                                    </button>
                                </div>

                                {added && (
                                    <div className="flex items-center justify-between gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 px-4 py-2.5 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                                        <span>{pick('Produk berhasil ditambahkan ke keranjang Anda.', 'Product added to your cart.')}</span>
                                        <Link
                                            href="/cart"
                                            className="font-bold underline underline-offset-4 shrink-0"
                                        >
                                            {pick('Lihat Keranjang', 'View Cart')}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-2xl bg-slate-100 dark:bg-slate-800/70 p-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                                {pick('Produk ini sedang habis dari penangkar.', 'This item is currently out of stock from the breeder.')}
                            </div>
                        )}

                        {/* Collapsible Shipping & DOA Card (2x2 circular icon grid) */}
                        <AccordionCard title={pick('Pengiriman & Garansi', 'Shipping & Guarantee')} defaultOpen={true}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <MetaIconItem
                                    icon={ShieldCheck}
                                    label={pick('Garansi Hidup', 'Live Guarantee')}
                                    value={pick('DOA 100% Ikan Selamat', '100% Live Arrival (DOA)')}
                                />
                                <MetaIconItem
                                    icon={Package}
                                    label={pick('Kemasan', 'Packaging')}
                                    value={pick('Oksigen Ganda + Boks', 'Double O₂ + Insulated Box')}
                                />
                                <MetaIconItem
                                    icon={Clock}
                                    label={pick('Estimasi Kirim', 'Shipping Estimate')}
                                    value="Instant / Nextday"
                                />
                                <MetaIconItem
                                    icon={MapPin}
                                    label={pick('Asal Pengiriman', 'Ships From')}
                                    value={store ? `${store.city}, ${store.province}` : 'Indonesia'}
                                />
                            </div>

                            {store?.doa_policy && (
                                <p className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                                        {pick('Kebijakan Toko:', 'Store Policy:')}{' '}
                                    </span>
                                    {store.doa_policy}
                                </p>
                            )}
                        </AccordionCard>

                        {/* Collapsible Fish Parameter Details Card */}
                        {fish && (
                            <AccordionCard title={pick('Data Air & Spesifikasi', 'Water Parameters & Specs')} defaultOpen={false}>
                                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
                                    <div>
                                        <dt className="text-slate-400 dark:text-slate-500">{pick('Spesies', 'Species')}</dt>
                                        <dd className="mt-0.5 font-semibold italic text-slate-900 dark:text-white">
                                            {fish.species_name}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-400 dark:text-slate-500">{pick('Suhu Ideal', 'Ideal Temp')}</dt>
                                        <dd className="mt-0.5 font-semibold text-slate-900 dark:text-white tabular-nums">
                                            {fish.temp_min != null
                                                ? `${fish.temp_min}–${fish.temp_max} °C`
                                                : '—'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-400 dark:text-slate-500">{pick('Rentang pH', 'pH Range')}</dt>
                                        <dd className="mt-0.5 font-semibold text-slate-900 dark:text-white tabular-nums">
                                            {fish.ph_min != null ? `${fish.ph_min}–${fish.ph_max}` : '—'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-400 dark:text-slate-500">{pick('Volume Tank', 'Tank Volume')}</dt>
                                        <dd className="mt-0.5 font-semibold text-slate-900 dark:text-white tabular-nums">
                                            {fish.min_tank_liters ? `${fish.min_tank_liters} L` : '—'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-400 dark:text-slate-500">{pick('Pakan Utama', 'Primary Diet')}</dt>
                                        <dd className="mt-0.5 font-semibold text-slate-900 dark:text-white">
                                            {fish.diet_type || '—'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-400 dark:text-slate-500">{pick('Temperamen', 'Temperament')}</dt>
                                        <dd className="mt-0.5 font-semibold capitalize text-slate-900 dark:text-white">
                                            {fish.temperament || '—'}
                                        </dd>
                                    </div>
                                </dl>
                            </AccordionCard>
                        )}
                    </div>
                </div>

                {/* Store Rating & Reviews Section */}
                {store && <StoreRatingSection store={store} storeRating={storeRating} />}

                {/* Related Products Section */}
                {relatedProducts?.length > 0 && (
                    <section className="mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-slate-200/80 dark:border-neutral-800">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-slate-900 dark:text-white">
                                {pick('Produk Serupa', 'Similar Products')}
                            </h2>
                            <Link
                                href={`/products?category=${product.category?.slug || ''}`}
                                className="text-xs sm:text-sm font-semibold text-[#00477C] dark:text-sky-400 hover:underline"
                            >
                                {pick('Lihat semua', 'View all')}
                            </Link>
                        </div>

                        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
                            {relatedProducts.map((related, idx) => (
                                <ProductCard
                                    key={related.id}
                                    product={related}
                                    className="overlap-enter"
                                    style={{ '--overlap-i': idx }}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </AppLayout>
    );
}
