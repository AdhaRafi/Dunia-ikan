import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { HeartPulse, Search, BookOpen, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export default function Index({ guides, categories, filters }) {
    const [search, setSearch] = useState(filters?.q || '');
    const [selectedCategory, setSelectedCategory] = useState(filters?.category || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/guides', { q: search, category: selectedCategory }, { preserveState: true });
    };

    const handleCategoryClick = (cat) => {
        const newCat = selectedCategory === cat ? '' : cat;
        setSelectedCategory(newCat);
        router.get('/guides', { q: search, category: newCat }, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="Pusat Panduan Kesehatan & Perawatan Ikan - Dunia Ikan" />

            {/* Header */}
            <div className="bg-gradient-to-b from-sky-50 to-white py-12 border-b border-sky-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-dunia-aqua/10 text-dunia-navy text-xs font-bold border border-dunia-aqua/20">
                        <HeartPulse className="w-3.5 h-3.5 text-dunia-aqua" />
                        <span>Basis Pengetahuan Resmi & Rujukan Asisten AI</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-dunia-navy tracking-tight">
                        Pusat Panduan Kesehatan Ikan & Kualitas Air
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Pelajari gejala penyakit ikan air tawar, kemungkinan penyebab, langkah penanganan pertama (karantina, garam, suhu), serta tips pencegahan.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-lg mx-auto relative pt-2">
                        <input
                            type="text"
                            placeholder="Cari penyakit (e.g. White Spot, Fin Rot, Kembung)..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-sky-200 shadow-sm focus:outline-hidden focus:border-dunia-aqua focus:ring-2 focus:ring-dunia-aqua/20 text-sm"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-5.5" />
                    </form>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => handleCategoryClick('')}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                                selectedCategory === ''
                                    ? 'bg-dunia-blue text-white shadow-xs'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-sky-50'
                            }`}
                        >
                            Semua Kategori
                        </button>
                        {categories?.map((cat, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleCategoryClick(cat)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                                    selectedCategory === cat
                                        ? 'bg-dunia-blue text-white shadow-xs'
                                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-sky-50'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Guides Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {guides?.data?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {guides.data.map((guide) => (
                            <Link
                                key={guide.id}
                                href={`/guides/${guide.id}`}
                                className="bg-white p-6 rounded-2xl border border-sky-100 hover:border-dunia-aqua/60 hover:shadow-lg hover:shadow-sky-100/50 transition flex flex-col justify-between group"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="px-2.5 py-0.5 rounded-md bg-sky-50 text-dunia-navy font-bold">
                                            {guide.category}
                                        </span>
                                        <span className="text-slate-400 font-medium">
                                            {guide.fish_type}
                                        </span>
                                    </div>

                                    <h2 className="font-extrabold text-base text-slate-900 group-hover:text-dunia-blue transition leading-snug">
                                        {guide.title}
                                    </h2>

                                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                                        {guide.symptoms}
                                    </p>
                                </div>

                                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-dunia-marine group-hover:text-dunia-blue">
                                    <span>Lihat Penanganan Lengkap</span>
                                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 text-slate-500 text-sm">
                        Tidak ada panduan yang cocok dengan kriteria pencarian Anda.
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
