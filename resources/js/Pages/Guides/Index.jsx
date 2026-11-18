import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    AquaticBannerOrnaments,
    SectionWaveDivider,
} from '@/Components/AquaticMotifs';
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
        image: '/images/categories/cupang.jpg',
        alt: 'Ikan Cupang Halfmoon',
        isCutout: true,
    },
    {
        labelId: 'Guppy',
        labelEn: 'Guppy',
        subtitleId: 'Swim bladder & parasit halus',
        subtitleEn: 'Swim bladder & microscopic parasites',
        query: 'Guppy',
        image: '/images/categories/guppy.jpg',
        alt: 'Ikan Guppy Albino Full Red',
        isCutout: true,
    },
    {
        labelId: 'Channa',
        labelEn: 'Channa',
        subtitleId: 'Luka sirip, adaptasi & mental',
        subtitleEn: 'Fin injuries, acclimation & temperament',
        query: 'Channa',
        image: '/images/categories/channa.jpg',
        alt: 'Ikan Channa Maru',
        isCutout: true,
    },
    {
        labelId: 'Kualitas Air',
        labelEn: 'Water Quality',
        subtitleId: 'Siklus nitrogen, amonia & pH',
        subtitleEn: 'Nitrogen cycle, ammonia & pH balance',
        query: 'Air Tawar',
        image: '/images/banners/air-tawar.jpg',
        alt: 'Akuarium air tawar terawat',
        isCutout: false,
    },
];

