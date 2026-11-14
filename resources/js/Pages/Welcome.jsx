import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ProductCard from '@/Components/ProductCard';
import { 
    Sparkles, 
    ArrowRight, 
    ShieldCheck, 
    Thermometer, 
    Droplets, 
    Store,
    BookOpen,
    CheckCircle2,
    Search,
    Dna,
    PackageCheck,
    Truck,
    BadgeCheck
} from 'lucide-react';

export default function Welcome({ categories, featuredFish, careGuides, featuredStores, stats }) {
    const [selectedTab, setSelectedTab] = useState('all');
    const [heroSearch, setHeroSearch] = useState('');

    const handleHeroSearch = (e) => {
        e.preventDefault();
        if (heroSearch.trim()) {
            window.location.href = `/products?q=${encodeURIComponent(heroSearch.trim())}`;
        }
    };

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
            <Head title="Dunia Ikan — Marketplace Ikan Hias & Mutasi Genetik (Morph) Captive-Bred" />

            {/* 1. HERO SECTION: Full-Bleed Edge-to-Edge Banner */}
            <section className="relative w-full overflow-hidden bg-[#001454] min-h-[440px] sm:min-h-[480px] lg:min-h-[500px] flex items-center border-b border-[#1E80A0]/15">
                {/* Background Nature / Aquatic Landscape */}
                <img
                    src="/images/products/cupang-halfmoon.jpg"
                    alt="MorphMarket Dunia Ikan"
                    className="absolute inset-0 w-full h-full object-cover object-right sm:object-center"
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#001454]/95 via-[#0D2E92]/75 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001454]/90 via-transparent to-transparent" />

                {/* Hero Content Overlay: Center-aligned within standard content width */}
                <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14">
                    <div className="max-w-2xl text-white space-y-5">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#C0ECB8] text-[11px] font-bold border border-white/20">
                            <Sparkles className="w-3.5 h-3.5 text-[#4AB8BD]" />
                            <span>Pusat Mutasi Genetik & Ikan Hias Captive-Bred</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.12] text-white">
                            Marketplace Ikan Hias & <br />
                            Mutasi Genetik (Morph)
                        </h1>

                        <p className="text-xs sm:text-sm text-[#dde1ff] leading-relaxed max-w-xl">
                            Beli spesimen ikan hias kontes dan mutasi morph langka langsung dari penangkar bersertifikasi di seluruh Indonesia. Bergaransi hidup D.O.A. 100% dengan parameter biologi akurat.
                        </p>

                        {/* Direct MorphMarket Search Box */}
                        <form onSubmit={handleHeroSearch} className="pt-1 flex items-center gap-2 max-w-lg">
                            <div className="relative flex-1">
                                <input
                                    type="search"
                                    placeholder="Cari spesies (Cupang, Channa, Discus...), morph, atau penangkar..."
                                    value={heroSearch}
                                    onChange={(e) => setHeroSearch(e.target.value)}
                                    className="w-full h-12 rounded-full bg-white/95 backdrop-blur-md pl-11 pr-4 text-xs text-[#001454] placeholder:text-[#6d797a] border-0 focus:ring-2 focus:ring-[#4AB8BD] focus:bg-white shadow-lg transition"
                                />
                                <Search className="w-4 h-4 text-[#1E80A0] absolute left-4 top-4 pointer-events-none" />
                            </div>
                            <button
                                type="submit"
                                className="h-12 px-6 rounded-full bg-[#0684E5] text-white font-bold text-xs hover:bg-[#0060aa] hover:scale-105 shadow-lg shadow-[#0684E5]/30 transition shrink-0"
                            >
                                Cari
                            </button>
                        </form>

                        {/* Quick Morph Selector Chips */}
                        <div className="pt-1 flex items-center gap-1.5 flex-wrap text-[11px]">
                            <span className="text-[#C0ECB8] font-bold">Populer:</span>
                            {[
                                { label: 'Cupang Rosetail', q: 'cupang' },
                                { label: 'Channa Maru', q: 'channa' },
                                { label: 'Discus Pigeon', q: 'discus' },
                                { label: 'Guppy AFR', q: 'guppy' },
                                { label: 'Aquascape', q: 'aquascape' },
                            ].map((chip) => (
                                <Link
                                    key={chip.label}
                                    href={`/products?q=${chip.q}`}
                                    className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#dde1ff] hover:text-white border border-white/15 transition"
                                >
                                    {chip.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
                {/* 2. TRUST PILLARS STRIP (MorphMarket Standards) */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#1E80A0]/10 shadow-xs flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#f3f2ff] text-[#00696D] flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-5 h-5 text-[#00696D]" />
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-xs font-bold text-[#001454] leading-tight">Garansi D.O.A. 100%</h4>
                            <p className="text-[11px] text-[#6d797a] truncate mt-0.5">Ikan hidup sampai tujuan</p>
                        </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#1E80A0]/10 shadow-xs flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#f3f2ff] text-[#4AB8BD] flex items-center justify-center shrink-0">
                            <Dna className="w-5 h-5 text-[#4AB8BD]" />
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-xs font-bold text-[#001454] leading-tight">Mutasi & Genetik Valid</h4>
                            <p className="text-[11px] text-[#6d797a] truncate mt-0.5">Morfologi & galur terverifikasi</p>
                        </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#1E80A0]/10 shadow-xs flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#f3f2ff] text-[#0684E5] flex items-center justify-center shrink-0">
                            <Store className="w-5 h-5 text-[#0684E5]" />
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-xs font-bold text-[#001454] leading-tight">Penangkar Terakreditasi</h4>
                            <p className="text-[11px] text-[#6d797a] truncate mt-0.5">Langsung dari farm resmi</p>
                        </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#1E80A0]/10 shadow-xs flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#f3f2ff] text-[#1E80A0] flex items-center justify-center shrink-0">
                            <PackageCheck className="w-5 h-5 text-[#1E80A0]" />
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-xs font-bold text-[#001454] leading-tight">Packing Oksigen Khusus</h4>
                            <p className="text-[11px] text-[#6d797a] truncate mt-0.5">Aman perjalanan 48-72 jam</p>
                        </div>
                    </div>
                </section>

                {/* 3. MORPHMARKET SPECIES EXPLORER (Category Tiles) */}
                <section className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-[#1E80A0] uppercase tracking-wider">
                                <Dna className="w-4 h-4 text-[#4AB8BD]" />
                                <span>Katalog Spesies & Morfologi</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#001454] mt-1">
                                Jelajahi Berdasarkan Garis Keturunan & Strain
                            </h2>
                        </div>
                        <Link
                            href="/products"
                            className="text-xs font-bold text-[#0684E5] hover:text-[#0060aa] flex items-center gap-1 transition"
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
                                className="group relative rounded-2xl overflow-hidden bg-white border border-[#1E80A0]/10 hover:border-[#4AB8BD] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                            >
                                <div className="relative aspect-[16/10] bg-[#f3f2ff] overflow-hidden">
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
                                <div className="p-3 bg-white flex items-center justify-between text-xs border-t border-[#1E80A0]/10">
                                    <span className="text-[11px] text-[#6d797a] truncate font-medium">
                                        {group.desc}
                                    </span>
                                    <ArrowRight className="w-3.5 h-3.5 text-[#0684E5] group-hover:translate-x-1 transition shrink-0 ml-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 4. RECENT SPECIMEN LISTINGS & MORPHMARKET GRID */}
                <section className="space-y-6 pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-[#1E80A0] uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-[#4AB8BD]" />
                                <span>Spesimen Pilihan</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#001454] mt-1">
                                Mutasi Trending & Rilisan Terbaru
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
                                            : 'bg-white text-[#001454] border border-[#1E80A0]/20 hover:border-[#4AB8BD] hover:bg-[#f3f2ff]'
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
                    <section className="space-y-6 border-t border-[#1E80A0]/10 pt-10">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                            <div>
                                <div className="flex items-center gap-2 text-xs font-bold text-[#1E80A0] uppercase tracking-wider">
                                    <BadgeCheck className="w-4 h-4 text-[#00696D]" />
                                    <span>Direktori Penangkar Resmi</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#001454] mt-1">
                                    Farm Ikan Hias & Breeder Terakreditasi
                                </h3>
                                <p className="text-xs text-[#3d4949] mt-0.5">
                                    Beli langsung dari peternak terverifikasi dengan kebijakan garansi D.O.A. transparan.
                                </p>
                            </div>
                            <Link
                                href="/products"
                                className="text-xs font-bold text-[#0684E5] hover:text-[#0060aa] flex items-center gap-1 transition"
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
                                    className="p-5 rounded-2xl bg-white border border-[#1E80A0]/10 hover:border-[#4AB8BD] hover:shadow-lg transition-all space-y-3 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-[#f3f2ff] flex items-center justify-center font-extrabold text-[#001454] text-base group-hover:bg-[#001454] group-hover:text-white transition shadow-xs">
                                            {store.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1">
                                                <h4 className="font-bold text-sm text-[#001454] truncate">
                                                    {store.name}
                                                </h4>
                                                <BadgeCheck className="w-4 h-4 text-[#00696D] shrink-0" />
                                            </div>
                                            <p className="text-xs text-[#6d797a] truncate">
                                                {store.city} • {store.province}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-[#3d4949] line-clamp-2 leading-relaxed">
                                        {store.description || 'Penangkar resmi mutasi ikan hias genetik kontes bersertifikat.'}
                                    </p>
                                    <div className="pt-2 border-t border-[#1E80A0]/10 flex items-center justify-between text-[11px]">
                                        <div className="flex items-center gap-1 font-bold text-[#00696D]">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span>Garansi D.O.A. Aktif</span>
                                        </div>
                                        <span className="text-[#0684E5] font-semibold group-hover:underline">
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
                    <section className="space-y-6 border-t border-[#1E80A0]/10 pt-10">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                            <div>
                                <div className="flex items-center gap-2 text-xs font-bold text-[#1E80A0] uppercase tracking-wider">
                                    <BookOpen className="w-4 h-4 text-[#4AB8BD]" />
                                    <span>Fishpedia & Panduan Genetik</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#001454] mt-1">
                                    Edukasi Perawatan & Parameter Air
                                </h3>
                                <p className="text-xs text-[#3d4949] mt-0.5">
                                    Protokol karantina, aklimatisasi, dan pemahaman mutasi genetik ikan hias.
                                </p>
                            </div>
                            <Link
                                href="/guides"
                                className="text-xs font-bold text-[#0684E5] hover:text-[#0060aa] flex items-center gap-1 transition"
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
                                    className="p-5 rounded-2xl bg-white border border-[#1E80A0]/10 hover:border-[#4AB8BD] hover:shadow-lg transition-all space-y-2.5 group flex flex-col justify-between"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#1E80A0] uppercase tracking-wider">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            <span>{guide.category || 'Panduan Perawatan'}</span>
                                        </div>
                                        <h4 className="font-bold text-sm text-[#001454] group-hover:text-[#0684E5] transition leading-snug line-clamp-2">
                                            {guide.title}
                                        </h4>
                                        <p className="text-xs text-[#3d4949] line-clamp-2 leading-relaxed">
                                            {guide.excerpt || guide.content?.substring(0, 100)}...
                                        </p>
                                    </div>
                                    <div className="pt-2 text-[11px] font-semibold text-[#0684E5] flex items-center gap-1">
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
