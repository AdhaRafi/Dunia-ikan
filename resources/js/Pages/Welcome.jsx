import { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Minus, Plus } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import ProductCard from '@/Components/ProductCard';
import StoreLogo from '@/Components/StoreLogo';
import {
    HeroWaveTransition,
    SectionWaveDivider,
} from '@/Components/AquaticMotifs';
import { useLanguage } from '@/lib/i18n';

const FAQ_ITEMS = [
    {
        id: {
            question: 'Apakah garansi ikan hidup 100% berlaku di seluruh Indonesia?',
            answer: 'Ya, setiap pengiriman ikan hias dari penangkar terverifikasi dilindungi garansi DOA (Dead on Arrival) dengan syarat melampirkan video unboxing tanpa jeda saat paket diterima.',
        },
        en: {
            question: 'Does the 100% live arrival guarantee apply across Indonesia?',
            answer: 'Yes, every ornamental fish shipment from verified breeders is covered by our DOA (Dead on Arrival) guarantee as long as you provide a continuous unboxing video upon delivery.',
        },
    },
    {
        id: {
            question: 'Bagaimana standar packing agar ikan tetap aman selama pengiriman?',
            answer: 'Penangkar memakai kantong oksigen ganda bertekanan, air kondisi stabil, serta boks styrofoam atau insulasi thermal sesuai jarak pengiriman.',
        },
        en: {
            question: 'What packing standards keep fish safe during shipping?',
            answer: 'Breeders use double pressurized oxygen bags, conditioned water, and insulated styrofoam or thermal boxes matched to shipping distance.',
        },
    },
    {
        id: {
            question: 'Bagaimana cara memilih ikan air tawar atau air laut di katalog?',
            answer: 'Anda bisa langsung klik menu Air Tawar atau Air Laut di menu header, atau gunakan filter Tipe Air di halaman Katalog lengkap beserta informasi pH dan suhu ideal.',
        },
        en: {
            question: 'How do I browse freshwater or saltwater fish in the catalog?',
            answer: 'Select Freshwater or Saltwater directly from the header menu, or use the Water Type filter on the full Catalog page with ideal pH and temperature notes.',
        },
    },
    {
        id: {
            question: 'Kapan dana pembayaran diteruskan ke toko penangkar?',
            answer: 'Pembayaran ditahan sementara oleh sistem dan baru diteruskan setelah pesanan dikonfirmasi diterima dalam kondisi baik atau melewati batas waktu konfirmasi.',
        },
        en: {
            question: 'When is payment released to the breeder store?',
            answer: 'Payment is held securely in escrow and only released after you confirm the order arrived healthy or once the confirmation window closes.',
        },
    },
    {
        id: {
            question: 'Apakah penangkar atau toko aquascape bisa berjualan di sini?',
            answer: 'Bisa. Anda cukup mendaftar akun lalu melengkapi profil toko di menu Buka Toko untuk mulai menayangkan stok ikan hias, tanaman, dan perlengkapan akuarium.',
        },
        en: {
            question: 'Can breeders or aquascape stores sell on Dunia Ikan?',
            answer: 'Yes. Register an account, apply as a seller or complete your store profile, and list your fish stock, aquatic plants, and tank gear after verification.',
        },
    },
];

