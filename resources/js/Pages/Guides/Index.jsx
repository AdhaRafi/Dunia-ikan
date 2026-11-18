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

function HeroFishScene({ className = '' }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 320 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Coastal seabed wave contours */}
            <path
                d="M44 260C106 208 174 216 238 182C276 162 302 164 320 176V260H44Z"
                className="fill-[#d7ebfb] dark:fill-[#132544]"
            />
            <path
                d="M118 260C166 226 232 232 320 198V260H118Z"
                className="fill-[#c4e0f9] dark:fill-[#193055]"
            />

            {/* Reef flora & rounded corals */}
            <path
                d="M174 246C174 224 166 206 171 190C176 205 182 222 183 246H174Z"
                className="fill-[#74c6d0]/70 dark:fill-[#4AB8BD]/35"
            />
            <path
                d="M189 246C191 218 202 200 198 182C191 196 184 216 182 246H189Z"
                className="fill-[#4AB8BD]/65 dark:fill-[#4AB8BD]/45"
            />
            <path
                d="M276 244V168C276 156 266 154 266 166V200C260 194 252 192 252 202C252 214 265 218 269 224V244H276Z"
                className="fill-[#3698d4]/55 dark:fill-[#0684E5]/45"
            />
            <path
                d="M284 244V184C284 174 294 172 294 184V210C300 205 307 204 307 213C307 222 296 226 291 232V244H284Z"
                className="fill-[#1E80A0]/55 dark:fill-[#4AB8BD]/35"
            />

            {/* Swimming banded angelfish in Dunia Ikan palette */}
            <g transform="translate(10, 4)">
                {/* Dorsal & sweeping ventral fins */}
                <path
                    d="M186 78C196 48 228 40 245 50C234 66 232 82 232 94L186 78Z"
                    className="fill-[#0D2E92] dark:fill-[#0684E5]"
                />
                <path
                    d="M184 128C194 156 224 166 242 158C232 142 228 128 228 116L184 128Z"
                    className="fill-[#0D2E92] dark:fill-[#0684E5]"
                />
                {/* Forked tail fin */}
                <path
                    d="M242 104L282 76C276 94 275 112 282 132L242 104Z"
                    className="fill-[#1E80A0] dark:fill-[#4AB8BD]"
                />
                {/* Fish body base */}
                <path
                    d="M142 104C158 72 196 64 232 80C244 86 250 96 250 104C250 112 244 122 232 128C196 144 158 136 142 104Z"
                    className="fill-[#0684E5] dark:fill-[#2294ee]"
                />
                {/* Subtle belly highlight */}
                <path
                    d="M148 106C166 125 202 131 236 118C225 130 192 138 158 122C152 118 148 112 148 106Z"
                    className="fill-[#4AB8BD] dark:fill-[#5ed1d6]"
                />
                {/* Vertical reef bands clipped smoothly within body contour */}
                <path
                    d="M174 75C180 73 186 72 191 72C186 94 186 114 191 136C185 136 179 135 174 133C170 114 170 94 174 75Z"
                    className="fill-[#001454]/65 dark:fill-[#091b42]/75"
                />
                <path
                    d="M202 72C208 73 213 74 218 76C213 94 213 114 218 132C212 134 207 135 202 136C198 114 198 94 202 72Z"
                    className="fill-[#001454]/65 dark:fill-[#091b42]/75"
                />
                {/* Pectoral fin */}
                <path
                    d="M178 106C192 102 204 109 200 119C192 122 181 116 178 106Z"
                    className="fill-[#99e2e6]/80 dark:fill-[#7be2e6]/80"
                />
                {/* Gill curve */}
                <path
                    d="M167 90C173 98 173 111 167 119"
                    stroke="#001454"
                    strokeOpacity="0.45"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                {/* Eye */}
                <circle
                    cx="159"
                    cy="98"
                    r="4.5"
                    className="fill-white"
                />
                <circle
                    cx="158.2"
                    cy="98"
                    r="2.4"
                    className="fill-[#001454]"
                />
                <circle cx="157.3" cy="96.8" r="0.9" className="fill-white" />
            </g>

            {/* Water bubbles */}
            <circle
                cx="134"
                cy="92"
                r="4.5"
                stroke="#0684E5"
                strokeWidth="1.5"
                className="opacity-45 dark:stroke-[#4AB8BD]"
            />
            <circle
                cx="144"
                cy="70"
                r="2.8"
                stroke="#1E80A0"
                strokeWidth="1.4"
                className="opacity-40 dark:stroke-[#4AB8BD]"
            />
            <circle
                cx="124"
                cy="62"
                r="2"
                className="fill-[#4AB8BD]/45"
            />
            <circle
                cx="196"
                cy="34"
                r="3.2"
                stroke="#0684E5"
                strokeWidth="1.4"
                className="opacity-35 dark:stroke-[#4AB8BD]"
            />
        </svg>
    );
}

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
                {/* 1. Editorial Hero Row + Popular Guides Panel */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
                    {/* Left Hero Card */}
                    <div className="lg:col-span-8 relative overflow-hidden rounded-[24px] sm:rounded-[28px] bg-[#edf5fc] dark:bg-[#0d182b] border border-[#0684E5]/15 dark:border-[#4AB8BD]/20 px-5 sm:px-8 lg:px-10 py-7 sm:py-9 flex flex-col justify-between shadow-[0_6px_24px_-12px_rgba(0,20,84,0.08)]">
                        <HeroFishScene className="hidden md:block pointer-events-none select-none absolute right-0 bottom-0 w-[210px] lg:w-[220px] xl:w-[275px] h-auto" />
                        <HeroFishScene className="md:hidden pointer-events-none select-none absolute -right-4 bottom-0 w-36 h-auto opacity-30" />

                        <div className="relative z-10 w-full md:max-w-[68%] lg:max-w-[69%] space-y-5">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-[#131d33] border border-slate-200/80 dark:border-slate-700 px-3 py-1 text-[11px] font-bold text-[#001454] dark:text-sky-200 shadow-2xs">
                                    <BookOpen className="w-3.5 h-3.5 text-[#0684E5] dark:text-[#4AB8BD]" />
                                    {pick('Pusat Edukasi Akuatik', 'Aquatic Care Library')}
                                </span>
                                <span className="inline-flex items-center rounded-full bg-[#0684E5]/12 dark:bg-[#4AB8BD]/15 text-[#001454] dark:text-[#4AB8BD] px-3 py-1 text-[11px] font-bold tabular-nums">
                                    {effectiveTotal} {pick('panduan aktif', 'active guides')}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-mask text-2xl sm:text-3xl xl:text-[36px] font-extrabold tracking-[-0.03em] leading-[1.13] text-[#001454] dark:text-white">
                                    <span className="text-mask-inner">
                                        {pick(
                                            'Panduan Perawatan & Diagnosa Ikan',
                                            'Fish Care & Health Guides',
                                        )}
                                    </span>
                                </h1>
                                <p className="text-mask text-xs sm:text-[14px] leading-relaxed text-slate-600 dark:text-slate-300 max-w-[46ch]">
                                    <span className="text-mask-inner text-mask-delay-1">
                                        {pick(
                                            'Kenali gejala penyakit, cek parameter air, dan ikuti langkah karantina harian untuk menjaga ikan hias tetap sehat.',
                                            'Spot early clinical signs, balance water quality, and follow practical quarantine steps for healthier fish.',
                                        )}
                                    </span>
                                </p>
                            </div>

                            {/* Unified Search Bar */}
                            <form
                                onSubmit={handleSearch}
                                className="flex items-center gap-1.5 rounded-full bg-white dark:bg-[#131d33] border border-slate-200/90 dark:border-slate-700/80 p-1.5 pl-4 shadow-[0_6px_20px_-8px_rgba(0,20,84,0.12)] focus-within:border-[#0684E5] dark:focus-within:border-[#4AB8BD] focus-within:ring-2 focus-within:ring-[#0684E5]/15 transition max-w-xl"
                            >
                                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                                <input
                                    type="search"
                                    placeholder={pick(
                                        'Cari penyakit, gejala, atau ikan...',
                                        'Search diseases, symptoms, or fish...',
                                    )}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1 min-w-0 bg-transparent border-0 px-2 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0"
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
                                        className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="h-9 sm:h-10 px-4 sm:px-5 rounded-full bg-[#001454] hover:bg-[#0684E5] dark:bg-[#0684E5] dark:hover:bg-[#4AB8BD] dark:hover:text-[#001454] text-white font-bold text-xs whitespace-nowrap transition shrink-0"
                                >
                                    {pick('Cari Panduan', 'Search Guides')}
                                </button>
                            </form>

                            {/* Category Pills */}
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5">
                                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-0.5">
                                    {pick('Topik:', 'Topics:')}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleCategoryClick('')}
                                    className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition border ${
                                        selectedCategory === ''
                                            ? 'bg-[#001454] text-white border-[#001454] dark:bg-white dark:text-[#001454] dark:border-white'
                                            : 'bg-white/95 dark:bg-[#131d33] text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:border-[#0684E5]'
                                    }`}
                                >
                                    {pick('Semua', 'All')} ({effectiveTotal})
                                </button>
                                {categories.map((category) => {
                                    const active =
                                        selectedCategory === category;
                                    const count = categoryCounts?.[category];
                                    return (
                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() =>
                                                handleCategoryClick(category)
                                            }
                                            className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition border ${
                                                active
                                                    ? 'bg-[#0684E5] text-white border-[#0684E5]'
                                                    : 'bg-white/95 dark:bg-[#131d33] text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:border-[#0684E5]'
                                            }`}
                                        >
                                            {trGuideCategory(category)}
                                            {typeof count === 'number' && (
                                                <span
                                                    className={`ml-1 tabular-nums ${
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
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Companion Panel: Popular Guides */}
                    <aside className="lg:col-span-4 rounded-[24px] sm:rounded-[28px] bg-white dark:bg-[#0e1424] border border-slate-200/85 dark:border-slate-800 p-5 sm:p-6 shadow-[0_6px_22px_-12px_rgba(0,20,84,0.06)] flex flex-col justify-between gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-lg bg-[#edf5fd] dark:bg-[#131d33] text-[#0684E5] dark:text-[#4AB8BD] flex items-center justify-center shrink-0">
                                        <Fish className="w-3.5 h-3.5" />
                                    </span>
                                    <h2 className="text-sm sm:text-[15px] font-extrabold tracking-tight text-[#001454] dark:text-white">
                                        {pick('Artikel Terpopuler', 'Popular Guides')}
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleShowAllCatalog}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0684E5] dark:text-[#4AB8BD] hover:underline shrink-0"
                                >
                                    {pick('Lihat Semua', 'View All')}
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {featuredList.map((item, idx) => (
                                    <Link
                                        key={item.id}
                                        href={`/guides/${item.id}`}
                                        className="group flex items-start gap-3 py-3 first:pt-1.5 last:pb-1 transition"
                                    >
                                        <span className="w-7 h-7 rounded-full bg-[#edf5fd] dark:bg-[#131d33] text-[#0684E5] dark:text-[#4AB8BD] text-[11px] font-extrabold flex items-center justify-center shrink-0 mt-0.5 tabular-nums group-hover:bg-[#0684E5] group-hover:text-white dark:group-hover:bg-[#4AB8BD] dark:group-hover:text-[#001454] transition">
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs sm:text-[13px] font-bold text-[#001454] dark:text-white group-hover:text-[#0684E5] dark:group-hover:text-[#4AB8BD] leading-snug line-clamp-2 transition-colors">
                                                {item.title}
                                            </p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-1 mt-0.5">
                                                {item.symptoms || item.fish_type}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
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
                                        new CustomEvent('dunia-ikan:open-chat'),
                                    )
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#edf5fd] hover:bg-[#0684E5] text-[#001454] hover:text-white dark:bg-[#131d33] dark:text-[#4AB8BD] dark:hover:bg-[#4AB8BD] dark:hover:text-[#001454] font-bold text-[11px] transition shrink-0"
                            >
                                <MessageSquare className="w-3 h-3" />
                                {pick('Tanya Kiko', 'Ask Kiko')}
                            </button>
                        </div>
                    </aside>
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
