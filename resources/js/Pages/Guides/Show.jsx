import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
    HeartPulse, 
    ArrowLeft, 
    AlertTriangle, 
    CheckCircle2, 
    ShieldCheck, 
    BookOpen,
    HelpCircle
} from 'lucide-react';

export default function Show({ guide, relatedGuides }) {
    return (
        <AppLayout>
            <Head title={`${guide.title} - Panduan Kesehatan Dunia Ikan`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* Back button */}
                <Link href="/guides" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-dunia-blue transition">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Pusat Panduan
                </Link>

                {/* Article Header */}
                <div className="space-y-3 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="px-3 py-1 rounded-full bg-sky-100 text-dunia-navy font-bold">
                            {guide.category}
                        </span>
                        <span className="text-slate-500 font-medium">
                            Jenis Ikan: <strong className="text-slate-800">{guide.fish_type}</strong>
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-dunia-navy leading-tight">
                        {guide.title}
                    </h1>

                    {guide.source && (
                        <p className="text-xs text-slate-400">
                            Sumber Rujukan: {guide.source}
                        </p>
                    )}
                </div>

                {/* Medical Disclaimer Alert */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/70 text-xs text-amber-900 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold">Disclaimer Konsultasi Awal:</p>
                        <p className="mt-0.5 leading-relaxed text-amber-800">
                            Panduan ini merupakan tindakan pertolongan pertama berbasis praktik terbaik komunitas aquarist. Jika kondisi ikan sangat lemah, mengalami pendarahan internal, atau menyebar ke seluruh populasi akuarium, segera konsultasikan dengan dokter hewan akuatik.
                        </p>
                    </div>
                </div>

                {/* Section 1: Gejala Fisik & Perilaku */}
                <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs space-y-3">
                    <h2 className="text-base font-bold text-dunia-navy flex items-center gap-2 uppercase tracking-wider text-xs">
                        <HeartPulse className="w-4 h-4 text-rose-500" />
                        1. Gejala Fisik & Perilaku yang Teramati
                    </h2>
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-rose-50/40 p-4 rounded-xl border border-rose-100/60">
                        {guide.symptoms}
                    </div>
                </div>

                {/* Section 2: Kemungkinan Penyebab */}
                <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs space-y-3">
                    <h2 className="text-base font-bold text-dunia-navy flex items-center gap-2 uppercase tracking-wider text-xs">
                        <HelpCircle className="w-4 h-4 text-amber-500" />
                        2. Kemungkinan Penyebab Utama
                    </h2>
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-amber-50/40 p-4 rounded-xl border border-amber-100/60">
                        {guide.possible_causes}
                    </div>
                </div>

                {/* Section 3: Langkah Penanganan Awal */}
                <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs space-y-3">
                    <h2 className="text-base font-bold text-dunia-navy flex items-center gap-2 uppercase tracking-wider text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        3. Langkah Penanganan / Pertolongan Pertama
                    </h2>
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/60">
                        {guide.care_instructions}
                    </div>
                </div>

                {/* Section 4: Langkah Pencegahan */}
                {guide.prevention && (
                    <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs space-y-3">
                        <h2 className="text-base font-bold text-dunia-navy flex items-center gap-2 uppercase tracking-wider text-xs">
                            <ShieldCheck className="w-4 h-4 text-dunia-aqua" />
                            4. Tindakan Pencegahan Jangka Panjang
                        </h2>
                        <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-sky-50/40 p-4 rounded-xl border border-sky-100/60">
                            {guide.prevention}
                        </div>
                    </div>
                )}

                {/* Related Guides */}
                {relatedGuides && relatedGuides.length > 0 && (
                    <div className="pt-8 border-t border-slate-100 space-y-4">
                        <h3 className="font-bold text-base text-dunia-navy">
                            Panduan Terkait Lainnya
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {relatedGuides.map((rel) => (
                                <Link
                                    key={rel.id}
                                    href={`/guides/${rel.id}`}
                                    className="p-4 rounded-xl bg-white border border-slate-200 hover:border-dunia-blue transition shadow-xs group"
                                >
                                    <p className="text-[11px] font-bold text-dunia-marine">{rel.category}</p>
                                    <p className="font-bold text-xs text-slate-900 group-hover:text-dunia-blue mt-1 line-clamp-2">
                                        {rel.title}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
