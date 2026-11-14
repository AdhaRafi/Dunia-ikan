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
    SlidersHorizontal,
    ChevronRight,
    Store,
    BookOpen
} from 'lucide-react';

export default function Welcome({ categories, featuredFish, careGuides, featuredStores, stats }) {
    const [selectedTab, setSelectedTab] = useState('all');

    // Trending 4 items (like the 4 portrait cards in the Catalyst reference)
    const trendingItems = featuredFish ? featuredFish.slice(0, 4) : [];

    // Filter items based on quick chips
    const displayedProducts = featuredFish?.filter((item) => {
        if (selectedTab === 'all') return true;
        if (selectedTab === 'freshwater') return item.fish_detail?.water_type === 'freshwater';
        if (selectedTab === 'saltwater') return item.fish_detail?.water_type === 'saltwater';
        if (selectedTab === 'male') return item.fish_detail?.sex === 'male';
        if (selectedTab === 'female') return item.fish_detail?.sex === 'female';
        return true;
    }) || [];

    return (
        <AppLayout>
            <Head title="Dunia Ikan — Marketplace Ikan Hias, Morph & Aquascape" />

            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-10 sm:space-y-12">
                {/* 1. HERO SECTION: Landscape Cinematic Card (like Catalyst Autumn-Winter 2024 Collection) */}
                <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm bg-slate-900 aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/9] min-h-[340px] sm:min-h-[420px] flex items-center">
                    {/* Background Nature / Aquatic Landscape */}
                    <img
                        src="/images/products/cupang-halfmoon.jpg"
                        alt="Autumn-Winter Collection"
                        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
                    />

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    {/* Left Content Overlay (exact Catalyst typography & layout) */}
                    <div className="relative z-10 p-6 sm:p-12 lg:p-14 max-w-xl text-white space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-emerald-300 text-[11px] font-bold border border-white/20">
                            <Sparkles className="w-3 h-3" />
                            <span>AW'24 Eksklusif Morph Selection</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] text-white">
                            Autumn-Winter <br />
                            2024 Collection
                        </h1>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                            Koleksi spesimen mutasi genetik (morph) dan ikan hias kontes pilihan dari penangkar bersertifikasi di seluruh Indonesia. Dilengkapi spesifikasi biologi lengkap dan garansi hidup D.O.A. 100%.
                        </p>

                        <div className="pt-2">
                            <Link
                                href="/products"
                                className="inline-block px-7 py-2.5 rounded-full bg-white text-slate-950 font-extrabold text-xs tracking-wider hover:bg-slate-100 shadow-lg shadow-black/20 transition-all duration-200"
                            >
                                See now
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 2. THE MOST TRENDING SECTION (exact Catalyst "The most trending 100" with 4 portrait cards) */}
                <section className="space-y-6">
                    <div className="flex items-baseline justify-between">
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                            The most trending <span className="text-slate-400 font-normal text-lg sm:text-xl">100</span>
                        </h2>

                        <Link
                            href="/products?sort=popular"
                            className="text-xs font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1 transition"
                        >
                            <span>Lihat semua</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* 4 Portrait Cards Row (Catalyst Studio Style) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {trendingItems.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                {/* 3. PARAMETRIC BIOLOGY FILTER CHIPS (MorphMarket traits) */}
                <section className="border-t border-slate-200/80 pt-10 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                                Jelajahi Berdasarkan Kategori Biologi
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Filter instan berdasarkan tipe air dan jenis kelamin spesimen.
                            </p>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
                            {[
                                { id: 'all', label: 'Semua Koleksi' },
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
                                            ? 'bg-slate-950 text-white font-bold shadow-xs'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Full Product Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                        {displayedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                {/* 4. TRUST & D.O.A. GUARANTEE STRIP */}
                <section className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-xs">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                Garansi Hidup (D.O.A.) 100%
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Standar kemasan beroksigen tinggi dengan jaminan pengembalian dana atau penggantian spesimen jika terjadi kendala dalam perjalanan.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                            <Thermometer className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                Parameter Biologi Akurat
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Setiap mutasi genetik (morph), toleransi suhu, rentang pH, dan volume akuarium dicatat transparan dari peternak terakreditasi.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                            <Store className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                Jaringan Penangkar Resmi
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Terhubung langsung dengan farm ikan hias dan aquascaper profesional di seluruh nusantara tanpa perantara spekulatif.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
