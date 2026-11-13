import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ProductCard from '@/Components/ProductCard';
import { 
    Fish, 
    Sparkles, 
    ShieldCheck, 
    HeartPulse, 
    Store, 
    ArrowRight, 
    Thermometer, 
    Droplets, 
    Boxes,
    Award
} from 'lucide-react';

export default function Welcome({ categories, featuredFish, careGuides, featuredStores, stats }) {
    return (
        <AppLayout>
            <Head title="Dunia Ikan - Marketplace Ikan Hias, Morph & Aquascape Terpercaya" />

            {/* Hero Section (Coastal-Modern) */}
            <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-white py-16 sm:py-24 border-b border-sky-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Hero Text */}
                        <div className="lg:col-span-7 space-y-6 text-left">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dunia-aqua/10 text-dunia-navy text-xs font-bold border border-dunia-aqua/20">
                                <Sparkles className="w-3.5 h-3.5 text-dunia-aqua" />
                                <span>Marketplace Ikan Hias & Mutasi Genetik (Morph) Pertama Bergaransi DOA</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-dunia-navy leading-[1.15] tracking-tight">
                                Temukan Ikan Hias Impian & Rawat Akuarium dengan{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-dunia-blue via-dunia-marine to-dunia-aqua">
                                    Bantuan AI
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                                Jelajahi ragam spesies dan morfologi pilihan dari penangkar terpercaya di seluruh Indonesia. Dilengkapi spesifikasi biologi lengkap, kebijakan garansi hidup (D.O.A), dan asisten kesehatan ikan berbasis AI.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Link
                                    href="/products"
                                    className="px-7 py-3.5 rounded-2xl bg-dunia-blue text-white font-bold text-sm shadow-lg shadow-dunia-blue/25 hover:bg-sky-600 hover:shadow-dunia-blue/40 transition flex items-center gap-2"
                                >
                                    <Fish className="w-4 h-4" />
                                    Jelajahi Katalog Ikan
                                </Link>

                                <Link
                                    href="/guides"
                                    className="px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-dunia-navy font-bold text-sm hover:border-dunia-aqua hover:bg-sky-50/50 transition flex items-center gap-2"
                                >
                                    <HeartPulse className="w-4 h-4 text-dunia-marine" />
                                    Pusat Panduan Kesehatan
                                </Link>
                            </div>

                            {/* Trust badges (MorphMarket style) */}
                            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg">
                                <div>
                                    <p className="text-xl sm:text-2xl font-extrabold text-dunia-navy">100%</p>
                                    <p className="text-xs text-slate-500 font-medium">Garansi Hidup (DOA)</p>
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-extrabold text-dunia-navy">{stats?.totalFish || 100}+</p>
                                    <p className="text-xs text-slate-500 font-medium">Stok Ikan Aktif</p>
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-extrabold text-dunia-navy">{stats?.totalStores || 10}+</p>
                                    <p className="text-xs text-slate-500 font-medium">Toko Penangkar</p>
                                </div>
                            </div>
                        </div>

                        {/* Hero Visual Card (Showcase Morph) */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-3 shadow-2xl shadow-sky-900/10 border border-sky-100 transform lg:rotate-1 hover:rotate-0 transition duration-300">
                                <div className="aspect-4/5 rounded-2xl overflow-hidden relative bg-slate-900">
                                    <img
                                        src="https://images.unsplash.com/photo-1544943910-4c1dc44a0b27?auto=format&fit=crop&w=800&q=80"
                                        alt="Ikan Cupang Kontes Rosetail"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2.5 py-0.5 rounded-full bg-dunia-aqua text-dunia-navy text-xs font-bold">
                                                Morph: Rosetail Super Red
                                            </span>
                                            <span className="px-2.5 py-0.5 rounded-full bg-blue-600/80 backdrop-blur-xs text-white text-xs font-semibold">
                                                ♂ Jantan Grade A
                                            </span>
                                        </div>
                                        <h3 className="font-extrabold text-xl leading-tight">
                                            Cupang Halfmoon Rosetail Super Red
                                        </h3>
                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20 text-xs">
                                            <span className="text-sky-200">Penangkar: Aquatic Heritage Farm</span>
                                            <span className="font-bold text-dunia-cream text-sm">Rp 175.000</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MorphMarket Core Advantages Banner */}
            <section className="py-10 bg-dunia-soft/60 border-b border-sky-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-sky-100 shadow-xs">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-dunia-blue flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-dunia-navy text-sm">Kebijakan D.O.A. Terverifikasi</h4>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Setiap penjual menetapkan garansi ikan hidup sampai tujuan dengan kemasan standar oksigen bertekanan tinggi.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-sky-100 shadow-xs">
                            <div className="w-12 h-12 rounded-xl bg-teal-50 text-dunia-aqua flex items-center justify-center shrink-0">
                                <Thermometer className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-dunia-navy text-sm">Parameter Air & Biologi Lengkap</h4>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Informasi rentang suhu, pH, volume tank minimal, temperamen, dan jenis kelamin tercatat detail pada setiap ikan.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-sky-100 shadow-xs">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <HeartPulse className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-dunia-navy text-sm">Konsultasi Kesehatan Ikan AI</h4>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Asisten virtual siaga membantu konsultasi awal gejala sakit (White Spot, Fin Rot) berbasis panduan kurasi resmi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Shortcut Grid */}
            <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <span className="text-xs font-bold text-dunia-marine uppercase tracking-wider">Navigasi Cepat</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-dunia-navy mt-1">Kategori Produk</h2>
                    </div>
                    <Link href="/products" className="text-xs font-bold text-dunia-blue hover:text-sky-700 flex items-center gap-1">
                        Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {categories?.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/products?category=${cat.slug}`}
                            className="p-5 rounded-2xl bg-white border border-sky-100 hover:border-dunia-aqua hover:shadow-md hover:shadow-sky-100 transition flex flex-col items-center text-center group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-dunia-marine flex items-center justify-center group-hover:scale-110 group-hover:bg-dunia-blue group-hover:text-white transition duration-200 mb-3">
                                <Fish className="w-7 h-7" />
                            </div>
                            <h3 className="font-bold text-sm text-slate-900 group-hover:text-dunia-blue transition">
                                {cat.name}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                {cat.products_count ?? 0} Produk
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Fish Listing (MorphMarket Style) */}
            <section className="py-14 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-dunia-blue text-xs font-bold mb-2">
                                <Award className="w-3.5 h-3.5" />
                                <span>Pilihan Penangkar Terkurasi</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-dunia-navy">
                                Koleksi Ikan Hias & Mutasi Morph Terbaru
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Dapatkan ikan hias sehat dengan mutasi genetik berkualitas langsung dari pembudidaya.
                            </p>
                        </div>

                        <Link
                            href="/products?category=ikan-hias"
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-dunia-blue hover:text-sky-700 transition"
                        >
                            Lihat Semua Ikan <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                        {featuredFish?.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Care Guides & Knowledge Base Preview */}
            <section className="py-16 bg-dunia-soft/40 border-t border-sky-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <span className="text-xs font-bold text-dunia-marine uppercase tracking-wider">Edukasi & Perawatan</span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-dunia-navy mt-1">
                                Panduan Kesehatan Ikan & Kualitas Air
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Basis pengetahuan resmi yang juga menjadi rujukan Asisten AI Dunia Ikan.
                            </p>
                        </div>
                        <Link href="/guides" className="text-xs font-bold text-dunia-blue hover:text-sky-700 flex items-center gap-1">
                            Buka Semua Panduan <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {careGuides?.map((guide) => (
                            <Link
                                key={guide.id}
                                href={`/guides/${guide.id}`}
                                className="bg-white p-6 rounded-2xl border border-sky-100 hover:border-dunia-aqua/60 hover:shadow-lg hover:shadow-sky-100/50 transition flex flex-col justify-between group"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="px-2.5 py-1 rounded-md bg-sky-50 text-dunia-navy font-semibold">
                                            {guide.category}
                                        </span>
                                        <span className="text-slate-400 font-medium">
                                            {guide.fish_type}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-base text-slate-900 group-hover:text-dunia-blue transition line-clamp-2">
                                        {guide.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                                        {guide.symptoms}
                                    </p>
                                </div>

                                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-dunia-marine group-hover:text-dunia-blue">
                                    <span>Baca Langkah Penanganan</span>
                                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Seller Call To Action */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl bg-gradient-to-r from-dunia-navy via-dunia-marine to-dunia-blue p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
                    <div className="relative z-10 max-w-2xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-dunia-cream text-xs font-bold border border-white/20">
                            <Store className="w-3.5 h-3.5" />
                            <span>Buka Toko Penangkar Ikan</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                            Apakah Anda Pembudidaya atau Penjual Ikan Hias?
                        </h2>
                        <p className="text-sm sm:text-base text-sky-100 leading-relaxed">
                            Jangkau ribuan penghobi ikan dan aquarist di seluruh Indonesia. Atur garansi hidup (DOA) toko Anda sendiri, kelola stok morfologi secara presisi, dan nikmati sistem pesanan yang aman.
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/seller/register"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-dunia-navy font-bold text-sm shadow-md hover:bg-sky-50 transition"
                            >
                                Daftarkan Toko Sekarang
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
