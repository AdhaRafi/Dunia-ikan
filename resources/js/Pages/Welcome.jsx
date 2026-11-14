import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ProductCard from '@/Components/ProductCard';
import { 
    ArrowRight, 
    BookOpen,
    CheckCircle2,
    BadgeCheck
} from 'lucide-react';

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

    // MorphMarket Species Groups for Explorer Grid
    const speciesGroups = [
        {
            title: 'Cupang (Betta)',
            subtitle: 'Betta splendens',
            desc: 'Halfmoon, Plakat Avatar, Crowntail, Giant Multi',
            image: '/images/products/cupang-halfmoon.jpg',
            badge: 'Show Grade Morphs',
            link: '/products?category=ikan-hias&q=cupang',
        },
        {
            title: 'Channa / Gabus Hias',
            subtitle: 'Channa marulioides & auranti',
            desc: 'Yellow Sentarum, Bunga Bar, Pulchra, Limbata',
            image: '/images/products/channa-maru.jpg',
            badge: 'Predator Eksotis',
            link: '/products?category=ikan-hias&q=channa',
        },
        {
            title: 'Ikan Discus',
            subtitle: 'Symphysodon aequifasciatus',
            desc: 'Pigeon Blood Red, Blue Diamond, Red Melon',
            image: '/images/products/discus.jpg',
            badge: 'King of Freshwater',
            link: '/products?category=ikan-hias&q=discus',
        },
        {
            title: 'Guppy Galur Murni',
            subtitle: 'Poecilia reticulata',
            desc: 'Albino Full Red (AFR), Moscow Blue, Dumbo Ear',
            image: '/images/products/guppy-afr.jpg',
            badge: 'Pure Lineage Pairs',
            link: '/products?category=ikan-hias&q=guppy',
        },
        {
            title: 'Aquascape & Flora',
            subtitle: 'Tanaman Air & Hardscape',
            desc: 'Bucephalandra, Anubias Nana, Moss Higienis',
            image: '/images/products/anubias.jpg',
            badge: 'Bebas Hama',
            link: '/products?category=aquascape',
        },
        {
            title: 'Nano Fish & Schooling',
            subtitle: 'Tetra & Rasbora',
            desc: 'Neon Tetra Schooling, Cardinal, Harlequin',
            image: '/images/products/neon-tetra.jpg',
            badge: 'Schooling Community',
            link: '/products?water_type=freshwater',
        },
    ];

    return (
        <AppLayout>
            <Head title="Dunia Ikan : Marketplace Ikan Hias & Mutasi Genetik (Morph) Captive-Bred" />

            {/* 1. HERO SECTION: Full-Bleed Edge-to-Edge Banner (MorphMarket Authentic Dark Aesthetic) */}
            <section className="relative w-full overflow-hidden bg-black min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] flex items-center border-b border-neutral-800">
                {/* Floating Studio Fish Video (Seamless Pure Black Background ala MorphMarket) */}
                <div className="absolute right-0 top-0 bottom-0 w-full sm:w-3/4 lg:w-3/5 flex items-center justify-end pointer-events-none overflow-hidden">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        poster="/images/hero-fish-poster.webp"
                        className="h-full w-full object-cover sm:object-contain object-center sm:object-right select-none opacity-80 sm:opacity-100"
                    >
                        <source src="/videos/hero-fish.webm" type="video/webm" />
                        <source src="/videos/hero-fish.mp4" type="video/mp4" />
                        <img
                            src="/images/hero-fish-poster.webp"
                            alt="Show Grade Betta Morph Dunia Ikan"
                            className="h-full w-full object-cover sm:object-contain object-center sm:object-right select-none opacity-80 sm:opacity-100"
                        />
                    </video>
                </div>

                {/* Left vignette gradient for seamless typography readability */}
                <div className="absolute inset-y-0 left-0 w-full sm:w-1/2 bg-gradient-to-r from-black via-black/90 to-transparent pointer-events-none" />
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
                                className="px-7 py-3 rounded-full bg-white text-black font-bold text-xs sm:text-sm hover:bg-neutral-200 transition shadow-sm"
                            >
                                Jelajahi Katalog
                            </Link>
                            <Link 
                                href="/register" 
                                className="px-7 py-3 rounded-full border border-neutral-600 text-white font-semibold text-xs sm:text-sm hover:bg-white/10 hover:border-neutral-400 transition"
                            >
                                Buat Akun
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
                {/* 2. KATEGORI IKAN (Category Tiles) */}
                <section className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#001454] dark:text-white">
                                Kategori Ikan
                            </h2>
                        </div>
                        <Link
                            href="/products"
                            className="text-xs font-bold text-[#0684E5] dark:text-[#4AB8BD] hover:text-[#0060aa] flex items-center gap-1 transition"
                        >
                            <span>Lihat semua kategori</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* 6 Visual Morph Tiles */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                        {speciesGroups.map((group) => (
                            <Link
                                key={group.title}
                                href={group.link}
                                className="group relative rounded-2xl overflow-hidden bg-white dark:bg-[#0f172a] border border-[#1E80A0]/10 dark:border-neutral-800 hover:border-[#4AB8BD] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                            >
                                <div className="relative aspect-[16/10] bg-[#f3f2ff] dark:bg-[#162240] overflow-hidden">
                                    <img
                                        src={group.image}
                                        alt={group.title}
                                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#001454]/80 via-transparent to-transparent" />
                                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[#001454] text-[10px] font-bold shadow-xs">
                                        {group.badge}
                                    </span>
                                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                                        <h3 className="font-extrabold text-sm sm:text-base leading-tight group-hover:text-[#4AB8BD] transition">
                                            {group.title}
                                        </h3>
                                        <p className="text-[10px] text-[#dde1ff] italic truncate">
                                            {group.subtitle}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-3 bg-white dark:bg-[#111a30] flex items-center justify-between text-xs border-t border-[#1E80A0]/10 dark:border-neutral-800">
                                    <span className="text-[11px] text-[#6d797a] dark:text-neutral-300 truncate font-medium">
                                        {group.desc}
                                    </span>
                                    <ArrowRight className="w-3.5 h-3.5 text-[#0684E5] dark:text-[#4AB8BD] group-hover:translate-x-1 transition shrink-0 ml-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 4. RECENT SPECIMEN LISTINGS & MORPHMARKET GRID */}
                <section className="space-y-6 pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                Katalog Terverifikasi
                            </p>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#001454] dark:text-white mt-1">
                                Mutasi Pilihan & Rilisan Terbaru
                            </h2>
                        </div>

                        {/* Parametric Biology Filters */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
                            {[
                                { id: 'all', label: 'Semua Spesimen' },
                                { id: 'freshwater', label: 'Air Tawar' },
                                { id: 'saltwater', label: 'Air Laut' },
                                { id: 'male', label: '♂ Jantan' },
                                { id: 'female', label: '♀ Betina' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setSelectedTab(tab.id)}
                                    className={`px-3.5 py-1.5 rounded-full transition whitespace-nowrap ${
                                        selectedTab === tab.id
                                            ? 'bg-[#4AB8BD] text-white font-bold shadow-xs'
                                            : 'bg-white dark:bg-[#111a30] text-[#001454] dark:text-neutral-200 border border-[#1E80A0]/20 dark:border-neutral-700 hover:border-[#4AB8BD] hover:bg-[#f3f2ff] dark:hover:bg-neutral-800'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Specimen Product Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {displayedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                {/* 5. VERIFIED BREEDER NETWORK (MorphMarket Breeder Directory) */}
                {featuredStores && featuredStores.length > 0 && (
                    <section className="space-y-6 border-t border-[#1E80A0]/10 dark:border-neutral-800 pt-10">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                            <div>
                                <div className="flex items-center gap-2 text-xs font-bold text-[#1E80A0] dark:text-[#4AB8BD] uppercase tracking-wider">
                                    <BadgeCheck className="w-4 h-4 text-[#00696D] dark:text-[#4AB8BD]" />
                                    <span>Direktori Penangkar Resmi</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#001454] dark:text-white mt-1">
                                    Farm Ikan Hias & Breeder Terakreditasi
                                </h3>
                                <p className="text-xs text-[#3d4949] dark:text-neutral-400 mt-0.5">
                                    Beli langsung dari peternak terverifikasi dengan jaminan ikan hidup sampai tujuan.
                                </p>
                            </div>
                            <Link
                                href="/products"
                                className="text-xs font-bold text-[#0684E5] dark:text-[#4AB8BD] hover:text-[#0060aa] flex items-center gap-1 transition"
                            >
                                <span>Lihat semua penangkar</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {featuredStores.slice(0, 3).map((store) => (
                                <Link
                                    key={store.id}
                                    href={`/stores/${store.slug}`}
                                    className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-[#1E80A0]/10 dark:border-neutral-800 hover:border-[#4AB8BD] hover:shadow-lg transition-all space-y-3 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-[#f3f2ff] dark:bg-[#162240] flex items-center justify-center font-extrabold text-[#001454] dark:text-white text-base group-hover:bg-[#001454] group-hover:text-white transition shadow-xs">
                                            {store.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1">
                                                <h4 className="font-bold text-sm text-[#001454] dark:text-white truncate">
                                                    {store.name}
                                                </h4>
                                                <BadgeCheck className="w-4 h-4 text-[#00696D] dark:text-[#4AB8BD] shrink-0" />
                                            </div>
                                            <p className="text-xs text-[#6d797a] dark:text-neutral-400 truncate">
                                                {store.city} • {store.province}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-[#3d4949] dark:text-neutral-300 line-clamp-2 leading-relaxed">
                                        {store.description || 'Penangkar resmi mutasi ikan hias genetik kontes bersertifikat.'}
                                    </p>
                                    <div className="pt-2 border-t border-[#1E80A0]/10 dark:border-neutral-800 flex items-center justify-between text-[11px]">
                                        <div className="flex items-center gap-1 font-bold text-[#00696D] dark:text-[#4AB8BD]">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span>Garansi Ikan Hidup</span>
                                        </div>
                                        <span className="text-[#0684E5] dark:text-cyan-400 font-semibold group-hover:underline">
                                            Kunjungi Farm →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Join as Breeder CTA Banner */}
                        <div className="rounded-2xl bg-gradient-to-r from-[#001454] to-[#0D2E92] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                            <div className="space-y-1 text-center sm:text-left">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C0ECB8]">
                                    Bergabung Bersama Komunitas Breeder
                                </span>
                                <h4 className="text-lg sm:text-xl font-bold">
                                    Apakah Anda Penangkar atau Aquascaper?
                                </h4>
                                <p className="text-xs text-[#dde1ff] max-w-xl">
                                    Daftarkan farm Anda di Dunia Ikan, jangkau ribuan penghobi di seluruh Indonesia, dan jual spesimen dengan perlindungan transaksi aman.
                                </p>
                            </div>
                            <Link
                                href="/seller/register"
                                className="px-6 py-3 rounded-full bg-[#0684E5] text-white font-bold text-xs hover:bg-[#0060aa] hover:scale-105 shadow-md transition whitespace-nowrap"
                            >
                                Buka Toko Penangkar
                            </Link>
                        </div>
                    </section>
                )}

                {/* 6. FISHPEDIA / CARE GUIDES (Morphpedia Style) */}
                {careGuides && careGuides.length > 0 && (
                    <section className="space-y-6 border-t border-[#1E80A0]/10 dark:border-neutral-800 pt-10">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                            <div>
                                <div className="flex items-center gap-2 text-xs font-bold text-[#1E80A0] dark:text-[#4AB8BD] uppercase tracking-wider">
                                    <BookOpen className="w-4 h-4 text-[#4AB8BD]" />
                                    <span>Fishpedia & Panduan Genetik</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#001454] dark:text-white mt-1">
                                    Edukasi Perawatan & Parameter Air
                                </h3>
                                <p className="text-xs text-[#3d4949] dark:text-neutral-400 mt-0.5">
                                    Protokol karantina, aklimatisasi, dan pemahaman mutasi genetik ikan hias.
                                </p>
                            </div>
                            <Link
                                href="/guides"
                                className="text-xs font-bold text-[#0684E5] dark:text-[#4AB8BD] hover:text-[#0060aa] flex items-center gap-1 transition"
                            >
                                <span>Semua panduan</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {careGuides.slice(0, 3).map((guide) => (
                                <Link
                                    key={guide.id}
                                    href={`/guides/${guide.slug}`}
                                    className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-[#1E80A0]/10 dark:border-neutral-800 hover:border-[#4AB8BD] hover:shadow-lg transition-all space-y-2.5 group flex flex-col justify-between"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#1E80A0] dark:text-[#4AB8BD] uppercase tracking-wider">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            <span>{guide.category || 'Panduan Perawatan'}</span>
                                        </div>
                                        <h4 className="font-bold text-sm text-[#001454] dark:text-white group-hover:text-[#0684E5] dark:group-hover:text-[#4AB8BD] transition leading-snug line-clamp-2">
                                            {guide.title}
                                        </h4>
                                        <p className="text-xs text-[#3d4949] dark:text-neutral-300 line-clamp-2 leading-relaxed">
                                            {guide.excerpt || guide.content?.substring(0, 100)}...
                                        </p>
                                    </div>
                                    <div className="pt-2 text-[11px] font-semibold text-[#0684E5] dark:text-[#4AB8BD] flex items-center gap-1">
                                        <span>Baca panduan</span>
                                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </AppLayout>
    );
}