export default function Index({
    guides,
    popularGuides = [],
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
    const featuredList =
        popularGuides?.length > 0
            ? popularGuides.slice(0, 3)
            : guides?.data?.slice(0, 3) || [];

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

    const handleShowAllCatalog = () => {
        const listEl = document.getElementById('daftar-panduan');
        if (hasActiveFilter) {
            setSearch('');
            setSelectedCategory('');
            router.get('/guides', {}, { preserveScroll: false });
            return;
        }
        listEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <AppLayout>
            <Head
                title={pick(
                    'Panduan Kesehatan Ikan — Dunia Ikan',
                    'Fish Care & Health Guides — Dunia Ikan',
                )}
            >
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
                {/* 1. Aquascape Photo Backdrop + Frosted Glass Hero Panel */}
                <section className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] bg-[#060f1d] border border-slate-200/80 dark:border-slate-800 shadow-[0_14px_40px_-16px_rgba(0,20,84,0.28)] p-3.5 sm:p-6 lg:p-9">
                    <img
                        src="/images/hero/aquarium-poster.webp"
                        alt={pick(
                            'Akuarium aquascape dengan ikan hias',
                            'Planted aquascape aquarium with ornamental fish',
                        )}
                        className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/15 to-black/40 pointer-events-none"
                    />

                    <div className="relative z-10 rounded-2xl sm:rounded-[22px] bg-[#071124]/65 backdrop-blur-md border border-white/18 p-5 sm:p-7 lg:p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.55)]">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                            {/* Left Column: Search & Category Filters */}
                            <div className="lg:col-span-8 space-y-4 sm:space-y-5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#001454] px-3 py-1 text-[11px] font-bold shadow-2xs">
                                        <BookOpen className="w-3.5 h-3.5 text-[#0684E5]" />
                                        {pick('Pusat Edukasi Akuatik', 'Aquatic Care Library')}
                                    </span>
                                    <span className="inline-flex items-center rounded-full bg-white/15 text-white border border-white/20 px-3 py-1 text-[11px] font-bold tabular-nums">
                                        {effectiveTotal} {pick('panduan aktif', 'active guides')}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <h1 className="text-mask text-2xl sm:text-3xl lg:text-[36px] font-extrabold tracking-[-0.03em] leading-[1.12] text-white">
                                        <span className="text-mask-inner">
                                            {pick(
                                                'Panduan Perawatan & Diagnosa Ikan',
                                                'Fish Care & Health Guides',
                                            )}
                                        </span>
                                    </h1>
                                    <p className="text-mask text-xs sm:text-[14px] leading-relaxed text-slate-200 max-w-[54ch]">
                                        <span className="text-mask-inner text-mask-delay-1">
                                            {pick(
                                                'Kenali gejala penyakit, cek parameter air, dan ikuti langkah karantina harian untuk menjaga ikan hias tetap sehat.',
                                                'Spot early clinical signs, balance water quality, and follow practical quarantine steps for healthier fish.',
                                            )}
                                        </span>
                                    </p>
                                </div>

                                {/* Search Bar */}
                                <form
                                    onSubmit={handleSearch}
                                    className="flex flex-col sm:flex-row gap-2.5 max-w-2xl"
                                >
                                    <div className="relative flex-1 flex items-center rounded-xl sm:rounded-2xl bg-white border border-white/80 shadow-xs focus-within:ring-2 focus-within:ring-[#4AB8BD] transition">
                                        <Search className="ml-4 w-4 h-4 text-slate-400 shrink-0" />
                                        <input
                                            type="search"
                                            placeholder={pick(
                                                'Cari penyakit, gejala (bintik putih, sirip robek), atau ikan...',
                                                'Search diseases, symptoms (white spot, fin rot), or fish...',
                                            )}
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            className="w-full h-11 sm:h-12 bg-transparent border-0 px-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0"
                                        />
                                        {search && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSearch('');
                                                    router.get('/guides', {
                                                        category:
                                                            selectedCategory,
                                                    });
                                                }}
                                                aria-label={pick(
                                                    'Hapus kata kunci',
                                                    'Clear search',
                                                )}
                                                className="mr-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        className="h-11 sm:h-12 px-6 rounded-xl sm:rounded-2xl bg-[#001454] hover:bg-[#0684E5] border border-white/15 text-white font-bold text-xs sm:text-[13px] transition shrink-0 shadow-sm"
                                    >
                                        {pick('Cari Panduan', 'Search Guides')}
                                    </button>
                                </form>

                                {/* Category Pills */}
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5">
                                    <button
                                        type="button"
                                        onClick={() => handleCategoryClick('')}
                                        className={`px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition border ${
                                            selectedCategory === ''
                                                ? 'bg-[#001454] text-white border-white/30'
                                                : 'bg-white/95 hover:bg-white text-[#001454] border-white/25'
                                        }`}
                                    >
                                        {pick('Semua', 'All')} ({effectiveTotal})
                                    </button>
                                    {categories.map((category) => {
                                        const active =
                                            selectedCategory === category;
                                        const count =
                                            categoryCounts?.[category];
                                        return (
                                            <button
                                                key={category}
                                                type="button"
                                                onClick={() =>
                                                    handleCategoryClick(
                                                        category,
                                                    )
                                                }
                                                className={`px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition border ${
                                                    active
                                                        ? 'bg-[#0684E5] text-white border-[#0684E5]'
                                                        : 'bg-white/95 hover:bg-white text-[#001454] border-white/25'
                                                }`}
                                            >
                                                {trGuideCategory(category)}
                                                {typeof count === 'number' && (
                                                    <span
                                                        className={`ml-1.5 tabular-nums ${
                                                            active
                                                                ? 'text-white/85'
                                                                : 'text-slate-400'
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
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-rose-600/90 hover:bg-rose-600 text-white transition"
                                        >
                                            <RotateCcw className="w-3 h-3" />
                                            Reset
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Nested Popular Guides Card */}
                            <aside className="lg:col-span-4 rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/90 dark:border-slate-700/80 p-4 sm:p-5 shadow-md space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        {pick('Artikel Terpopuler', 'Popular Guides')}
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={handleShowAllCatalog}
                                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0684E5] dark:text-[#4AB8BD] hover:underline shrink-0"
                                    >
                                        {pick('Lihat Semua', 'View All')}
                                        <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {featuredList.map((item, idx) => (
                                        <Link
                                            key={item.id}
                                            href={`/guides/${item.id}`}
                                            className="group flex items-start gap-3 rounded-xl bg-[#f8fafc] hover:bg-[#edf5fd] dark:bg-[#131d33] dark:hover:bg-[#182644] px-3 py-2.5 border border-slate-100 dark:border-slate-800/80 transition"
                                        >
                                            <span className="text-[11px] font-extrabold text-[#0684E5] dark:text-[#4AB8BD] tabular-nums mt-0.5 shrink-0">
                                                {String(idx + 1).padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold text-[#001454] dark:text-white group-hover:text-[#0684E5] dark:group-hover:text-[#4AB8BD] leading-snug line-clamp-1 transition-colors">
                                                    {item.title}
                                                </p>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-1 mt-0.5">
                                                    {item.symptoms ||
                                                        item.fish_type}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                        {pick(
                                            'Butuh cek gejala cepat?',
                                            'Need quick triage?',
                                        )}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            window.dispatchEvent(
                                                new CustomEvent(
                                                    'dunia-ikan:open-chat',
                                                ),
                                            )
                                        }
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf5fd] hover:bg-[#0684E5] text-[#001454] hover:text-white dark:bg-[#131d33] dark:text-[#4AB8BD] dark:hover:bg-[#4AB8BD] dark:hover:text-[#001454] font-bold text-[11px] transition shrink-0"
                                    >
                                        <MessageSquare className="w-3 h-3" />
                                        {pick('Tanya Kiko', 'Ask Kiko')}
                                    </button>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>

                {/* 2. Browse by Fish Species & Topic */}
                <section className="space-y-3.5">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                            <span className="w-1 h-5 rounded-full bg-[#0684E5] dark:bg-[#4AB8BD]" />
                            <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-[#001454] dark:text-white">
                                {pick('Jelajahi Berdasarkan Topik', 'Browse by Topic')}
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={handleShowAllCatalog}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#0684E5] dark:text-[#4AB8BD] hover:underline"
                        >
                            {pick('Semua Topik', 'All Topics')}
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        {SPECIES_TOPICS.map((topic, idx) => {
                            const isSelected =
                                filters?.q?.toLowerCase() ===
                                topic.query.toLowerCase();
                            const label = isEn ? topic.labelEn : topic.labelId;
                            const subtitle = isEn
                                ? topic.subtitleEn
                                : topic.subtitleId;
                            return (
                                <Link
                                    key={topic.labelId}
                                    href={`/guides?q=${encodeURIComponent(topic.query)}`}
                                    style={{ '--overlap-i': idx }}
                                    className={`overlap-enter card-hover-subtle group flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#0e1424] border shadow-[0_2px_10px_rgba(0,20,84,0.03)] ${
                                        isSelected
                                            ? 'border-[#0684E5] ring-1 ring-[#0684E5]/40'
                                            : 'border-slate-200/80 dark:border-slate-800 hover:border-[#0684E5]/60 dark:hover:border-[#4AB8BD]/60'
                                    }`}
                                >
                                    <div
                                        className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 ${
                                            topic.isCutout
                                                ? 'bg-white border border-slate-100 dark:border-slate-700/70 p-1 flex items-center justify-center'
                                                : 'bg-slate-100 dark:bg-slate-800'
                                        }`}
                                    >
                                        <img
                                            src={topic.image}
                                            alt={topic.alt}
                                            loading="lazy"
                                            className={`w-full h-full group-hover:scale-105 transition-transform duration-300 ${
                                                topic.isCutout
                                                    ? 'object-contain'
                                                    : 'object-cover'
                                            }`}
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-[#001454] dark:text-white group-hover:text-[#0684E5] dark:group-hover:text-[#4AB8BD] transition truncate">
                                            {label}
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                            {subtitle}
                                        </p>
                                    </div>
                                    <span className="w-8 h-8 rounded-full bg-[#edf5fd] dark:bg-[#131d33] text-[#0684E5] dark:text-[#4AB8BD] flex items-center justify-center shrink-0 group-hover:bg-[#0684E5] group-hover:text-white dark:group-hover:bg-[#4AB8BD] dark:group-hover:text-[#001454] transition">
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* 3. Structured Care Guides Grid */}
                <section id="daftar-panduan" className="scroll-mt-24 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-[#001454] dark:text-white">
                            {filters?.q
                                ? pick(
                                      `Hasil untuk "${filters.q}"`,
                                      `Results for "${filters.q}"`,
                                  )
                                : selectedCategory
                                  ? trGuideCategory(selectedCategory)
                                  : pick(
                                        'Semua Panduan Perawatan',
                                        'All Care Guides',
                                    )}
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
                                        className="overlap-enter card-hover group flex flex-col rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-slate-800 hover:border-[#0684E5]/60 dark:hover:border-[#4AB8BD]/50 shadow-[0_2px_12px_rgba(0,20,84,0.03)] overflow-hidden"
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
                                                className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-xs bg-white/95 dark:bg-slate-900/90 ${badgeMeta.badgeClass}`}
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
                                                    <Fish className="w-3.5 h-3.5 text-[#0684E5] dark:text-[#4AB8BD] shrink-0" />
                                                    <span className="truncate">
                                                        {guide.fish_type}
                                                    </span>
                                                </span>
                                                <span className="inline-flex items-center gap-1 shrink-0 tabular-nums">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {readMinutes}{' '}
                                                    {pick('mnt baca', 'min read')}
                                                </span>
                                            </div>

                                            <h3 className="mt-2.5 text-base sm:text-[17px] font-bold tracking-tight text-[#001454] dark:text-white group-hover:text-[#0684E5] dark:group-hover:text-[#4AB8BD] leading-snug line-clamp-2 transition-colors">
                                                {guide.title}
                                            </h3>

                                            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2 flex-1">
                                                {guide.symptoms}
                                            </p>

                                            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/90 flex items-center justify-between gap-2 text-xs">
                                                <span className="inline-flex items-center gap-1 font-medium text-slate-500 dark:text-slate-400">
                                                    <ListChecks className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                                    {steps.length > 0
                                                        ? pick(
                                                              `${steps.length} langkah penanganan`,
                                                              `${steps.length} care steps`,
                                                          )
                                                        : pick(
                                                              'Panduan lengkap',
                                                              'Full guide',
                                                          )}
                                                </span>
                                                <span className="inline-flex items-center gap-1 font-bold text-[#0684E5] dark:text-[#4AB8BD]">
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
                                {pick(
                                    'Tidak ada panduan yang cocok',
                                    'No matching guides found',
                                )}
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

                <SectionWaveDivider />

                {/* 4. Kiko Consultation CTA Banner */}
                <section className="relative overflow-hidden rounded-3xl aquatic-cta-surface border border-[#1E80A0]/35 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-[0_14px_38px_-14px_rgba(0,20,84,0.35)]">
                    <AquaticBannerOrnaments variant="dark" />
                    <div className="relative z-10 space-y-1.5">
                        <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                            {pick(
                                'Gejala Ikan Belum Ketemu di Daftar?',
                                "Can't Find Your Fish's Symptoms Here?",
                            )}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                            {pick(
                                'Ceritakan kondisi akuarium dan perilaku ikan ke Kiko untuk saran penanganan awal dan perlengkapan karantina.',
                                'Describe your tank conditions and fish behavior to Kiko for initial care advice and quarantine gear picks.',
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
                        className="relative z-10 btn-motion btn-sheen inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#001454] font-bold text-xs hover:bg-slate-100 whitespace-nowrap self-start sm:self-auto"
                    >
                        <MessageSquare className="w-3.5 h-3.5 text-[#0684E5]" />
                        {pick('Tanya Kiko Sekarang', 'Ask Kiko Now')}
                    </button>
                </section>
            </div>
        </AppLayout>
    );
}
