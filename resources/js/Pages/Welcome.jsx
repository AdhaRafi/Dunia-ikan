import { useEffect, useId, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import FaqSection from '@/Components/FaqSection';
import ProductCard from '@/Components/ProductCard';
import StoreLogo from '@/Components/StoreLogo';
import {
    HeroWaveTransition,
    SectionWaveDivider,
} from '@/Components/AquaticMotifs';
import { useLanguage } from '@/lib/i18n';

const SPLIT_WAVE_MAIN_PATH =
    'M 229.5 32.3 Q 238.3 32.0 258.8 33.5 Q 279.2 34.9 299.7 41.8 Q 320.2 48.7 339.9 62.3 Q 359.6 75.8 374.6 92.9 Q 389.5 110.1 400.1 130.7 Q 410.8 151.2 415.9 171.8 Q 421.1 192.3 422.5 212.9 Q 424.0 233.5 422.7 254.0 Q 421.3 274.6 412.6 295.1 Q 403.8 315.7 385.4 334.6 Q 367.0 353.6 346.5 364.3 Q 326.0 375.0 305.6 376.2 Q 285.1 377.3 269.7 362.7 Q 254.4 348.0 252.9 327.4 Q 251.5 306.9 242.0 288.4 Q 232.5 269.9 212.0 268.2 Q 191.5 266.6 171.1 271.0 Q 150.6 275.4 130.1 280.0 Q 109.6 284.5 89.2 285.1 Q 68.7 285.7 55.1 269.9 Q 41.5 254.0 41.7 233.5 Q 41.8 212.9 45.8 192.3 Q 49.7 171.8 58.8 151.2 Q 67.8 130.7 83.2 110.6 Q 98.5 90.4 118.7 74.9 Q 138.9 59.3 159.4 50.1 Q 179.8 40.8 200.3 36.7 Q 220.8 32.6 229.5 32.3 Z';

const SPLIT_WAVE_CRESCENT_PATH =
    'M 203.2 316.2 Q 212.0 310.0 224.4 318.8 Q 236.8 327.7 239.7 344.3 Q 242.5 360.9 235.7 377.6 Q 228.9 394.2 213.0 406.1 Q 197.0 417.9 180.5 418.9 Q 163.9 419.8 147.4 419.6 Q 130.8 419.5 114.3 410.8 Q 97.7 402.1 87.4 386.0 Q 77.1 370.0 72.9 353.4 Q 68.8 336.8 72.7 326.0 Q 76.7 315.3 93.2 330.0 Q 109.8 344.7 126.3 349.6 Q 142.9 354.5 159.0 345.5 Q 175.2 336.4 184.8 329.4 Q 194.4 322.4 203.2 316.2 Z';

const SPLIT_WAVE_MAIN_NORM_PATH =
    'M 0.4914 0.0251 Q 0.5131 0.0244 0.5635 0.0280 Q 0.6138 0.0315 0.6643 0.0483 Q 0.7148 0.0651 0.7633 0.0983 Q 0.8118 0.1312 0.8488 0.1729 Q 0.8855 0.2149 0.9116 0.2651 Q 0.9379 0.3151 0.9505 0.3654 Q 0.9633 0.4154 0.9667 0.4656 Q 0.9704 0.5159 0.9672 0.5659 Q 0.9638 0.6161 0.9424 0.6661 Q 0.9207 0.7163 0.8754 0.7624 Q 0.8300 0.8088 0.7796 0.8349 Q 0.7291 0.8610 0.6788 0.8639 Q 0.6283 0.8666 0.5904 0.8310 Q 0.5527 0.7951 0.5490 0.7449 Q 0.5456 0.6949 0.5222 0.6498 Q 0.4988 0.6046 0.4483 0.6005 Q 0.3978 0.5966 0.3475 0.6073 Q 0.2970 0.6180 0.2466 0.6293 Q 0.1961 0.6402 0.1458 0.6417 Q 0.0953 0.6432 0.0618 0.6046 Q 0.0283 0.5659 0.0288 0.5159 Q 0.0291 0.4656 0.0389 0.4154 Q 0.0485 0.3654 0.0709 0.3151 Q 0.0931 0.2651 0.1310 0.2161 Q 0.1687 0.1668 0.2185 0.1290 Q 0.2682 0.0910 0.3187 0.0685 Q 0.3690 0.0459 0.4195 0.0359 Q 0.4700 0.0259 0.4914 0.0251 Z';

const SPLIT_WAVE_CRESCENT_NORM_PATH =
    'M 0.4266 0.7176 Q 0.4483 0.7024 0.4788 0.7239 Q 0.5094 0.7456 0.5165 0.7861 Q 0.5234 0.8266 0.5067 0.8673 Q 0.4899 0.9078 0.4507 0.9368 Q 0.4113 0.9656 0.3707 0.9680 Q 0.3298 0.9702 0.2892 0.9698 Q 0.2483 0.9695 0.2076 0.9483 Q 0.1667 0.9271 0.1414 0.8878 Q 0.1160 0.8488 0.1057 0.8083 Q 0.0956 0.7678 0.1052 0.7415 Q 0.1150 0.7154 0.1557 0.7512 Q 0.1966 0.7871 0.2372 0.7990 Q 0.2781 0.8110 0.3177 0.7890 Q 0.3576 0.7668 0.3813 0.7498 Q 0.4049 0.7327 0.4266 0.7176 Z';

export default function Welcome({ categories, featuredFish, featuredStores, stats }) {
    const { auth } = usePage().props;
    const { pick, isEn } = useLanguage();
    const showcaseMaskId = useId().replace(/:/g, '');
    const firstName = auth?.user?.name?.trim().split(/\s+/)[0] || '';
    const [selectedTab, setSelectedTab] = useState('all');
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [showHeroVideo, setShowHeroVideo] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isNarrowScreen = window.matchMedia('(max-width: 767px)').matches;
        const saveData = Boolean(navigator.connection?.saveData);
        if (prefersReducedMotion || isNarrowScreen || saveData) {
            return;
        }

        const timer = window.setTimeout(() => setShowHeroVideo(true), 400);
        return () => window.clearTimeout(timer);
    }, []);

    // Filter items based on quick chips
    const displayedProducts = (
        featuredFish?.filter((item) => {
            if (selectedTab === 'all') return true;
            if (selectedTab === 'freshwater') return item.fish_detail?.water_type === 'freshwater';
            if (selectedTab === 'saltwater') return item.fish_detail?.water_type === 'saltwater';
            if (selectedTab === 'brackish') return item.fish_detail?.water_type === 'brackish';
            if (selectedTab === 'male') return item.fish_detail?.sex === 'male';
            if (selectedTab === 'female') return item.fish_detail?.sex === 'female';
            return true;
        }) || []
    ).slice(0, 10);

    // MorphMarket-style clean shop categories grid (fish species, aquarium tools, care & aquatic plants)
    const shopCategories = [
        {
            title: pick('Cupang', 'Betta Fish'),
            image: '/images/categories/cupang.webp',
            link: '/products?category=ikan-hias&q=cupang',
        },
        {
            title: 'Channa',
            image: '/images/categories/channa.webp',
            link: '/products?category=ikan-hias&q=channa',
        },
        {
            title: 'Arwana',
            image: '/images/categories/arwana.webp',
            link: '/products?category=ikan-hias&q=arwana',
        },
        {
            title: 'Koi',
            image: '/images/categories/koi.webp',
            link: '/products?category=ikan-hias&q=koi',
        },
        {
            title: pick('Mas Koki', 'Goldfish'),
            image: '/images/categories/mas-koki.webp',
            link: '/products?category=ikan-hias&q=koki',
        },
        {
            title: 'Louhan',
            image: '/images/categories/louhan.webp',
            link: '/products?category=ikan-hias&q=louhan',
        },
        {
            title: 'Discus',
            image: '/images/categories/discus.webp',
            link: '/products?category=ikan-hias&q=discus',
        },
        {
            title: 'Guppy',
            image: '/images/categories/guppy.webp',
            link: '/products?category=ikan-hias&q=guppy',
        },
        {
            title: 'Neon Tetra',
            image: '/images/categories/neon-tetra.webp',
            link: '/products?water_type=freshwater&q=tetra',
        },
        {
            title: pick('Ikan Badut', 'Clownfish'),
            image: '/images/categories/clownfish.webp',
            link: '/products?water_type=saltwater&q=badut',
        },
        {
            title: 'Blue Tang',
            image: '/images/categories/blue-tang.webp',
            link: '/products?water_type=saltwater&q=tang',
        },
        {
            title: pick('Filter Aquarium', 'Aquarium Filter'),
            image: '/images/categories/filter-aquarium.webp',
            link: '/products?category=perlengkapan-aquarium&q=filter',
        },
        {
            title: pick('Tank Aquarium', 'Aquarium Tank'),
            image: '/images/categories/tank-aquarium.webp',
            link: '/products?category=perlengkapan-aquarium&q=aquarium',
        },
        {
            title: pick('Pakan & Pelet', 'Food & Pellets'),
            image: '/images/categories/pakan-ikan.webp',
            link: '/products?category=pakan-ikan',
        },
        {
            title: pick('Perawatan Air', 'Water Care'),
            image: '/images/categories/perawatan-air.webp',
            link: '/products?category=perawatan-ikan',
        },
        {
            title: 'Anubias',
            image: '/images/categories/anubias.webp',
            link: '/products?category=aquascape&q=anubias',
        },
        {
            title: 'Bucephalandra',
            image: '/images/categories/bucephalandra.webp',
            link: '/products?category=aquascape&q=bucephalandra',
        },
        {
            title: pick('Tanaman Hias', 'Aquatic Plants'),
            image: '/images/categories/tanaman-hias.webp',
            link: '/products?category=aquascape',
        },
    ];

    const INITIAL_CATEGORY_COUNT = 12;
    const visibleCategories = showAllCategories
        ? shopCategories
        : shopCategories.slice(0, INITIAL_CATEGORY_COUNT);

    return (
        <AppLayout>
            <Head
                title={pick(
                    'Dunia Ikan : Marketplace Ikan Hias & Mutasi Genetik (Morph) Captive-Bred',
                    'Dunia Ikan: Captive-Bred Ornamental Fish & Genetic Morph Marketplace',
                )}
            >
                <meta
                    head-key="description"
                    name="description"
                    content={pick(
                        'Belanja ikan hias captive-bred, morph langka, tanaman aquascape, dan perlengkapan akuarium terkurasi dengan garansi ikan hidup 100%.',
                        'Shop captive-bred ornamental fish, rare morphs, aquatic plants, and aquarium supplies with a 100% live arrival guarantee.',
                    )}
                />
            </Head>

            {/* 1. CINEMATIC BLUE-OCEAN HERO (Live Sea-Teal Nemo Reef Loop) */}
            <section
                data-nav-theme="dark"
                className="-mt-16 pt-16 relative w-full overflow-hidden bg-[#052333] min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex items-center"
            >
                {/* Full-Bleed Blue Ocean Clownfish Poster (Instant LCP) + Seamless Looping Video */}
                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden transform-gpu">
                    <picture className="block w-full h-full">
                        <source media="(max-width: 767px)" srcSet="/images/hero/aquarium-poster-mobile.webp?v=3" />
                        <img
                            src="/images/hero/aquarium-poster.webp?v=3"
                            width={1280}
                            height={720}
                            fetchpriority="high"
                            decoding="sync"
                            loading="eager"
                            alt={pick('Ikan badut Nemo di terumbu karang laut biru Dunia Ikan', 'Dunia Ikan blue ocean clownfish reef')}
                            className="w-full h-full object-cover object-center select-none"
                        />
                    </picture>
                    {showHeroVideo && (
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            className="absolute inset-0 w-full h-full object-cover object-center select-none"
                        >
                            <source src="/videos/aquarium-hero.mp4?v=2" type="video/mp4" />
                        </video>
                    )}
                </div>

                {/* BBC Earth Deep Sea-Teal Atmospheric Veils (#08284E -> #135C65 -> #13BFC1 glow) */}
                <div className="absolute inset-0 bg-[#052333]/20 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_48%_54%_at_48%_48%,rgba(19,191,193,0.16),transparent_70%)] pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-full lg:w-[66%] bg-gradient-to-r from-[#041D2E]/85 via-[#083446]/45 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#041C2E]/65 via-[#041C2E]/20 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#031A29]/75 via-[#06293B]/20 to-transparent pointer-events-none" />

                {/* Clean Minimal Hero Overlay */}
                <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 pb-24 sm:pt-14 sm:pb-28">
                    <div className="max-w-2xl text-white space-y-4">
                        <h1 className="font-['Montserrat',sans-serif] text-4xl sm:text-5xl lg:text-[60px] font-extrabold uppercase tracking-[0.02em] leading-[1.04] text-white drop-shadow-[0_4px_24px_rgba(2,24,36,0.5)]">
                            {auth?.user
                                ? firstName
                                    ? pick(`Halo, ${firstName}`, `Hello, ${firstName}`)
                                    : 'DUNIA IKAN'
                                : 'JOIN DUNIA IKAN'}
                        </h1>
                        <p className="text-xs sm:text-[15px] text-[#E3F5F7]/90 leading-relaxed max-w-[470px]">
                            {pick(
                                'Akses langsung ke peternak bersertifikasi di seluruh Indonesia. Temukan ikan hias air tawar, terumbu laut, dan garansi ikan hidup 100% sampai tujuan.',
                                'Direct access to certified breeders across Indonesia. Discover vibrant freshwater morphs, marine reef fish, and a 100% live arrival guarantee to your door.',
                            )}
                        </p>
                        {!auth?.user && (
                            <div className="pt-2">
                                <Link
                                    href="/login"
                                    className="btn-motion btn-sheen inline-flex items-center justify-center rounded-full bg-white px-7 py-2.5 text-xs sm:text-sm font-bold text-[#052534] hover:bg-[#E3F5F7] dark:bg-[#60C2E6] dark:text-[#052534] dark:hover:bg-[#82D2EE] shadow-md"
                                >
                                    {pick('Masuk', 'Sign In')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Shoreline tide curve transitioning smoothly from aquarium hero into content canvas */}
                <HeroWaveTransition variant="canvas" />
            </section>

            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
                {/* 2. KATEGORI TOKO (Clean MorphMarket Studio Cutout Cards) */}
                <section className="space-y-5">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#14335D] dark:text-white">
                            {pick('Kategori Toko', 'Shop by Category')}
                        </h2>
                        <Link
                            href="/products"
                            className="text-xs font-semibold text-neutral-600 hover:text-[#14335D] dark:text-neutral-300 dark:hover:text-white transition"
                        >
                            {pick('Jelajahi Katalog', 'Browse Catalog')}
                        </Link>
                    </div>

                    {/* Clean White-Backdrop Category Tiles (12 initial -> expandable to full catalog categories) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
                        {visibleCategories.map((group, idx) => (
                            <Link
                                key={group.title}
                                href={group.link}
                                style={{
                                    '--overlap-i':
                                        idx >= INITIAL_CATEGORY_COUNT
                                            ? idx - INITIAL_CATEGORY_COUNT
                                            : idx,
                                }}
                                className="overlap-enter card-hover group bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-neutral-800 hover:border-[#60C2E6] shadow-[0_2px_8px_rgba(15,23,42,0.03)] flex flex-col items-center overflow-hidden p-3"
                            >
                                <div className="w-full aspect-square bg-white rounded-xl overflow-hidden flex items-center justify-center p-1">
                                    <img
                                        src={group.image}
                                        alt={group.title}
                                        width={264}
                                        height={264}
                                        loading={idx < 2 ? 'eager' : 'lazy'}
                                        fetchpriority={idx < 2 ? 'auto' : 'low'}
                                        decoding="async"
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="mt-2.5 text-center font-bold text-xs sm:text-[13px] text-[#14335D] dark:text-white group-hover:text-[#005A9D] dark:group-hover:text-[#60C2E6] transition truncate w-full">
                                    {group.title}
                                </h3>
                            </Link>
                        ))}
                    </div>

                    {shopCategories.length > INITIAL_CATEGORY_COUNT && (
                        <div className="flex justify-center pt-1">
                            <button
                                type="button"
                                onClick={() => setShowAllCategories((prev) => !prev)}
                                aria-expanded={showAllCategories}
                                className="btn-motion inline-flex items-center justify-center rounded-full border border-slate-300 dark:border-neutral-700 bg-slate-50/90 dark:bg-[#0f172a] hover:bg-white dark:hover:bg-slate-800/90 hover:border-slate-400 dark:hover:border-[#60C2E6] px-6 py-2 text-xs sm:text-[13px] font-semibold text-slate-900 dark:text-slate-100 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition"
                            >
                                {showAllCategories
                                    ? pick('Tampilkan Lebih Sedikit', 'Show Fewer Categories')
                                    : pick(
                                          `Lihat Semua ${shopCategories.length} Kategori`,
                                          `View All ${shopCategories.length} Categories`,
                                      )}
                            </button>
                        </div>
                    )}
                </section>

                <SectionWaveDivider />

                {/* 4. PRODUCT GRID */}
                <section className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#14335D] dark:text-white">
                            {pick('Produk Terbaru', 'Latest Arrivals')}
                        </h2>

                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
                            {[
                                { id: 'all', label: pick('Semua', 'All') },
                                { id: 'freshwater', label: pick('Air Tawar', 'Freshwater') },
                                { id: 'saltwater', label: pick('Air Laut', 'Saltwater') },
                                { id: 'brackish', label: pick('Air Payau', 'Brackish') },
                                { id: 'male', label: pick('Jantan', 'Male') },
                                { id: 'female', label: pick('Betina', 'Female') },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setSelectedTab(tab.id)}
                                    className={`btn-motion px-3 py-1.5 rounded-lg whitespace-nowrap ${
                                        selectedTab === tab.id
                                            ? 'bg-[#14335D] dark:bg-[#60C2E6] text-white dark:text-[#14335D] font-bold shadow-xs'
                                            : 'bg-white dark:bg-[#111a30] text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700 hover:border-[#60C2E6]'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
                        {displayedProducts.map((product, idx) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                className="overlap-enter"
                                style={{ '--overlap-i': idx }}
                            />
                        ))}
                    </div>
                </section>

                <SectionWaveDivider />

                {/* 5. TOKO & PENANGKAR (Clean 2-Col Editorial Directory + Matte CTA) */}
                {featuredStores && featuredStores.length > 0 && (
                    <section className="space-y-6 pt-1">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#14335D] dark:text-white">
                                {pick('Toko Pilihan', 'Featured Stores')}
                            </h2>
                            <Link
                                href="/products"
                                className="text-xs font-semibold text-neutral-600 hover:text-[#14335D] dark:text-neutral-300 dark:hover:text-white transition"
                            >
                                {pick('Lihat Semua', 'View All')}
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
                            {featuredStores.slice(0, 6).map((store, idx) => (
                                <Link
                                    key={store.id}
                                    href={`/stores/${store.slug}`}
                                    style={{ '--overlap-i': idx }}
                                    className="overlap-enter card-hover group bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-neutral-800 hover:border-[#60C2E6] shadow-[0_2px_8px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden"
                                >
                                    <div className="w-full aspect-square bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center border-b border-slate-100 dark:border-neutral-800/80">
                                        <StoreLogo
                                            store={store}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            fallbackClassName="w-full h-full bg-slate-50 dark:bg-[#162240] flex items-center justify-center font-extrabold text-3xl text-[#14335D] dark:text-white group-hover:text-[#005A9D] dark:group-hover:text-[#60C2E6] transition"
                                        />
                                    </div>
                                    <div className="px-3 py-2.5">
                                        <h3 className="text-xs font-bold text-[#14335D] dark:text-white group-hover:text-[#005A9D] dark:group-hover:text-[#60C2E6] truncate transition">
                                            {store.name}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Editorial Sky-Blue Ornamental Fish Showcase & Breeder CTA Banner */}
                        <div className="group relative overflow-hidden rounded-[28px] bg-gradient-to-b from-[#CBEBFF] via-[#E5F6FF] to-[#F6FBFF] dark:from-[#0C1D3B] dark:via-[#11294E] dark:to-[#173663] border border-[#B5E0FA]/90 dark:border-[#1E3D6B] shadow-[0_18px_46px_-24px_rgba(0,90,157,0.22)] dark:shadow-[0_22px_52px_-20px_rgba(2,8,24,0.65)]">
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-white/55 dark:bg-[#60C2E6]/10 blur-3xl"
                            />

                            <div className="relative z-10 mx-auto flex max-w-5xl flex-col lg:flex-row items-center justify-center gap-7 lg:gap-12 xl:gap-16 px-7 sm:px-10 lg:px-12 py-9 sm:py-11 lg:py-8">
                                {/* Left Copy & Twin Compact Action Buttons */}
                                <div className="w-full lg:flex-1 lg:max-w-[470px] space-y-4">
                                    <h3 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold tracking-[-0.03em] leading-[1.12] text-[#14335D] dark:text-white">
                                        {pick('Kenalkan Ikan Hias', 'Showcase Your Finest')}
                                        <br />
                                        {pick('Terbaik dari Farm Anda', 'Ornamental Fish')}
                                    </h3>

                                    <p className="text-xs sm:text-sm leading-relaxed text-[#35537A] dark:text-slate-300 max-w-md">
                                        {pick(
                                            'Dari cupang halfmoon, arwana, koi, hingga tanaman aquascape, perkenalkan koleksi ikan hias unggulan dari farm atau toko Anda langsung ke penghobi di seluruh Indonesia.',
                                            'From halfmoon bettas, arowana, and koi to lush aquascape plants, introduce your farm or shop collection directly to hobbyists across Indonesia.',
                                        )}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-2.5 pt-2">
                                        <Link
                                            href="/seller/register"
                                            className="btn-motion btn-sheen inline-flex items-center justify-center rounded-xl bg-[#14335D] hover:bg-[#005A9D] dark:bg-[#60C2E6] dark:hover:bg-[#82D2EE] px-5 py-2.5 text-xs sm:text-[13px] font-bold text-white dark:text-[#0B182E] shadow-xs whitespace-nowrap"
                                        >
                                            {pick('Buka Toko', 'Open Store')}
                                        </Link>
                                        <Link
                                            href="/products?category=ikan-hias"
                                            className="btn-motion inline-flex items-center justify-center rounded-xl bg-white/90 hover:bg-white dark:bg-[#173058] dark:hover:bg-[#1F3F73] border border-[#14335D]/15 dark:border-[#60C2E6]/30 px-5 py-2.5 text-xs sm:text-[13px] font-semibold text-[#14335D] dark:text-white shadow-2xs whitespace-nowrap"
                                        >
                                            {pick('Kenali Ikan Hias', 'Explore Fish')}
                                        </Link>
                                    </div>
                                </div>

                                {/* Right Organic Split-Wave Underwater Ornamental Fish Porthole (HTML img + CSS clip-path for true lazy-loading) */}
                                <div className="relative flex shrink-0 items-center justify-center w-full max-w-[300px] sm:max-w-[340px] lg:w-[375px] xl:w-[395px] lg:max-w-none">
                                    <div className="relative w-full aspect-[406/410] select-none drop-shadow-[0_18px_28px_rgba(14,44,88,0.18)] dark:drop-shadow-[0_22px_36px_rgba(0,0,0,0.52)]">
                                        <svg
                                            viewBox="30 22 406 410"
                                            aria-hidden="true"
                                            className="absolute inset-0 w-full h-full overflow-visible"
                                        >
                                            <defs>
                                                <clipPath
                                                    id={`porthole-clip-${showcaseMaskId}`}
                                                    clipPathUnits="objectBoundingBox"
                                                >
                                                    <path d={SPLIT_WAVE_MAIN_NORM_PATH} />
                                                    <path d={SPLIT_WAVE_CRESCENT_NORM_PATH} />
                                                </clipPath>
                                                <linearGradient
                                                    id={`porthole-rim-${showcaseMaskId}`}
                                                    x1="0%"
                                                    y1="62%"
                                                    x2="100%"
                                                    y2="100%"
                                                >
                                                    <stop offset="0%" stopColor="#084C6E" />
                                                    <stop offset="48%" stopColor="#0EA5C6" />
                                                    <stop offset="100%" stopColor="#4CE3F7" />
                                                </linearGradient>
                                            </defs>

                                            {/* Luminous turquoise bevel edge beneath the split-wave porthole */}
                                            <path
                                                d={SPLIT_WAVE_MAIN_PATH}
                                                transform="translate(2.5 5.5)"
                                                fill={`url(#porthole-rim-${showcaseMaskId})`}
                                            />
                                            <path
                                                d={SPLIT_WAVE_CRESCENT_PATH}
                                                transform="translate(1.5 3.5)"
                                                fill={`url(#porthole-rim-${showcaseMaskId})`}
                                                opacity="0.72"
                                            />
                                        </svg>

                                        <div
                                            className="absolute inset-0 overflow-hidden"
                                            style={{
                                                clipPath: `url(#porthole-clip-${showcaseMaskId})`,
                                            }}
                                        >
                                            <img
                                                src="/images/banners/fish-porthole-showcase.webp?v=2"
                                                alt={pick(
                                                    'Koleksi ikan hias unggulan Dunia Ikan: discus, ikan kepe-kepe, cupang halfmoon, ikan badut, dan terumbu karang',
                                                    'Dunia Ikan ornamental fish showcase featuring discus, butterflyfish, halfmoon betta, clownfish, and coral reef',
                                                )}
                                                width={600}
                                                height={600}
                                                loading="lazy"
                                                fetchpriority="low"
                                                decoding="async"
                                                className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                                            />
                                        </div>

                                        <svg
                                            viewBox="30 22 406 410"
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-0 w-full h-full overflow-visible"
                                        >
                                            <path
                                                d={SPLIT_WAVE_MAIN_PATH}
                                                fill="none"
                                                strokeWidth="1.5"
                                                className="stroke-white/30 dark:stroke-[#60C2E6]/45"
                                            />
                                            <path
                                                d={SPLIT_WAVE_CRESCENT_PATH}
                                                fill="none"
                                                strokeWidth="1.5"
                                                className="stroke-white/30 dark:stroke-[#60C2E6]/45"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <SectionWaveDivider />

                {/* 6. FREQUENTLY ASKED QUESTIONS */}
                <FaqSection />
            </div>
        </AppLayout>
    );
}
