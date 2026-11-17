import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useLanguage } from '@/lib/i18n';
import {
    estimateReadingMinutes,
    getCategoryBadgeMeta,
    getGuideImage,
    parseCareSteps,
} from '@/lib/guideMeta';
import {
    ArrowRight,
    BookOpen,
    ChevronRight,
    Clock,
    Fish,
    ListChecks,
    MessageSquare,
    RotateCcw,
    Search,
    X,
} from 'lucide-react';

const SPECIES_TOPICS = [
    {
        labelId: 'Cupang',
        labelEn: 'Betta',
        subtitleId: 'Fin rot, ketapang & karantina',
        subtitleEn: 'Fin rot, almond leaf & quarantine',
        query: 'Cupang',
        image: '/images/products/cupang-halfmoon.jpg',
        alt: 'Cupang halfmoon super red',
    },
    {
        labelId: 'Guppy',
        labelEn: 'Guppy',
        subtitleId: 'Swim bladder & parasit halus',
        subtitleEn: 'Swim bladder & microscopic parasites',
        query: 'Guppy',
        image: '/images/products/guppy-albino-full-red.jpg',
        alt: 'Guppy albino full red',
    },
    {
        labelId: 'Channa',
        labelEn: 'Channa',
        subtitleId: 'Luka sirip, adaptasi & mental',
        subtitleEn: 'Fin injuries, acclimation & temperament',
        query: 'Channa',
        image: '/images/products/channa-maru.jpg',
        alt: 'Channa marulioides',
    },
    {
        labelId: 'Kualitas Air',
        labelEn: 'Water Quality',
        subtitleId: 'Siklus nitrogen, amonia & pH',
        subtitleEn: 'Nitrogen cycle, ammonia & pH balance',
        query: 'Air Tawar',
        image: '/images/products/aquarium-rimless.jpg',
        alt: 'Akuarium air tawar',
    },
];

