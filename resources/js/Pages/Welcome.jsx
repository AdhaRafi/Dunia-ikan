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
    CheckCircle2
} from 'lucide-react';

export default function Welcome({ categories, featuredFish, careGuides, featuredStores, stats }) {
    const [selectedTab, setSelectedTab] = useState('all');

    // Trending 4 items (Catalyst Studio Cards)
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
            <Head title="Dunia Ikan — Modern Aquatic Lifestyle & Morph Marketplace" />

            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 sm:space-y-12">
                {/* 1. HERO SECTION: Cinematic Coastal Card */}
                <section className="relative rounded-3xl overflow-hidden border border-[#1E80A0]/15 shadow-sm bg-[#001454] min-h-[360px] sm:min-h-[420px] flex items-center">
                    {/* Aquatic Hero Background */}
                    <img
                        src="/images/products/cupang-halfmoon.jpg"
                        alt="Koleksi Spesimen Eksklusif"
                        className="absolute inset-0 w-full h-full object-cover object-right sm:object-center"
                    />

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#001454]/95 via-[#0D2E92]/70 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001454]/80 via-transparent to-transparent" />

                    {/* Content Overlay */}
                    <div className="relative z-10 p-6 sm:p-12 lg:p-14 max-w-lg lg:max-w-xl text-white space-y-4">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#C0ECB8] text-[11px] font-bold border border-white/20">
                            <Sparkles className="w-3.5 h-3.5 text-[#4AB8BD]" />
                            <span>Eksklusif Morph & Kontes Selection</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.08] text-white">
                            Koleksi Spesimen <br />
                            Unggulan 2024
                        </h1>

                        <p className="text-xs sm:text-sm text-[#dde1ff] leading-relaxed">
                            Kurasi mutasi genetik (morph) langka dan ikan hias kontes pilihan langsung dari penangkar bersertifikasi di seluruh Indonesia. Bergaransi hidup D.O.A. 100%.
                        </p>

                        <div className="pt-2">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#0684E5] text-white font-extrabold text-xs tracking-wider hover:bg-[#0060aa] hover:scale-[1.02] shadow-lg shadow-[#0684E5]/30 transition-all duration-200"
                            >
                                <span>Lihat Koleksi</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 2. THE MOST TRENDING SECTION (Catalyst 4 Portrait Studio Cards) */}
                <section className="space-y-6">
                    <div className="flex items-baseline justify-between">
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#001454]">
                            The most trending <span className="text-[#1E80A0] font-normal text-lg sm:text-xl">100</span>
                        </h2>

                        <Link
                            href="/products?sort=popular"
                            className="text-xs font-bold text-[#0684E5] hover:text-[#0060aa] flex items-center gap-1 transition"
                        >
                            <span>Lihat semua</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* 4 Portrait Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {trendingItems.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                {/* 3. PARAMETRIC BIOLOGY FILTER CHIPS (Aqua Teal Interactive Tokens) */}
                <section className="border-t border-[#1E80A0]/10 pt-10 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-[#001454] tracking-tight">
                                Jelajahi Berdasarkan Kategori Biologi
                            </h3>
                            <p className="text-xs text-[#3d4949] mt-0.5">
                                Filter instan berdasarkan tipe perairan dan jenis kelamin spesimen.
                            </p>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
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
                                    className={`px-4 py-2 rounded-full transition whitespace-nowrap ${
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

                    {/* Full Product Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {displayedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                {/* 4. TRUST & D.O.A. GUARANTEE STRIP */}
                <section className="rounded-2xl bg-white border border-[#1E80A0]/10 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-xs">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#f3f2ff] text-[#00696D] flex items-center justify-center shrink-0 border border-[#1E80A0]/15">
                            <ShieldCheck className="w-5 h-5 text-[#00696D]" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-[#001454] uppercase tracking-wider">
                                Garansi Hidup (D.O.A.) 100%
                            </h4>
                            <p className="text-xs text-[#3d4949] mt-1 leading-relaxed">
                                Kemasan beroksigen tinggi dengan garansi pengembalian dana penuh atau penggantian jika ikan bermasalah di perjalanan.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#f3f2ff] text-[#0684E5] flex items-center justify-center shrink-0 border border-[#1E80A0]/15">
                            <Thermometer className="w-5 h-5 text-[#0684E5]" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-[#001454] uppercase tracking-wider">
                                Parameter Biologi Akurat
                            </h4>
                            <p className="text-xs text-[#3d4949] mt-1 leading-relaxed">
                                Setiap mutasi genetik (morph), rentang suhu, pH, dan ukuran akuarium dicatat akurat dari peternak bersertifikat.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#f3f2ff] text-[#1E80A0] flex items-center justify-center shrink-0 border border-[#1E80A0]/15">
                            <Store className="w-5 h-5 text-[#1E80A0]" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-[#001454] uppercase tracking-wider">
                                Jaringan Penangkar Resmi
                            </h4>
                            <p className="text-xs text-[#3d4949] mt-1 leading-relaxed">
                                Terhubung langsung dengan breeder dan aquascaper profesional di seluruh nusantara tanpa perantara spekulatif.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 5. VERIFIED BREEDERS */}
                {featuredStores && featuredStores.length > 0 && (
                    <section className="space-y-6">
                        <div className="flex items-baseline justify-between">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight text-[#001454]">
                                    Penangkar Resmi Terverifikasi
                                </h3>
                                <p className="text-xs text-[#3d4949] mt-0.5">
                                    Farm ikan hias dan breeder spesimen morph dengan reputasi teruji.
                                </p>
                            </div>
                            <Link
                                href="/products"
                                className="text-xs font-bold text-[#0684E5] hover:text-[#0060aa] flex items-center gap-1 transition"
                            >
                                <span>Lihat toko</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {featuredStores.slice(0, 3).map((store) => (
                                <Link
                                    key={store.id}
                                    href={`/stores/${store.slug}`}
                                    className="p-5 rounded-2xl bg-white border border-[#1E80A0]/10 hover:border-[#4AB8BD] hover:shadow-md transition-all space-y-3 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#f3f2ff] flex items-center justify-center font-bold text-[#001454] text-sm group-hover:bg-[#001454] group-hover:text-white transition">
                                            {store.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-bold text-sm text-[#001454] truncate">
                                                {store.name}
                                            </h4>
                                            <p className="text-xs text-[#6d797a] truncate">
                                                {store.city} • Rating {store.rating || '4.9'}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-[#3d4949] line-clamp-2 leading-relaxed">
                                        {store.description || 'Penangkar spesialis ikan hias kontes dan mutasi morph berkualitas tinggi.'}
                                    </p>
                                    <div className="pt-1 flex items-center gap-2 text-[11px] font-bold text-[#00696D]">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Garansi D.O.A. Aktif</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* 6. CARE GUIDES */}
                {careGuides && careGuides.length > 0 && (
                    <section className="space-y-6">
                        <div className="flex items-baseline justify-between">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight text-[#001454]">
                                    Panduan Perawatan & Karantina
                                </h3>
                                <p className="text-xs text-[#3d4949] mt-0.5">
                                    Edukasi esensial menjaga kesehatan dan parameter ekosistem ikan.
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
                                    className="p-5 rounded-2xl bg-white border border-[#1E80A0]/10 hover:border-[#4AB8BD] hover:shadow-md transition-all space-y-2.5 group"
                                >
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#1E80A0] uppercase tracking-wider">
                                        <BookOpen className="w-3.5 h-3.5" />
                                        <span>{guide.category || 'Tips Perawatan'}</span>
                                    </div>
                                    <h4 className="font-bold text-sm text-[#001454] group-hover:text-[#0684E5] transition leading-snug line-clamp-2">
                                        {guide.title}
                                    </h4>
                                    <p className="text-xs text-[#3d4949] line-clamp-2 leading-relaxed">
                                        {guide.excerpt || guide.content?.substring(0, 100)}...
                                    </p>
                                    <div className="pt-1 text-[11px] font-semibold text-[#0684E5]">
                                        Baca panduan selengkapnya →
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