export default function Welcome({ categories, featuredFish, featuredStores, stats }) {
    const { auth } = usePage().props;
    const { pick, isEn } = useLanguage();
    const firstName = auth?.user?.name?.trim().split(/\s+/)[0] || '';
    const [selectedTab, setSelectedTab] = useState('all');
    const [openFaq, setOpenFaq] = useState(0);
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

        const timer = window.setTimeout(() => setShowHeroVideo(true), 2200);
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
    ).slice(0, 8);

    // MorphMarket-style clean shop categories grid (fish species, aquarium tools, care & aquatic plants)
    const shopCategories = [
        {
            title: pick('Cupang', 'Betta Fish'),
            image: '/images/categories/cupang.jpg',
            link: '/products?category=ikan-hias&q=cupang',
        },
        {
            title: 'Channa',
            image: '/images/categories/channa.jpg',
            link: '/products?category=ikan-hias&q=channa',
        },
        {
            title: 'Arwana',
            image: '/images/categories/arwana.jpg',
            link: '/products?category=ikan-hias&q=arwana',
        },
        {
            title: 'Koi',
            image: '/images/categories/koi.jpg',
            link: '/products?category=ikan-hias&q=koi',
        },
        {
            title: pick('Mas Koki', 'Goldfish'),
            image: '/images/categories/mas-koki.jpg',
            link: '/products?category=ikan-hias&q=koki',
        },
        {
            title: 'Louhan',
            image: '/images/categories/louhan.jpg',
            link: '/products?category=ikan-hias&q=louhan',
        },
        {
            title: 'Discus',
            image: '/images/categories/discus.jpg',
            link: '/products?category=ikan-hias&q=discus',
        },
        {
            title: 'Guppy',
            image: '/images/categories/guppy.jpg',
            link: '/products?category=ikan-hias&q=guppy',
        },
        {
            title: 'Neon Tetra',
            image: '/images/categories/neon-tetra.jpg',
            link: '/products?water_type=freshwater&q=tetra',
        },
        {
            title: pick('Ikan Badut', 'Clownfish'),
            image: '/images/categories/clownfish.jpg',
            link: '/products?water_type=saltwater&q=badut',
        },
        {
            title: 'Blue Tang',
            image: '/images/categories/blue-tang.jpg',
            link: '/products?water_type=saltwater&q=tang',
        },
        {
            title: pick('Filter Aquarium', 'Aquarium Filter'),
            image: '/images/categories/filter-aquarium.jpg',
            link: '/products?category=perlengkapan-aquarium&q=filter',
        },
        {
            title: pick('Tank Aquarium', 'Aquarium Tank'),
            image: '/images/categories/tank-aquarium.jpg',
            link: '/products?category=perlengkapan-aquarium&q=aquarium',
        },
        {
            title: pick('Pakan & Pelet', 'Food & Pellets'),
            image: '/images/categories/pakan-ikan.jpg',
            link: '/products?category=pakan-ikan',
        },
        {
            title: pick('Perawatan Air', 'Water Care'),
            image: '/images/categories/perawatan-air.jpg',
            link: '/products?category=perawatan-ikan',
        },
        {
            title: 'Anubias',
            image: '/images/categories/anubias.jpg',
            link: '/products?category=aquascape&q=anubias',
        },
        {
            title: 'Bucephalandra',
            image: '/images/categories/bucephalandra.jpg',
            link: '/products?category=aquascape&q=bucephalandra',
        },
        {
            title: pick('Tanaman Hias', 'Aquatic Plants'),
            image: '/images/categories/tanaman-hias.jpg',
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

            {/* 1. HERO SECTION: Full-Bleed Edge-to-Edge Banner (Living Aquarium Habitat) */}
            <section
                data-nav-theme="dark"
                className="-mt-16 pt-16 relative w-full overflow-hidden bg-black min-h-[500px] sm:min-h-[540px] lg:min-h-[580px] flex items-center"
            >
                {/* Full-Bleed Background Poster (Instant LCP) + Idle-Deferred Aquarium Video */}
                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden transform-gpu">
                    <picture className="block w-full h-full">
                        <source media="(max-width: 767px)" srcSet="/images/hero/aquarium-poster-mobile.webp" />
                        <img
                            src="/images/hero/aquarium-poster.webp"
                            width={1280}
                            height={720}
                            fetchPriority="high"
                            decoding="sync"
                            loading="eager"
                            alt={pick('Akuarium Ikan Hias Dunia Ikan', 'Dunia Ikan Ornamental Aquarium')}
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
                            <source src="/videos/aquarium-hero.mp4" type="video/mp4" />
                        </video>
                    )}
                </div>

                {/* Cinematic Ambient Dark Scrim & Text Readability Gradients */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent sm:w-3/4 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent sm:hidden pointer-events-none" />

                {/* Hero Content Overlay: Center-aligned within standard content width */}
                <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
                    <div className="max-w-2xl text-white space-y-6">
                        <div className="space-y-3">
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-white">
                                {auth?.user
                                    ? firstName
                                        ? pick(`Halo, ${firstName}!`, `Welcome back, ${firstName}!`)
                                        : 'Dunia Ikan Aquatic'
                                    : 'Join Dunia Ikan'}
                            </h1>
                            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                                {pick(
                                    'Akses langsung ke peternak bersertifikasi di seluruh Indonesia. Temukan mutasi morph langka, lelang galur murni, dan garansi ikan hidup 100% sampai tujuan!',
                                    'Direct access to verified breeders across Indonesia. Discover rare genetic morphs, purebred strains, and a 100% live arrival guarantee to your door!',
                                )}
                            </p>
                        </div>

                        {/* MorphMarket Two Action Buttons */}
                        <div className="flex items-center gap-3 pt-2">
                            <Link 
                                href="/products" 
                                className="btn-motion btn-sheen px-7 py-3 rounded-full bg-white text-black dark:bg-[#60C2E6] dark:text-[#14335D] font-bold text-xs sm:text-sm hover:bg-neutral-100 dark:hover:bg-[#38a2a7] shadow-sm hover:shadow-lg"
                            >
                                {pick('Jelajahi Katalog', 'Explore Catalog')}
                            </Link>
                            {!auth?.user && (
                                <Link 
                                    href="/register" 
                                    className="btn-motion px-7 py-3 rounded-full border border-neutral-600 dark:border-neutral-700 text-white font-semibold text-xs sm:text-sm hover:bg-white/10 hover:border-neutral-400"
                                >
                                    {pick('Buat Akun', 'Create Account')}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Shoreline tide curve transitioning smoothly from aquarium hero into content canvas */}
                <HeroWaveTransition variant="canvas" />
            </section>

            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
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
                                        width={300}
                                        height={300}
                                        loading={idx < 2 ? 'eager' : 'lazy'}
                                        fetchPriority={idx < 2 ? 'auto' : 'low'}
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

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
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

                        <div className="relative overflow-hidden rounded-3xl aquatic-cta-surface border border-[#1E80A0]/35 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-[0_14px_38px_-14px_rgba(0,20,84,0.35)]">
                            <div className="relative z-10 space-y-1">
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                                    {pick('Punya Farm atau Toko Aquascape?', 'Own a Farm or Aquascape Store?')}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                                    {pick(
                                        'Pasarkan ikan hias, alat akuarium, dan tanaman aquascape Anda langsung ke penghobi di seluruh Indonesia.',
                                        'Reach ornamental fish hobbyists across Indonesia with verified listings for fish, tank gear, and aquascape plants.',
                                    )}
                                </p>
                            </div>
                            <Link
                                href="/seller/register"
                                className="relative z-10 btn-motion btn-sheen px-6 py-2.5 rounded-full bg-white text-[#0f172a] font-bold text-xs hover:bg-slate-100 whitespace-nowrap self-start sm:self-auto shadow-sm"
                            >
                                {pick('Buka Toko', 'Open Store')}
                            </Link>
                        </div>
                    </section>
                )}

                <SectionWaveDivider />

                {/* 6. FREQUENTLY ASKED QUESTIONS */}
                <section className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] aquatic-soft-panel border border-[#005A9D]/15 dark:border-[#60C2E6]/20 px-5 sm:px-10 lg:px-14 py-10 sm:py-14 lg:py-16">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-stretch">
                        {/* Left Column: Heading at top, Helper Subtext + Pill CTA at bottom */}
                        <div className="lg:col-span-5 flex flex-col justify-between gap-7">
                            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold tracking-[-0.03em] leading-[1.12] text-slate-900 dark:text-white">
                                {pick('Pertanyaan Umum', 'Common Questions')}
                                <br />
                                {pick('dari para pembeli.', 'from our buyers.')}
                            </h2>

                            <div>
                                <p className="max-w-[34ch] text-xs sm:text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">
                                    {pick(
                                        'Tim dan asisten Kiko kami selalu siap membantu dengan jawaban cepat, jelas, dan tepercaya kapan pun Anda butuh.',
                                        'Our team and Kiko assistant are always ready with fast, clear, and trusted answers whenever you need help.',
                                    )}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => window.dispatchEvent(new CustomEvent('dunia-ikan:open-chat'))}
                                    className="btn-motion btn-sheen mt-4 inline-flex items-center justify-center rounded-full bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 px-5 py-2.5 text-xs sm:text-[13px] font-semibold shadow-[0_6px_18px_rgba(15,23,42,0.18)]"
                                >
                                    {pick('Tanya Kiko', 'Ask Kiko')}
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Clean White Card Accordion Stack */}
                        <div className="lg:col-span-7 space-y-3">
                            {FAQ_ITEMS.map((item, index) => {
                                const isExpanded = openFaq === index;
                                const copy = isEn ? item.en : item.id;

                                return (
                                    <button
                                        key={copy.question}
                                        type="button"
                                        onClick={() => setOpenFaq(isExpanded ? null : index)}
                                        aria-expanded={isExpanded}
                                        className="card-hover-subtle group w-full text-left rounded-2xl bg-white dark:bg-[#131d33] border border-slate-200/80 dark:border-slate-700/80 px-5 sm:px-6 py-4 sm:py-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00477C]"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm sm:text-[15px] font-semibold leading-snug text-slate-900 dark:text-white">
                                                {copy.question}
                                            </span>
                                            <span className={`shrink-0 w-6 h-6 rounded-full border border-slate-400/75 dark:border-slate-500 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 transition-transform duration-200 ${isExpanded ? 'rotate-180 bg-slate-100 dark:bg-slate-800' : 'group-hover:scale-110'}`}>
                                                {isExpanded ? (
                                                    <Minus className="w-3.5 h-3.5" strokeWidth={1.8} />
                                                ) : (
                                                    <Plus className="w-3.5 h-3.5" strokeWidth={1.8} />
                                                )}
                                            </span>
                                        </div>

                                        {isExpanded && (
                                            <p className="swap-in mt-2.5 pr-8 text-xs sm:text-[13.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                                                {copy.answer}
                                            </p>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
