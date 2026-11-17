import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useLanguage } from '@/lib/i18n';
import {
    estimateReadingMinutes,
    getCategoryBadgeMeta,
    getGuideImage,
    parseCareSteps,
} from '@/lib/guideMeta';
import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Clock,
    Eye,
    Fish,
    ListChecks,
    MessageSquare,
    ShieldCheck,
    ShoppingBag,
} from 'lucide-react';

const QUICK_TOPICS = [
    { labelId: 'Cupang', labelEn: 'Betta', query: 'Cupang' },
    { labelId: 'Guppy', labelEn: 'Guppy', query: 'Guppy' },
    { labelId: 'Channa', labelEn: 'Channa', query: 'Channa' },
    { labelId: 'Neon Tetra', labelEn: 'Neon Tetra', query: 'Neon Tetra' },
    { labelId: 'Air Tawar', labelEn: 'Freshwater', query: 'Air Tawar' },
];

export default function Show({ guide, relatedGuides = [] }) {
    const { pick, isEn, trGuideCategory } = useLanguage();
    const heroImage = getGuideImage(guide);
    const badgeMeta = getCategoryBadgeMeta(guide.category);
    const readMinutes = estimateReadingMinutes(guide);
    const careSteps = parseCareSteps(guide.care_instructions);

    const sections = [
        {
            key: 'symptoms',
            title: pick('Gejala Klinis yang Terlihat', 'Visible Clinical Symptoms'),
            shortTitle: pick('Gejala Klinis', 'Clinical Symptoms'),
            available: Boolean(guide.symptoms),
        },
        {
            key: 'possible_causes',
            title: pick('Kemungkinan Penyebab', 'Possible Causes'),
            shortTitle: pick('Penyebab Utama', 'Root Causes'),
            available: Boolean(guide.possible_causes),
        },
        {
            key: 'care_instructions',
            title: pick('Langkah Penanganan Cepat', 'Quick Treatment Steps'),
            shortTitle: pick('Langkah Penanganan', 'Treatment Steps'),
            available: Boolean(guide.care_instructions),
        },
        {
            key: 'prevention',
            title: pick('Pencegahan & Karantina', 'Prevention & Quarantine'),
            shortTitle: pick('Pencegahan', 'Prevention'),
            available: Boolean(guide.prevention),
        },
    ].filter((s) => s.available);

    const [activeSection, setActiveSection] = useState(
        sections[0]?.key || 'symptoms',
    );

    return (
        <AppLayout>
            <Head title={`${guide.title} — ${pick('Panduan Dunia Ikan', 'Dunia Ikan Guides')}`}>
                <meta
                    head-key="description"
                    name="description"
                    content={String(guide.symptoms || guide.care_instructions || guide.title).slice(0, 155)}
                />
            </Head>

            <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-9 space-y-7 sm:space-y-9">
                {/* Breadcrumb */}
                <nav
                    aria-label="Breadcrumb"
                    className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400"
                >
                    <Link
                        href="/"
                        className="hover:text-[#0684E5] dark:hover:text-sky-400 transition"
                    >
                        {pick('Beranda', 'Home')}
                    </Link>
                    <span>/</span>
                    <Link
                        href="/guides"
                        className="hover:text-[#0684E5] dark:hover:text-sky-400 transition"
                    >
                        {pick('Panduan', 'Care Guides')}
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-[#001454] dark:text-white truncate max-w-xs sm:max-w-md">
                        {trGuideCategory(guide.category)}
                    </span>
                </nav>

                {/* Balanced 2-Column Editorial Hero Header */}
                <header className="rounded-3xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-8 shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                        <div className="lg:col-span-7 space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${badgeMeta.badgeClass}`}
                                >
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full ${badgeMeta.dotClass}`}
                                    />
                                    {trGuideCategory(guide.category)}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#131d33] text-slate-600 dark:text-slate-300 text-[11px] font-semibold">
                                    <Clock className="w-3 h-3" />
                                    {readMinutes} {pick('mnt baca', 'min read')}
                                </span>
                                {careSteps.length > 0 && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
                                        <ListChecks className="w-3 h-3" />
                                        {careSteps.length} {pick('langkah', 'steps')}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-mask text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-[-0.025em] leading-[1.18] text-[#001454] dark:text-white">
                                <span className="text-mask-inner">
                                    {guide.title}
                                </span>
                            </h1>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                                <span className="inline-flex items-center gap-1.5 font-semibold text-[#001454] dark:text-slate-200">
                                    <Fish className="w-4 h-4 text-[#0684E5]" />
                                    Target: {guide.fish_type}
                                </span>
                                {guide.source && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                                        {guide.source}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-5">
                            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm">
                                <img
                                    src={heroImage}
                                    alt={guide.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Article Content + Sticky TOC Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-start">
                    {/* Reading Column */}
                    <div className="lg:col-span-8 space-y-5 min-w-0">
                        {guide.symptoms && (
                            <section
                                id="symptoms"
                                className="scroll-mt-24 rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-3"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                        <Eye className="w-4 h-4" />
                                    </span>
                                    <div>
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                                            {pick('Observasi Awal', 'Initial Observation')}
                                        </span>
                                        <h2 className="text-base sm:text-lg font-extrabold text-[#001454] dark:text-white leading-tight">
                                            {pick('Gejala Klinis yang Terlihat', 'Visible Clinical Symptoms')}
                                        </h2>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                                    {guide.symptoms}
                                </p>
                            </section>
                        )}

                        {guide.possible_causes && (
                            <section
                                id="possible_causes"
                                className="scroll-mt-24 rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-3"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                        <AlertCircle className="w-4 h-4" />
                                    </span>
                                    <div>
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                            {pick('Analisis Pemicu', 'Trigger Analysis')}
                                        </span>
                                        <h2 className="text-base sm:text-lg font-extrabold text-[#001454] dark:text-white leading-tight">
                                            {pick('Kemungkinan Penyebab', 'Possible Causes')}
                                        </h2>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                                    {guide.possible_causes}
                                </p>
                            </section>
                        )}

                        {guide.care_instructions && (
                            <section
                                id="care_instructions"
                                className="scroll-mt-24 rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-500/15 text-[#0684E5] dark:text-sky-400 flex items-center justify-center shrink-0">
                                        <ListChecks className="w-4 h-4" />
                                    </span>
                                    <div>
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#0684E5] dark:text-sky-400">
                                            {pick('Prosedur Karantina & Rawat', 'Quarantine & Care Procedure')}
                                        </span>
                                        <h2 className="text-base sm:text-lg font-extrabold text-[#001454] dark:text-white leading-tight">
                                            {pick('Langkah Penanganan Cepat', 'Quick Treatment Steps')}
                                        </h2>
                                    </div>
                                </div>

                                <ol className="space-y-2.5">
                                    {careSteps.map((step) => (
                                        <li
                                            key={`${step.number}-${step.text.slice(0, 12)}`}
                                            className="flex items-start gap-3.5 rounded-xl bg-[#f8fafc] dark:bg-[#131d33]/90 border border-slate-200/60 dark:border-slate-800 p-3.5 sm:p-4"
                                        >
                                            <span className="w-7 h-7 rounded-full bg-[#0684E5] text-white text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                                                {step.number}
                                            </span>
                                            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                                                {step.text}
                                            </p>
                                        </li>
                                    ))}
                                </ol>
                            </section>
                        )}

                        {guide.prevention && (
                            <section
                                id="prevention"
                                className="scroll-mt-24 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-500/30 p-5 sm:p-6 space-y-3"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-4 h-4" />
                                    </span>
                                    <div>
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                            {pick('Tips Preventif', 'Preventive Tips')}
                                        </span>
                                        <h2 className="text-base sm:text-lg font-extrabold text-emerald-950 dark:text-white leading-tight">
                                            {pick('Pencegahan & Karantina', 'Prevention & Quarantine')}
                                        </h2>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed text-emerald-950/90 dark:text-emerald-100/90 whitespace-pre-line">
                                    {guide.prevention}
                                </p>
                            </section>
                        )}

                        {/* Veterinary Disclaimer Callout */}
                        <div className="rounded-2xl bg-amber-50/75 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-500/30 p-5 flex items-start gap-3.5">
                            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div className="space-y-1 text-xs leading-relaxed">
                                <p className="font-bold text-amber-950 dark:text-amber-200">
                                    {pick(
                                        'Konsultasi awal, bukan diagnosis medis profesional',
                                        'Initial guidance only, not a veterinary diagnosis',
                                    )}
                                </p>
                                <p className="text-amber-900/85 dark:text-amber-200/80">
                                    {pick(
                                        'Jika ikan terlihat sangat lemah, mengalami pendarahan terbuka, atau penularan menyebar cepat ke seluruh tank, segera isolasi dan konsultasikan ke dokter hewan akuatik.',
                                        'If fish appear severely lethargic, show open bleeding lesions, or infection spreads rapidly across the tank, isolate immediately and consult an aquatic veterinarian.',
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Link
                                href="/guides"
                                className="inline-flex items-center gap-2 text-xs font-bold text-[#001454] dark:text-sky-400 hover:text-[#0684E5] transition"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                {pick('Kembali ke Semua Panduan', 'Back to All Care Guides')}
                            </Link>
                        </div>
                    </div>

                    {/* Right Sticky Table of Contents & Actions */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-20 space-y-4 min-w-0">
                        {sections.length > 0 && (
                            <nav
                                aria-label={pick('Daftar isi panduan', 'Guide table of contents')}
                                className="rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-3"
                            >
                                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    {pick('Daftar Isi', 'Contents')}
                                </p>
                                <ul className="space-y-1">
                                    {sections.map((section, idx) => {
                                        const isActive =
                                            activeSection === section.key;
                                        return (
                                            <li key={section.key}>
                                                <a
                                                    href={`#${section.key}`}
                                                    onClick={() =>
                                                        setActiveSection(
                                                            section.key,
                                                        )
                                                    }
                                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                                                        isActive
                                                            ? 'bg-[#0684E5]/10 text-[#0684E5] dark:bg-sky-500/15 dark:text-sky-300'
                                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#131d33] hover:text-[#001454] dark:hover:text-white'
                                                    }`}
                                                >
                                                    <span className="text-[10px] font-bold tabular-nums opacity-60">
                                                        0{idx + 1}
                                                    </span>
                                                    <span>
                                                        {section.shortTitle}
                                                    </span>
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        )}

                        <div className="rounded-2xl bg-[#0f172a] dark:bg-[#111a30] border border-slate-800 p-5 text-white space-y-3">
                            <p className="text-sm font-bold leading-snug">
                                {pick('Butuh Bantuan Lebih Lanjut?', 'Need More Guidance?')}
                            </p>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                {pick(
                                    'Tanyakan dosis karantina ke Kiko AI atau lengkapi perlengkapan perawatan air di katalog.',
                                    'Ask Kiko AI about quarantine dosing or browse aquarium treatment gear in the catalog.',
                                )}
                            </p>
                            <div className="space-y-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        window.dispatchEvent(
                                            new CustomEvent(
                                                'dunia-ikan:open-chat',
                                            ),
                                        )
                                    }
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0684E5] hover:bg-sky-500 text-white font-bold text-xs transition"
                                >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    {pick('Konsultasi dengan Kiko', 'Consult with Kiko')}
                                </button>
                                <Link
                                    href="/products?q=garam"
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition"
                                >
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    {pick('Cari Garam & Obat Air', 'Find Fish Salt & Meds')}
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-3">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                {pick('Topik Cepat', 'Quick Topics')}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {QUICK_TOPICS.map((topic) => (
                                    <Link
                                        key={topic.query}
                                        href={`/guides?q=${encodeURIComponent(topic.query)}`}
                                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-[#131d33] text-slate-700 dark:text-slate-300 hover:bg-[#0684E5] hover:text-white transition"
                                    >
                                        {isEn ? topic.labelEn : topic.labelId}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Related Care Guides */}
                {relatedGuides?.length > 0 && (
                    <section className="pt-4 space-y-4">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#001454] dark:text-white">
                                {pick('Panduan Terkait Lainnya', 'Related Care Guides')}
                            </h2>
                            <Link
                                href="/guides"
                                className="text-xs font-semibold text-[#0684E5] hover:underline"
                            >
                                {pick('Lihat Semua', 'View All')}
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {relatedGuides.map((related) => {
                                const relBadge = getCategoryBadgeMeta(
                                    related.category,
                                );
                                return (
                                    <Link
                                        key={related.id}
                                        href={`/guides/${related.id}`}
                                        className="group rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-slate-800 hover:border-[#0684E5]/60 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between gap-3"
                                    >
                                        <div className="space-y-2.5">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${relBadge.badgeClass}`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${relBadge.dotClass}`}
                                                />
                                                {trGuideCategory(related.category)}
                                            </span>
                                            <h3 className="text-sm sm:text-[15px] font-bold text-[#001454] dark:text-white group-hover:text-[#0684E5] dark:group-hover:text-sky-400 leading-snug line-clamp-2 transition-colors">
                                                {related.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                                {related.symptoms}
                                            </p>
                                        </div>

                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0684E5] dark:text-sky-400">
                                            {pick('Baca panduan', 'Read guide')}
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}
            </article>
        </AppLayout>
    );
}
