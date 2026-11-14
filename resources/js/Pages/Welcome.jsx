import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ProductCard from '@/Components/ProductCard';

export default function Welcome({ categories, featuredFish, careGuides, featuredStores, stats }) {
    const [selectedTab, setSelectedTab] = useState('all');

    // Filter items based on quick chips
    const displayedProducts = featuredFish?.filter((item) => {
        if (selectedTab === 'all') return true;
        if (selectedTab === 'freshwater') return item.fish_detail?.water_type === 'freshwater';
        if (selectedTab === 'saltwater') return item.fish_detail?.water_type === 'saltwater';
        if (selectedTab === 'male') return item.fish_detail?.sex === 'male';
        if (selectedTab === 'female') return item.fish_detail?.sex === 'female';
        return true;
    }) || [];

    // MorphMarket-style clean shop categories grid (fish species, aquarium tools, care & aquatic plants)
    const shopCategories = [
        {
            title: 'Cupang',
            image: '/images/categories/cat-cupang.jpg',
            link: '/products?category=ikan-hias&q=cupang',
        },
        {
            title: 'Channa',
            image: '/images/categories/cat-channa.jpg',
            link: '/products?category=ikan-hias&q=channa',
        },
        {
            title: 'Discus',
            image: '/images/categories/cat-discus.jpg',
            link: '/products?category=ikan-hias&q=discus',
        },
        {
            title: 'Guppy',
            image: '/images/categories/cat-guppy.jpg',
            link: '/products?category=ikan-hias&q=guppy',
        },
        {
            title: 'Neon Tetra',
            image: '/images/categories/cat-tetra.jpg',
            link: '/products?water_type=freshwater&q=tetra',
        },
        {
            title: 'Filter Aquarium',
            image: '/images/categories/cat-filter.jpg',
            link: '/products?category=perlengkapan-aquarium&q=filter',
        },
        {
            title: 'Tank Aquarium',
            image: '/images/categories/cat-tank.jpg',
            link: '/products?category=perlengkapan-aquarium&q=aquarium',
        },
        {
            title: 'Pakan & Pelet',
            image: '/images/categories/cat-pakan.jpg',
            link: '/products?category=pakan-ikan',
        },
        {
            title: 'Perawatan Air',
            image: '/images/categories/cat-perawatan.jpg',
            link: '/products?category=perawatan-ikan',
        },
        {
            title: 'Anubias',
            image: '/images/categories/cat-aquascape.jpg',
            link: '/products?category=aquascape&q=anubias',
        },
        {
            title: 'Bucephalandra',
            image: '/images/categories/cat-buce.jpg',
            link: '/products?category=aquascape&q=bucephalandra',
        },
        {
            title: 'Tanaman Hias',
            image: '/images/categories/cat-tanaman.jpg',
            link: '/products?category=aquascape',
        },
    ];

    return (
        <AppLayout>
            <Head title="Dunia Ikan : Marketplace Ikan Hias & Mutasi Genetik (Morph) Captive-Bred" />

            {/* 1. HERO SECTION: Full-Bleed Edge-to-Edge Banner (Living Aquarium Habitat) */}
            <section className="relative w-full overflow-hidden bg-black min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] flex items-center border-b border-neutral-800">
                {/* Full-Bleed Background Video (Edge-to-Edge Aquarium Footage) */}
                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden transform-gpu">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        poster="/images/hero-fish-poster.webp"
                        className="w-full h-full object-cover object-center select-none"
                    >
                        <source src="/videos/hero-fish.webm" type="video/webm" />
                        <source src="/videos/hero-fish.mp4" type="video/mp4" />
                        <img
                            src="/images/hero-fish-poster.webp"
                            alt="Akuarium Ikan Hias Dunia Ikan"
                            className="w-full h-full object-cover object-center select-none"
                        />
                    </video>
                </div>

                {/* Cinematic Ambient Dark Scrim & Text Readability Gradients */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent sm:w-3/4 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent sm:hidden pointer-events-none" />

                {/* Hero Content Overlay: Center-aligned within standard content width */}
                <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
                    <div className="max-w-2xl text-white space-y-6">
                        <div className="space-y-3">
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-white">
                                Join Dunia Ikan
                            </h1>
                            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                                Akses langsung ke peternak bersertifikasi di seluruh Indonesia. Temukan mutasi morph langka, lelang galur murni, dan garansi ikan hidup 100% sampai tujuan!
                            </p>
                        </div>

                        {/* MorphMarket Two Action Buttons */}
                        <div className="flex items-center gap-3 pt-2">
                            <Link 
                                href="/products" 
                                className="px-7 py-3 rounded-full bg-white text-black dark:bg-[#4AB8BD] dark:text-[#001454] font-bold text-xs sm:text-sm hover:bg-neutral-200 dark:hover:bg-[#38a2a7] transition shadow-sm"
                            >
                                Jelajahi Katalog
                            </Link>
                            <Link 
                                href="/register" 
                                className="px-7 py-3 rounded-full border border-neutral-600 dark:border-neutral-700 text-white font-semibold text-xs sm:text-sm hover:bg-white/10 hover:border-neutral-400 transition"
                            >
                                Buat Akun
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
                {/* 2. KATEGORI TOKO (Clean MorphMarket Studio Cutout Cards) */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#001454] dark:text-white">
                            Kategori Toko
                        </h2>
                        <Link
                            href="/products"
                            className="text-xs font-semibold text-neutral-500 hover:text-[#001454] dark:text-neutral-400 dark:hover:text-white transition"
                        >
                            Lihat Semua
                        </Link>
                    </div>

                    {/* 12 Clean White-Backdrop Category Tiles (2x6 MorphMarket Grid) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
                        {shopCategories.map((group) => (
                            <Link
                                key={group.title}
                                href={group.link}
                                className="group bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-neutral-800 hover:border-[#4AB8BD] shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:shadow-md transition-all duration-200 flex flex-col items-center overflow-hidden p-3"
                            >
                                <div className="w-full aspect-square bg-white rounded-xl overflow-hidden flex items-center justify-center p-1">
                                    <img
                                        src={group.image}
                                        alt={group.title}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="mt-2.5 text-center font-bold text-xs sm:text-[13px] text-[#001454] dark:text-white group-hover:text-[#0684E5] dark:group-hover:text-[#4AB8BD] transition truncate w-full">
                                    {group.title}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 4. PRODUCT GRID */}
                <section className="space-y-5 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#001454] dark:text-white">
                            Produk Terbaru
                        </h2>

                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
                            {[
                                { id: 'all', label: 'Semua' },
                                { id: 'freshwater', label: 'Air Tawar' },
                                { id: 'saltwater', label: 'Air Laut' },
                                { id: 'male', label: 'Jantan' },
                                { id: 'female', label: 'Betina' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setSelectedTab(tab.id)}
                                    className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                                        selectedTab === tab.id
                                            ? 'bg-[#001454] dark:bg-[#4AB8BD] text-white dark:text-[#001454] font-bold'
                                            : 'bg-white dark:bg-[#111a30] text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700 hover:border-[#4AB8BD]'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                        {displayedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                {/* 5. TOKO & PENANGKAR (Clean 2-Col Editorial Directory + Matte CTA) */}
                {featuredStores && featuredStores.length > 0 && (
                    <section className="space-y-6 border-t border-slate-200/80 dark:border-neutral-800 pt-10">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#001454] dark:text-white">
                                Toko Pilihan
                            </h2>
                            <Link
                                href="/products"
                                className="text-xs font-semibold text-neutral-500 hover:text-[#001454] dark:text-neutral-400 dark:hover:text-white transition"
                            >
                                Lihat Semua
                            </Link>
                        </div>

                        <div className={`grid grid-cols-1 gap-4 ${featuredStores.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                            {featuredStores.slice(0, 3).map((store) => (
                                <Link
                                    key={store.id}
                                    href={`/stores/${store.slug}`}
                                    className="group p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-neutral-800 hover:border-[#4AB8BD] transition-colors flex items-start gap-4"
                                >
                                    {store.logo_url ? (
                                        <img
                                            src={store.logo_url}
                                            alt={store.name}
                                            className="w-11 h-11 rounded-full object-cover border border-slate-200/80 dark:border-neutral-700 shrink-0"
                                        />
                                    ) : (
                                        <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-[#162240] flex items-center justify-center font-bold text-[#001454] dark:text-white text-sm shrink-0 group-hover:bg-[#001454] group-hover:text-white dark:group-hover:bg-[#4AB8BD] dark:group-hover:text-[#001454] transition">
                                            {store.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex items-baseline justify-between gap-2">
                                            <h3 className="font-bold text-sm text-[#001454] dark:text-white group-hover:text-[#0684E5] dark:group-hover:text-[#4AB8BD] truncate transition">
                                                {store.name}
                                            </h3>
                                            {store.products_count > 0 && (
                                                <span className="text-[11px] text-slate-400 shrink-0 tabular-nums">
                                                    {store.products_count} produk
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">
                                            {store.city}, {store.province}
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-neutral-300 line-clamp-2 leading-relaxed pt-1">
                                            {store.description || 'Penangkar ikan hias dan perlengkapan akuarium terverifikasi.'}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="rounded-3xl bg-[#0f172a] dark:bg-[#111a30] border border-slate-800 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                            <div className="space-y-1">
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                                    Punya Farm atau Toko Aquascape?
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                                    Pasarkan ikan hias, alat akuarium, dan tanaman aquascape Anda langsung ke penghobi di seluruh Indonesia.
                                </p>
                            </div>
                            <Link
                                href="/seller/register"
                                className="px-6 py-2.5 rounded-full bg-white text-[#0f172a] font-bold text-xs hover:bg-slate-100 transition whitespace-nowrap self-start sm:self-auto"
                            >
                                Buka Toko
                            </Link>
                        </div>
                    </section>
                )}

                {/* 6. PANDUAN PERAWATAN (Behance/Editorial 3-Column Index) */}
                {careGuides && careGuides.length > 0 && (
                    <section className="space-y-6 border-t border-slate-200/80 dark:border-neutral-800 pt-10">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#001454] dark:text-white">
                                Panduan Perawatan
                            </h2>
                            <Link
                                href="/guides"
                                className="text-xs font-semibold text-neutral-500 hover:text-[#001454] dark:text-neutral-400 dark:hover:text-white transition"
                            >
                                Semua Panduan
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                            {careGuides.slice(0, 3).map((guide, index) => (
                                <Link
                                    key={guide.id}
                                    href={`/guides/${guide.id}`}
                                    className="group border-t border-slate-200 dark:border-neutral-800 pt-4 space-y-2 block"
                                >
                                    <p className="text-[11px] font-semibold text-slate-400 dark:text-neutral-500 tabular-nums">
                                        {String(index + 1).padStart(2, '0')} · {guide.category || 'Perawatan Ikan'}
                                    </p>
                                    <h3 className="font-bold text-sm sm:text-[15px] text-[#001454] dark:text-white group-hover:text-[#0684E5] dark:group-hover:text-[#4AB8BD] transition leading-snug line-clamp-2">
                                        {guide.title}
                                    </h3>
                                    <p className="text-xs text-slate-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                                        {guide.symptoms || guide.possible_causes || guide.prevention}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </AppLayout>
    );
}
