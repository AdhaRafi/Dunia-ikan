import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ProductCard from '@/Components/ProductCard';
import FishMandala from '@/Components/FishMandala';
import { 
    Fish, 
    Sparkles, 
    ShieldCheck, 
    HeartPulse, 
    ArrowRight, 
    Play, 
    Thermometer, 
    Droplets, 
    Boxes,
    ChevronRight,
    MapPin,
    CheckCircle2
} from 'lucide-react';

export default function Welcome({ categories, featuredFish, careGuides, featuredStores, stats }) {
    // 5 vertical showcase items inspired by reference image
    const showcaseSpecimens = [
        {
            num: '01',
            name: 'Cupang (Betta)',
            slug: 'cupang-halfmoon-rosetail-super-red',
            image: '/images/products/cupang-halfmoon.jpg',
            trait: 'Rosetail Super Red',
        },
        {
            num: '02',
            name: 'Channa (Predator)',
            slug: 'channa-maru-yellow-sentarum-prospek-bunga',
            image: '/images/products/channa-maru.jpg',
            trait: 'Yellow Sentarum',
        },
        {
            num: '03',
            name: 'Discus & Cichlid',
            slug: 'discus-blue-diamond-high-body',
            image: '/images/products/discus.jpg',
            trait: 'Blue Diamond High Body',
        },
        {
            num: '04',
            name: 'Guppy & Tetra',
            slug: 'guppy-albino-full-red-afr-trio',
            image: '/images/products/neon-tetra.jpg',
            trait: 'Neon & Albino Morph',
        },
        {
            num: '05',
            name: 'Aquascape Flora',
            slug: 'anubias-nana-petite-aquascape',
            image: '/images/products/bucephalandra.jpg',
            trait: 'Rare Bucephalandra',
        },
    ];

    return (
        <AppLayout>
            <Head title="Dunia Ikan — Marketplace Ikan Hias, Morph & Aquascape Indonesia" />

            {/* 1. HERO SECTION (Wild World Style: Dark, Lush, Immersive) */}
            <section className="relative bg-[#0E1719] text-white overflow-hidden border-b border-slate-800">
                {/* Background Lush Aquatic Atmosphere with Gradient */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/products/cupang-halfmoon.jpg"
                        alt="Aquatic World Background"
                        className="w-full h-full object-cover object-center opacity-35 scale-105 filter blur-xs"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0E1719] via-[#0E1719]/85 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E1719] via-transparent to-black/40" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-24 lg:py-28">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Hero Text */}
                        <div className="lg:col-span-7 space-y-6">
                            <p className="text-xl sm:text-2xl font-light text-emerald-400 tracking-wide font-sans">
                                Fantastic
                            </p>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
                                Aquatic World
                            </h1>

                            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                                Standar penangkaran dan akreditasi spesimen ikan hias serta mutasi genetik (morph) terpercaya di Indonesia. Transaksi bergaransi hidup (D.O.A) dengan transparansi parameter biologi.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Link
                                    href="/products"
                                    className="px-7 py-3 rounded-lg border-2 border-[#00C882] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#00C882] hover:text-slate-950 transition duration-300 flex items-center gap-2"
                                >
                                    <span>Discover / Jelajahi</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>

                                <Link
                                    href="/guides"
                                    className="px-6 py-3 rounded-lg bg-[#142224]/80 backdrop-blur-xs border border-slate-700/80 text-slate-200 font-bold text-xs uppercase tracking-wider hover:border-[#00C882] hover:text-[#00C882] transition"
                                >
                                    Panduan Kesehatan Ikan
                                </Link>
                            </div>
                        </div>

                        {/* Hero Visual Card / Focal Animal (like green tree python in reference) */}
                        <div className="lg:col-span-5 relative flex justify-center">
                            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl shadow-emerald-950/50 bg-[#142224]/70 backdrop-blur-sm group">
                                <div className="aspect-[4/4] overflow-hidden relative">
                                    <img
                                        src="/images/products/cupang-halfmoon.jpg"
                                        alt="Rosetail Betta Specimen"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E1719] via-transparent to-transparent opacity-80" />
                                    
                                    <div className="absolute bottom-3 left-4 right-4">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="px-2.5 py-1 rounded-md bg-[#00C882] text-slate-950 font-bold text-[11px]">
                                                Grade Kontes ♂
                                            </span>
                                            <span className="text-emerald-300 font-semibold text-xs">
                                                Garansi DOA 100%
                                            </span>
                                        </div>
                                        <p className="font-extrabold text-base text-white mt-1.5">
                                            Betta Halfmoon Rosetail Super Red
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Floating Live Cam & Slider Bar (like reference) */}
                    <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        {/* Live Cam / Video Unboxing Badge */}
                        <div className="flex items-center gap-4 bg-[#142224]/90 border border-slate-700/60 rounded-xl p-2.5 pr-5 max-w-xs shadow-lg">
                            <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                                <img
                                    src="/images/products/channa-maru.jpg"
                                    alt="Live cam preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <div className="w-6 h-6 rounded-full bg-[#00C882] text-slate-950 flex items-center justify-center shadow-xs">
                                        <Play className="w-3 h-3 fill-current ml-0.5" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                    Live Cam & Video
                                </p>
                                <p className="text-[11px] text-slate-400">
                                    Kamera Karantina Penangkar
                                </p>
                            </div>
                        </div>

                        {/* Slider Controls (like 1/3 indicator in reference) */}
                        <div className="flex items-center gap-4 self-end sm:self-auto text-xs font-medium text-slate-400">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full border-2 border-[#00C882] bg-[#00C882]" />
                                <span className="w-2 h-2 rounded-full bg-slate-600" />
                                <span className="w-2 h-2 rounded-full bg-slate-600" />
                            </div>
                            <div className="w-16 h-0.5 bg-slate-700 rounded-full overflow-hidden">
                                <div className="w-1/3 h-full bg-[#00C882]" />
                            </div>
                            <span className="text-slate-300 font-bold">1/3</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. MIDDLE SECTION: FANTASTIC AQUARIUM (White background with mandala art & 3 stats) */}
            <section className="py-20 sm:py-28 bg-white border-b border-slate-200 relative overflow-hidden">
                {/* Subtle Geometric Scale Watermark Texture */}
                <div 
                    className="absolute inset-0 opacity-[0.035] pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(#00C882 1px, transparent 1px), radial-gradient(#00C882 1px, #ffffff 1px)`,
                        backgroundSize: `24px 24px`,
                        backgroundPosition: `0 0, 12px 12px`
                    }}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Left: Artistic Mandala Fish Illustration (matches chameleon line-art in reference) */}
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="w-full max-w-md p-4">
                                <FishMandala className="w-full h-auto drop-shadow-sm" />
                            </div>
                        </div>

                        {/* Right: Section Info, Description & 3 Stats */}
                        <div className="lg:col-span-7 space-y-6">
                            <div>
                                <p className="text-xs font-bold text-[#00C882] uppercase tracking-widest flex items-center gap-2 mb-2">
                                    <span className="w-6 h-0.5 bg-[#00C882] inline-block" />
                                    About Aquarium & Farm
                                </p>
                                <h2 className="text-3xl sm:text-4xl tracking-tight text-slate-900">
                                    <span className="font-extrabold">FANTASTIC</span>{' '}
                                    <span className="font-light text-slate-500">AQUARIUM</span>
                                </h2>
                            </div>

                            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                                Dunia Ikan menghubungkan penghobi akuarium dengan jaringan penangkar ikan hias terverifikasi di seluruh nusantara. Setiap spesimen dicatat dengan data biologi presisi: parameter suhu, rentang pH air, volume tangki minimal, temperamen, hingga mutasi genetika (morph).
                            </p>
                            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                                Pengiriman menggunakan prosedur karantina ketat, kantong oksigen ganda bertekanan tinggi, dan kemasan styrofoam tahan banting dengan garansi hidup 100% sampai tujuan (Live Arrival Guarantee).
                            </p>

                            {/* 3 Prominent Stat Counters (Green numbers like reference: 850, 230, 160.000) */}
                            <div className="pt-4 grid grid-cols-3 gap-6 border-t border-slate-100">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">
                                        Spesies & Morph
                                    </p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-[#00C882] tracking-tight">
                                        850
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">
                                        Penangkar Resmi
                                    </p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-[#00C882] tracking-tight">
                                        230
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">
                                        Komunitas Aktif
                                    </p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-[#00C882] tracking-tight">
                                        160.000
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Link
                                    href="/guides"
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border-2 border-slate-900 text-slate-900 font-extrabold text-xs uppercase tracking-wider hover:bg-slate-900 hover:text-white transition duration-200"
                                >
                                    <span>Pelajari Standar D.O.A.</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. SHOWCASE STRIP (The 5 Vertical Photographic Cards side-by-side like reference) */}
            <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold text-[#00C882] uppercase tracking-widest flex items-center gap-2 mb-2">
                                <span className="w-6 h-0.5 bg-[#00C882] inline-block" />
                                Our Specimens
                            </p>
                            <h2 className="text-2xl sm:text-3xl tracking-tight text-slate-900">
                                <span className="font-extrabold uppercase">IKAN & MORPH</span> <br className="hidden sm:inline" />
                                <span className="font-light text-slate-500 uppercase">DI DUNIA IKAN</span>
                            </h2>
                        </div>

                        {/* Dot Navigation on top-right (like reference) */}
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full border-2 border-[#00C882] flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00C882]" />
                            </span>
                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                        </div>
                    </div>
                </div>

                {/* 5 Vertical Cards Strip */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
                        {showcaseSpecimens.map((specimen) => (
                            <Link
                                key={specimen.num}
                                href={`/products?q=${encodeURIComponent(specimen.name.split(' ')[0])}`}
                                className="group relative aspect-[3/5] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-4"
                            >
                                <img
                                    src={specimen.image}
                                    alt={specimen.name}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

                                <div className="relative z-10 text-white space-y-1">
                                    <p className="text-xs font-mono font-bold text-emerald-400">
                                        {specimen.num}
                                    </p>
                                    <h4 className="text-sm font-extrabold leading-tight text-white group-hover:text-[#00C882] transition-colors">
                                        {specimen.name}
                                    </h4>
                                    <p className="text-[11px] text-slate-300 truncate">
                                        {specimen.trait}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. VERIFIED MARKETPLACE CATALOG (MorphMarket Trait Highlights) */}
            <section className="py-16 sm:py-24 bg-[#F8FAF9] border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                        <div>
                            <span className="text-xs font-bold text-[#00C882] uppercase tracking-widest flex items-center gap-1.5 mb-1">
                                <Sparkles className="w-3.5 h-3.5" />
                                Katalog Terverifikasi
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Spesimen & Produk Pilihan
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                Ikan hias berkualitas dari peternak terakreditasi dengan kebijakan D.O.A.
                            </p>
                        </div>

                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00C882] text-slate-950 font-extrabold text-xs uppercase tracking-wider hover:bg-emerald-400 shadow-sm transition"
                        >
                            <span>Lihat Semua Produk ({stats?.totalFish || 14})</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Product Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                        {featuredFish?.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. SELLER PARTNERSHIP CTA BANNER (Dark wildlife panel) */}
            <section className="py-16 bg-[#0E1719] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl bg-gradient-to-r from-[#142224] to-[#0E1719] border border-emerald-500/30 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                        <div className="space-y-3 max-w-xl text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#00C882]/10 text-[#00C882] text-xs font-bold border border-[#00C882]/30">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Program Kemitraan Penangkar
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Buka Toko Penangkar Ikan Hias Anda
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                Jangkau ribuan aquarist di seluruh Indonesia. Atur garansi D.O.A. toko Anda, catat morfologi genetika, dan nikmati sistem pembayaran aman serta rekonsiliasi resi instan.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                            <Link
                                href="/register"
                                className="px-7 py-3 rounded-lg bg-[#00C882] hover:bg-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 text-center transition"
                            >
                                Daftar Sebagai Penangkar
                            </Link>
                            <Link
                                href="/guides"
                                className="px-6 py-3 rounded-lg border border-slate-700 hover:border-[#00C882] text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider text-center transition"
                            >
                                SOP Pengemasan Ikan
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