export default function Index({
    guides,
    categories = [],
    categoryCounts = {},
    totalGuides = 0,
    filters = {},
}) {
    const { pick, isEn, trGuideCategory } = useLanguage();
    const [search, setSearch] = useState(filters?.q || '');
    const [selectedCategory, setSelectedCategory] = useState(
        filters?.category || '',
    );

    const hasActiveFilter = Boolean(filters?.q || selectedCategory);
    const effectiveTotal = totalGuides || guides?.total || 0;

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            '/guides',
            { q: search.trim(), category: selectedCategory },
            { preserveState: true },
        );
    };

    const handleCategoryClick = (category) => {
        const next = selectedCategory === category ? '' : category;
        setSelectedCategory(next);
        router.get(
            '/guides',
            { q: search.trim(), category: next },
            { preserveState: true },
        );
    };

    const handleReset = () => {
        setSearch('');
        setSelectedCategory('');
        router.get('/guides');
    };

    return (
        <AppLayout>
            <Head title={pick('Panduan Kesehatan Ikan — Dunia Ikan', 'Fish Care & Health Guides — Dunia Ikan')}>
                <meta
                    head-key="description"
                    name="description"
                    content={pick(
                        'Kumpulan panduan diagnosa penyakit ikan hias, karantina, kualitas air, dan perawatan dari aquarist Dunia Ikan.',
                        'Curated fish health guides covering disease symptoms, quarantine, and water quality care from Dunia Ikan.',
                    )}
                />
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-9 space-y-8 sm:space-y-10">
                {/* 1. Editorial Knowledge Hub Hero */}
                <section className="rounded-[24px] sm:rounded-[28px] bg-[#f4f5f7] dark:bg-[#0e1424] border border-slate-200/75 dark:border-slate-800/90 px-5 sm:px-9 lg:px-11 py-7 sm:py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-9 items-center">
                        <div className="lg:col-span-8 space-y-5">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-[#131d33] border border-slate-200/80 dark:border-slate-700 px-3 py-1 text-[11px] font-bold text-[#001454] dark:text-sky-300 shadow-2xs">
                                    <BookOpen className="w-3.5 h-3.5 text-[#0684E5]" />
                                    {pick('Pusat Edukasi Aquarist', 'Aquarist Knowledge Hub')}
                                </span>
                                <span className="inline-flex items-center rounded-full bg-[#0684E5]/10 text-[#0684E5] dark:bg-sky-500/15 dark:text-sky-300 px-3 py-1 text-[11px] font-bold tabular-nums">
                                    {effectiveTotal} {pick('panduan aktif', 'active guides')}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-mask text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] leading-[1.12] text-[#001454] dark:text-white">
                                    <span className="text-mask-inner">
                                        {pick('Panduan Perawatan & Diagnosa Ikan', 'Fish Care & Health Guides')}
                                    </span>
                                </h1>
                                <p className="text-mask text-xs sm:text-[15px] leading-relaxed text-slate-600 dark:text-slate-400 max-w-[58ch]">
                                    <span className="text-mask-inner text-mask-delay-1">
                                        {pick(
                                            'Gejala klinis, pemicu kualitas air, dan langkah pertolongan pertama untuk menjaga ikan hias tetap sehat sejak hari pertama karantina.',
                                            'Clinical symptoms, water quality triggers, and step-by-step first aid to keep ornamental fish thriving from day one of quarantine.',
                                        )}
                                    </span>
                                </p>
                            </div>

                            {/* Search Bar */}
                            <form
                                onSubmit={handleSearch}
                                className="flex flex-col sm:flex-row gap-2.5 max-w-2xl pt-1"
                            >
                                <div className="relative flex-1 flex items-center rounded-2xl bg-white dark:bg-[#131d33] border border-slate-200 dark:border-slate-700/80 shadow-xs focus-within:border-[#0684E5] focus-within:ring-2 focus-within:ring-[#0684E5]/15 transition">
                                    <Search className="ml-4 w-4 h-4 text-slate-400 shrink-0" />
                                    <input
                                        type="search"
                                        placeholder={pick(
                                            'Cari penyakit, gejala (bintik putih, sirip robek), atau ikan...',
                                            'Search diseases, symptoms (white spot, fin rot), or species...',
                                        )}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full h-11 sm:h-12 bg-transparent border-0 px-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0"
                                    />
                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearch('');
                                                router.get('/guides', {
                                                    category: selectedCategory,
                                                });
                                            }}
                                            aria-label={pick('Hapus kata kunci', 'Clear search')}
                                            className="mr-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="h-11 sm:h-12 px-6 rounded-2xl bg-[#001454] hover:bg-[#0684E5] dark:bg-[#0684E5] dark:hover:bg-sky-400 text-white dark:hover:text-slate-950 font-bold text-xs sm:text-[13px] transition shrink-0 shadow-sm"
                                >
                                    {pick('Cari Panduan', 'Search Guides')}
                                </button>
                            </form>

                            {/* Category Pills */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => handleCategoryClick('')}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition border ${
                                        selectedCategory === ''
                                            ? 'bg-[#001454] text-white border-[#001454] dark:bg-white dark:text-slate-950 dark:border-white'
                                            : 'bg-white dark:bg-[#131d33] text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:border-[#0684E5]'
                                    }`}
                                >
                                    {pick('Semua', 'All')} ({effectiveTotal})
                                </button>
                                {categories.map((category) => {
                                    const active = selectedCategory === category;
                                    const count = categoryCounts?.[category];
                                    return (
                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() => handleCategoryClick(category)}
                                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition border ${
                                                active
                                                    ? 'bg-[#0684E5] text-white border-[#0684E5]'
                                                    : 'bg-white dark:bg-[#131d33] text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:border-[#0684E5]'
                                            }`}
                                        >
                                            {trGuideCategory(category)}
                                            {typeof count === 'number' && (
                                                <span
                                                    className={`ml-1.5 tabular-nums ${
                                                        active
                                                            ? 'text-white/85'
                                                            : 'text-slate-400 dark:text-slate-500'
                                                    }`}
                                                >
                                                    {count}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                                {hasActiveFilter && (
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Quick Triage Steps Summary */}
                        <div className="lg:col-span-4 hidden lg:block">
                            <div className="rounded-2xl bg-white dark:bg-[#131d33] border border-slate-200/80 dark:border-slate-800 p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-3">
                                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    {pick('Alur Tanggap Cepat', 'Quick Triage Steps')}
                                </p>
                                {[
                                    {
                                        step: '01',
                                        title: pick('Amati Gejala Fisik', 'Spot Physical Symptoms'),
                                        desc: pick('Cek bintik putih, sirip robek, atau gaya renang.', 'Check white spots, fin tears, or swimming balance.'),
                                    },
                                    {
                                        step: '02',
                                        title: pick('Stabilkan Suhu & Air', 'Stabilize Water & Temp'),
                                        desc: pick('Pisahkan ke tank karantina dan cek amonia.', 'Move to a quarantine tank and test ammonia.'),
                                    },
                                    {
                                        step: '03',
                                        title: pick('Terapkan Dosis Tepat', 'Apply Measured Dosage'),
                                        desc: pick('Ikuti takaran garam ikan atau ketapang per liter.', 'Follow salt or almond leaf dosage per liter.'),
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.step}
                                        className="flex items-start gap-3 rounded-xl bg-[#f8fafc] dark:bg-[#0e1424] px-3 py-2.5 border border-slate-100 dark:border-slate-800/80"
                                    >
                                        <span className="text-[11px] font-extrabold text-[#0684E5] tabular-nums mt-0.5">
                                            {item.step}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-[#001454] dark:text-white leading-tight">
                                                {item.title}
                                            </p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Quick Species & Topic Bento Strip */}
                <section className="space-y-3.5">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-[#001454] dark:text-white">
                            {pick('Jelajahi Berdasarkan Topik', 'Browse by Topic')}
                        </h2>
                        <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
                            {pick('Filter cepat spesies & ekosistem tank', 'Quick filters for species & tank care')}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        {SPECIES_TOPICS.map((topic, idx) => {
                            const isSelected =
                                filters?.q?.toLowerCase() ===
                                topic.query.toLowerCase();
                            const label = isEn ? topic.labelEn : topic.labelId;
                            const subtitle = isEn ? topic.subtitleEn : topic.subtitleId;
                            return (
                                <Link
                                    key={topic.labelId}
                                    href={`/guides?q=${encodeURIComponent(topic.query)}`}
                                    style={{ '--overlap-i': idx }}
                                    className={`overlap-enter card-hover-subtle group flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#0e1424] border shadow-[0_2px_8px_rgba(15,23,42,0.03)] ${
                                        isSelected
                                            ? 'border-[#0684E5] ring-1 ring-[#0684E5]/40'
                                            : 'border-slate-200/80 dark:border-slate-800 hover:border-[#0684E5]/60'
                                    }`}
                                >
                                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                                        <img
                                            src={topic.image}
                                            alt={topic.alt}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-[#001454] dark:text-white group-hover:text-[#0684E5] dark:group-hover:text-sky-400 transition truncate">
                                            {label}
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                            {subtitle}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-[#0684E5] group-hover:translate-x-0.5 transition shrink-0" />
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* 3. Structured Care Guides Grid */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-[#001454] dark:text-white">
                            {filters?.q
                                ? pick(`Hasil untuk "${filters.q}"`, `Results for "${filters.q}"`)
                                : selectedCategory
                                  ? trGuideCategory(selectedCategory)
                                  : pick('Semua Panduan Perawatan', 'All Care Guides')}
                        </h2>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
                            {pick(
                                `Menampilkan ${guides?.data?.length ?? 0} dari ${guides?.total ?? 0}`,
                                `Showing ${guides?.data?.length ?? 0} of ${guides?.total ?? 0}`,
                            )}
                        </span>
                    </div>

                    {guides?.data?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {guides.data.map((guide, idx) => {
                                const badgeMeta = getCategoryBadgeMeta(
                                    guide.category,
                                );
                                const readMinutes =
                                    estimateReadingMinutes(guide);
                                const steps = parseCareSteps(
                                    guide.care_instructions,
                                );
                                const coverImage = getGuideImage(guide);

                                return (
                                    <Link
                                        key={guide.id}
                                        href={`/guides/${guide.id}`}
                                        style={{ '--overlap-i': idx }}
                                        className="overlap-enter card-hover group flex flex-col rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-slate-800 hover:border-[#0684E5]/60 dark:hover:border-sky-500/50 shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-hidden"
                                    >
                                        <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-900 overflow-hidden border-b border-slate-100 dark:border-slate-800/80">
                                            <img
                                                src={coverImage}
                                                alt={guide.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
                                            <span
                                                className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-xs bg-white/90 dark:bg-slate-900/90 ${badgeMeta.badgeClass}`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${badgeMeta.dotClass}`}
                                                />
                                                {trGuideCategory(guide.category)}
                                            </span>
                                        </div>

                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                                                <span className="inline-flex items-center gap-1 font-medium truncate">
                                                    <Fish className="w-3.5 h-3.5 text-[#0684E5] shrink-0" />
                                                    <span className="truncate">
                                                        {guide.fish_type}
                                                    </span>
                                                </span>
                                                <span className="inline-flex items-center gap-1 shrink-0 tabular-nums">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {readMinutes} {pick('mnt baca', 'min read')}
                                                </span>
                                            </div>

                                            <h3 className="mt-2.5 text-base sm:text-[17px] font-bold tracking-tight text-[#001454] dark:text-white group-hover:text-[#0684E5] dark:group-hover:text-sky-400 leading-snug line-clamp-2 transition-colors">
                                                {guide.title}
                                            </h3>

                                            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2 flex-1">
                                                {guide.symptoms}
                                            </p>

                                            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/90 flex items-center justify-between gap-2 text-xs">
                                                <span className="inline-flex items-center gap-1 font-medium text-slate-500 dark:text-slate-400">
                                                    <ListChecks className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                                    {steps.length > 0
                                                        ? pick(`${steps.length} langkah penanganan`, `${steps.length} care steps`)
                                                        : pick('Panduan lengkap', 'Full guide')}
                                                </span>
                                                <span className="inline-flex items-center gap-1 font-bold text-[#0684E5] dark:text-sky-400">
                                                    {pick('Baca', 'Read')}
                                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-slate-800 p-8 sm:p-10 text-center space-y-3">
                            <p className="text-base sm:text-lg font-bold text-[#001454] dark:text-white">
                                {pick('Tidak ada panduan yang cocok', 'No matching guides found')}
                            </p>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                {pick(
                                    'Coba gunakan kata kunci gejala yang lebih umum atau reset filter kategori untuk melihat semua artikel.',
                                    'Try broader symptom keywords or reset the category filter to view all articles.',
                                )}
                            </p>
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#001454] hover:bg-[#0684E5] text-white text-xs font-bold transition"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    {pick('Reset Pencarian', 'Reset Search')}
                                </button>
                            </div>
                        </div>
                    )}

                    {guides?.links?.length > 3 && (
                        <nav
                            className="pt-4 flex flex-wrap justify-center gap-1.5"
                            aria-label={pick('Halaman panduan', 'Guide pagination')}
                        >
                            {guides.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    preserveScroll
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                    className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-xs font-semibold transition border ${
                                        link.active
                                            ? 'bg-[#0684E5] text-white border-[#0684E5]'
                                            : link.url
                                              ? 'bg-white dark:bg-[#0e1424] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#0684E5]'
                                              : 'cursor-not-allowed bg-slate-50 dark:bg-[#0b101d] text-slate-300 dark:text-slate-600 border-slate-200/60 dark:border-slate-800/60'
                                    }`}
                                />
                            ))}
                        </nav>
                    )}
                </section>

                {/* 4. Kiko Consultation CTA Banner */}
                <section className="rounded-3xl bg-[#0f172a] dark:bg-[#111a30] border border-slate-800 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="space-y-1.5">
                        <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                            {pick('Gejala Ikan Belum Ketemu di Daftar?', "Can't Find Your Fish's Symptoms Here?")}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                            {pick(
                                'Ceritakan kondisi akuarium dan perilaku ikan ke Kiko AI untuk rekomendasi langkah darurat dan produk karantina yang relevan.',
                                'Describe your tank conditions and fish behavior to Kiko AI for instant emergency steps and quarantine product picks.',
                            )}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() =>
                            window.dispatchEvent(
                                new CustomEvent('dunia-ikan:open-chat'),
                            )
                        }
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#0f172a] font-bold text-xs hover:bg-slate-100 transition whitespace-nowrap self-start sm:self-auto"
                    >
                        <MessageSquare className="w-3.5 h-3.5 text-[#0684E5]" />
                        {pick('Tanya Kiko Sekarang', 'Ask Kiko Now')}
                    </button>
                </section>
            </div>
        </AppLayout>
    );
}
