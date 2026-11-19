import { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import FavoriteButton from '@/Components/FavoriteButton';
import { useLanguage } from '@/lib/i18n';
import { Check, Compass, Heart, LogIn, ShoppingCart } from 'lucide-react';

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);
}

const fallbackFish =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450' fill='none'%3E%3Crect width='600' height='450' fill='%23eef6ff'/%3E%3Cpath d='M300 155 C380 155 435 205 435 235 C435 265 380 315 300 315 C245 315 190 265 145 280 L145 190 C190 205 245 155 300 155 Z' fill='%23001454' opacity='0.22'/%3E%3C/svg%3E";

function FavoritesSparkleHeartIcon() {
    return (
        <svg
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="w-11 h-11 sm:w-12 sm:h-12 shrink-0"
        >
            {/* Subtle radial burst sparkles */}
            <path d="M13 11L9 7" stroke="#9ecbf5" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M9 21L4 21" stroke="#9ecbf5" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M12 31L7 34" stroke="#9ecbf5" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M28 8L28 3" stroke="#9ecbf5" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M43 11L47 7" stroke="#9ecbf5" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M47 21L52 21" stroke="#9ecbf5" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M44 31L49 34" stroke="#9ecbf5" strokeWidth="2.2" strokeLinecap="round" />

            {/* Crisp outlined heart */}
            <path
                d="M28 44.5C28 44.5 14.5 34.8 14.5 24.4C14.5 19.8 18.1 16.2 22.5 16.2C25.2 16.2 27.1 17.6 28 19.3C28.9 17.6 30.8 16.2 33.5 16.2C37.9 16.2 41.5 19.8 41.5 24.4C41.5 34.8 28 44.5 28 44.5Z"
                className="stroke-[#0b1c48] dark:stroke-[#4AB8BD]"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function Index({ favorites = [] }) {
    const { auth } = usePage().props;
    const currentUser = auth?.user;
    const { pick } = useLanguage();
    const [items, setItems] = useState(favorites);
    const [addingId, setAddingId] = useState(null);
    const [addedId, setAddedId] = useState(null);

    useEffect(() => {
        setItems(favorites);
    }, [favorites]);

    useEffect(() => {
        const onToggled = (event) => {
            if (event?.detail?.productId && event.detail.favorited === false) {
                setItems((prev) => prev.filter((item) => item.product_id !== event.detail.productId));
            }
        };
        window.addEventListener('dunia-ikan:favorite-toggled', onToggled);
        return () => window.removeEventListener('dunia-ikan:favorite-toggled', onToggled);
    }, []);

    const handleAddToCart = (product) => {
        if (!product || product.stock <= 0 || addingId === product.id) {
            return;
        }
        setAddingId(product.id);
        router.post(
            '/cart',
            { product_id: product.id, quantity: 1 },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setAddedId(product.id);
                    window.setTimeout(() => {
                        setAddedId((prev) => (prev === product.id ? null : prev));
                    }, 1800);
                },
                onFinish: () => setAddingId(null),
            },
        );
    };

    return (
        <AppLayout>
            <Head title={pick('Produk Favorit — Dunia Ikan', 'Favorite Products — Dunia Ikan')} />

            <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#d9efff] via-[#eaf5ff] to-[#f4f9ff] dark:from-[#071326] dark:via-[#0a1428] dark:to-[#070b14]">
                {/* Sunlit underwater caustic glow */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none select-none absolute inset-x-0 top-0 h-80 overflow-hidden"
                >
                    <div className="absolute -top-24 -left-16 w-[420px] h-[340px] rounded-full bg-white/45 dark:bg-[#0684E5]/10 blur-3xl" />
                    <div className="absolute -top-20 right-1/4 w-[380px] h-[300px] rounded-full bg-[#b7e2ff]/40 dark:bg-[#4AB8BD]/10 blur-3xl" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 sm:pt-10 pb-14 sm:pb-16">
                    {/* Header matching reference */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-7 sm:mb-8">
                        <div className="flex items-center gap-3">
                            <FavoritesSparkleHeartIcon />
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0b1c48] dark:text-white leading-tight">
                                    {pick('Produk Favorit', 'Favorite Products')}
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                                    {pick(
                                        'Produk yang kamu sukai, dalam satu tempat ♡',
                                        'Products you love, saved in one place ♡',
                                    )}
                                </p>
                            </div>
                        </div>

                        {items.length > 0 && (
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-1.5 rounded-full bg-white/80 hover:bg-white dark:bg-white/10 dark:hover:bg-white/15 border border-sky-200/80 dark:border-white/15 px-4 py-2 text-xs font-semibold text-[#0b1c48] dark:text-slate-100 shadow-2xs transition"
                            >
                                <Compass className="w-3.5 h-3.5 text-[#0684E5] dark:text-[#4AB8BD]" />
                                <span>{pick('Cari Ikan Lainnya', 'Browse More Fish')}</span>
                            </Link>
                        )}
                    </div>

                    {items.length === 0 ? (
                        <div className="rounded-3xl bg-white/95 dark:bg-[#0f172a] border border-sky-100 dark:border-slate-800 shadow-[0_20px_50px_-24px_rgba(10,60,120,0.16)] p-8 sm:p-12 text-center max-w-xl mx-auto mt-4">
                            <span className="mx-auto w-14 h-14 rounded-2xl bg-[#eaf4ff] dark:bg-[#162544] text-[#0684E5] dark:text-[#4AB8BD] flex items-center justify-center mb-4">
                                <Heart className="w-7 h-7" />
                            </span>
                            <h2 className="text-base sm:text-lg font-extrabold text-[#0b1c48] dark:text-white">
                                {pick('Belum ada produk favorit', 'No favorite products yet')}
                            </h2>
                            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                {currentUser
                                    ? pick(
                                          'Tekan ikon hati pada ikan atau perlengkapan yang kamu suka di katalog untuk menyimpannya di sini.',
                                          'Tap the heart icon on any ornamental fish or gear in the catalog to save it here.',
                                      )
                                    : pick(
                                          'Masuk ke akun Dunia Ikan dan klik ikon hati pada ikan favoritmu supaya tersimpan di semua perangkat.',
                                          'Sign in to your Dunia Ikan account and tap the heart icon on fish you love to save them here.',
                                      )}
                            </p>

                            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                                <Link
                                    href="/products"
                                    className="btn-motion inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0b1c48] hover:bg-[#0684E5] dark:bg-[#4AB8BD] dark:text-[#001454] text-white text-xs font-bold shadow-xs transition"
                                >
                                    <Compass className="w-4 h-4" />
                                    <span>{pick('Jelajahi Katalog', 'Explore Catalog')}</span>
                                </Link>

                                {!currentUser && (
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-sky-200 dark:border-slate-700 bg-white dark:bg-[#131d33] hover:border-[#0684E5] text-xs font-semibold text-[#0b1c48] dark:text-slate-200 transition"
                                    >
                                        <LogIn className="w-3.5 h-3.5" />
                                        <span>{pick('Masuk', 'Sign In')}</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {items.map((item) => {
                                const { product } = item;
                                if (!product) {
                                    return null;
                                }
                                const isAdding = addingId === product.id;
                                const isAdded = addedId === product.id;
                                const outOfStock = product.stock <= 0;

                                return (
                                    <article
                                        key={item.id}
                                        className="card-hover group flex flex-col justify-between rounded-[24px] bg-white dark:bg-[#0f172a] border border-sky-100/90 dark:border-slate-800 p-3.5 shadow-[0_14px_34px_-16px_rgba(12,68,130,0.16)] hover:border-[#4AB8BD] transition"
                                    >
                                        <div>
                                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#162240]">
                                                <Link href={`/products/${product.slug}`} className="block w-full h-full">
                                                    <img
                                                        src={product.image || fallbackFish}
                                                        alt={product.name}
                                                        width={400}
                                                        height={300}
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = fallbackFish;
                                                        }}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </Link>

                                                <FavoriteButton
                                                    productId={product.id}
                                                    className="absolute top-2.5 right-2.5 z-10 h-8 w-8 rounded-full bg-white/95 dark:bg-[#0e1424]/90 shadow-sm hover:scale-110 transition flex items-center justify-center"
                                                />

                                                {outOfStock && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                                                        <span className="px-3 py-1 rounded-full bg-white dark:bg-[#111a30] text-rose-600 dark:text-rose-400 font-bold text-xs">
                                                            {pick('Habis', 'Sold Out')}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-3.5 px-0.5 space-y-1.5">
                                                <Link
                                                    href={`/products/${product.slug}`}
                                                    className="block text-[15px] font-extrabold text-[#0b1c48] dark:text-white hover:text-[#0684E5] dark:hover:text-[#4AB8BD] transition line-clamp-1"
                                                    title={product.name}
                                                >
                                                    {product.name}
                                                </Link>

                                                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[2.35rem]">
                                                    {product.description ||
                                                        product.store?.name ||
                                                        pick('Produk pilihan Dunia Ikan.', 'Curated Dunia Ikan item.')}
                                                </p>

                                                <p className="pt-1 text-[15px] font-extrabold text-[#0b1c48] dark:text-cyan-400 tabular-nums">
                                                    {formatPrice(product.price)}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleAddToCart(product)}
                                            disabled={outOfStock || isAdding}
                                            className={`btn-motion mt-3.5 w-full py-2.5 px-4 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                                                isAdded
                                                    ? 'micro-pop bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                                                    : 'bg-[#e8f2fe] hover:bg-[#0684E5] text-[#0b2e66] hover:text-white dark:bg-[#162544] dark:hover:bg-[#4AB8BD] dark:text-[#8BE8EC] dark:hover:text-[#001454]'
                                            }`}
                                        >
                                            {isAdded ? (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    <span>{pick('Masuk Keranjang', 'Added to Cart')}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart className="w-3.5 h-3.5" />
                                                    <span>
                                                        {outOfStock
                                                            ? pick('Stok Habis', 'Sold Out')
                                                            : isAdding
                                                              ? pick('Menambahkan...', 'Adding...')
                                                              : pick('Tambah Keranjang', 'Add to Cart')}
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
