import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Minus, Plus } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import ProductCard from '@/Components/ProductCard';

const FAQ_ITEMS = [
    {
        question: 'Apakah garansi ikan hidup 100% berlaku di seluruh Indonesia?',
        answer: 'Ya, setiap pengiriman ikan hias dari penangkar terverifikasi dilindungi garansi DOA (Dead on Arrival) dengan syarat melampirkan video unboxing tanpa jeda saat paket diterima.',
    },
    {
        question: 'Bagaimana standar packing agar ikan tetap aman selama pengiriman?',
        answer: 'Penangkar memakai kantong oksigen ganda bertekanan, air kondisi stabil, serta boks styrofoam atau insulasi thermal sesuai jarak pengiriman.',
    },
    {
        question: 'Bagaimana cara memilih ikan air tawar atau air laut di katalog?',
        answer: 'Anda bisa langsung klik menu Air Tawar atau Air Laut di sidebar, atau gunakan filter Tipe Air di halaman Katalog lengkap beserta informasi pH dan suhu ideal.',
    },
    {
        question: 'Kapan dana pembayaran diteruskan ke toko penangkar?',
        answer: 'Pembayaran ditahan sementara oleh sistem dan baru diteruskan setelah pesanan dikonfirmasi diterima dalam kondisi baik atau melewati batas waktu konfirmasi.',
    },
    {
        question: 'Apakah penangkar atau toko aquascape bisa berjualan di sini?',
        answer: 'Bisa. Anda cukup mendaftar akun lalu melengkapi profil toko di menu Buka Toko untuk mulai menayangkan stok ikan hias, tanaman, dan perlengkapan akuarium.',
    },
];

export default function Welcome({ categories, featuredFish, featuredStores, stats }) {
    const [selectedTab, setSelectedTab] = useState('all');
    const [openFaq, setOpenFaq] = useState(0);

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
            image: '/images/categories/cupang.jpg',
            link: '/products?category=ikan-hias&q=cupang',
        },
        {
            title: 'Channa',
            image: '/images/categories/channa.jpg',
            link: '/products?category=ikan-hias&q=channa',
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
            title: 'Filter Aquarium',
            image: '/images/categories/filter-aquarium.jpg',
            link: '/products?category=perlengkapan-aquarium&q=filter',
        },
        {
            title: 'Tank Aquarium',
            image: '/images/categories/tank-aquarium.jpg',
            link: '/products?category=perlengkapan-aquarium&q=aquarium',
        },
        {
            title: 'Pakan & Pelet',
            image: '/images/categories/pakan-ikan.jpg',
            link: '/products?category=pakan-ikan',
        },
        {
            title: 'Perawatan Air',
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
            title: 'Tanaman Hias',
            image: '/images/categories/tanaman-hias.jpg',
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
                        poster="/images/hero/aquarium-poster.webp"
                        className="w-full h-full object-cover object-center select-none"
                    >
                        <source src="/videos/aquarium-hero.webm" type="video/webm" />
                        <source src="/videos/aquarium-hero.mp4" type="video/mp4" />
                        <img
                            src="/images/hero/aquarium-poster.webp"
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

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
                            {featuredStores.slice(0, 6).map((store) => (
                                <Link
                                    key={store.id}
                                    href={`/stores/${store.slug}`}
                                    className="group bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-neutral-800 hover:border-[#4AB8BD] shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
                                >
                                    <div className="w-full aspect-square bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center border-b border-slate-100 dark:border-neutral-800/80">
                                        {store.logo_url ? (
                                            <img
                                                src={store.logo_url}
                                                alt={store.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-50 dark:bg-[#162240] flex items-center justify-center font-extrabold text-3xl text-[#001454] dark:text-white group-hover:text-[#0684E5] dark:group-hover:text-[#4AB8BD] transition">
                                                {store.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-3 py-2.5">
                                        <h3 className="text-xs font-bold text-[#001454] dark:text-white group-hover:text-[#0684E5] dark:group-hover:text-[#4AB8BD] truncate transition">
                                            {store.name}
                                        </h3>
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

                {/* 6. FREQUENTLY ASKED QUESTIONS */}
                <section className="rounded-[24px] sm:rounded-[28px] bg-[#f4f5f7] dark:bg-[#0e1424] border border-slate-200/70 dark:border-slate-800/90 px-5 sm:px-10 lg:px-14 py-10 sm:py-14 lg:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-stretch">
                        {/* Left Column: Heading at top, Helper Subtext + Pill CTA at bottom */}
                        <div className="lg:col-span-5 flex flex-col justify-between gap-7">
                            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold tracking-[-0.03em] leading-[1.12] text-slate-900 dark:text-white">
                                Pertanyaan Umum
                                <br />
                                dari para pembeli.
                            </h2>

                            <div>
                                <p className="max-w-[34ch] text-xs sm:text-[13.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                                    Tim dan asisten Kiko kami selalu siap membantu dengan jawaban cepat, jelas, dan tepercaya kapan pun Anda butuh.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => window.dispatchEvent(new CustomEvent('dunia-ikan:open-chat'))}
                                    className="mt-4 inline-flex items-center justify-center rounded-full bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 px-5 py-2.5 text-xs sm:text-[13px] font-semibold shadow-[0_6px_18px_rgba(15,23,42,0.18)] active:scale-[0.99] transition"
                                >
                                    Tanya Kiko
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Clean White Card Accordion Stack */}
                        <div className="lg:col-span-7 space-y-3">
                            {FAQ_ITEMS.map((item, index) => {
                                const isExpanded = openFaq === index;
                                return (
                                    <button
                                        key={item.question}
                                        type="button"
                                        onClick={() => setOpenFaq(isExpanded ? null : index)}
                                        aria-expanded={isExpanded}
                                        className="w-full text-left rounded-2xl bg-white dark:bg-[#131d33] border border-slate-200/80 dark:border-slate-700/80 px-5 sm:px-6 py-4 sm:py-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0267C1]"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm sm:text-[15px] font-semibold leading-snug text-slate-900 dark:text-white">
                                                {item.question}
                                            </span>
                                            <span className="shrink-0 w-6 h-6 rounded-full border border-slate-400/75 dark:border-slate-500 inline-flex items-center justify-center text-slate-600 dark:text-slate-300">
                                                {isExpanded ? (
                                                    <Minus className="w-3.5 h-3.5" strokeWidth={1.8} />
                                                ) : (
                                                    <Plus className="w-3.5 h-3.5" strokeWidth={1.8} />
                                                )}
                                            </span>
                                        </div>

                                        {isExpanded && (
                                            <p className="mt-2.5 pr-8 text-xs sm:text-[13.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                                                {item.answer}
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
