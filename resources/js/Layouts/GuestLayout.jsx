import { useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import BrandWordmark from '@/Components/BrandWordmark';
import { LanguageSwitcher, useLanguage } from '@/lib/i18n';

export const authPrimaryButtonClass =
    'btn-motion btn-sheen w-full h-11 rounded-xl bg-gradient-to-r from-[#2448f5] via-[#1c64f2] to-[#0684E5] px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(36,72,245,0.28)] hover:brightness-105 hover:shadow-[0_14px_28px_rgba(36,72,245,0.34)] disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * Centered split-card layout for guest authentication screens.
 */
export default function GuestLayout({
    children,
    eyebrow,
    headline,
}) {
    const { pick } = useLanguage();
    const resolvedEyebrow = eyebrow ?? pick('Dunia Ikan Aquatic', 'Dunia Ikan Aquatic');
    const resolvedHeadline =
        headline ??
        pick(
            'Ekosistem ikan hias terkurasi untuk penghobi dan penangkar.',
            'Curated ornamental fish ecosystem for hobbyists and breeders.',
        );
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
        }
    }, []);

    return (
        <div className="relative isolate min-h-screen w-full overflow-x-hidden aquatic-canvas-ambient text-slate-900 dark:text-slate-100 flex items-center justify-center p-3.5 sm:p-6 lg:p-8">
            <div className="relative z-10 w-full max-w-6xl rounded-[24px] sm:rounded-[28px] bg-white dark:bg-[#0e1424] shadow-[0_24px_70px_rgba(24,52,166,0.12)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.5)] border border-[#e6e9ff] dark:border-neutral-800 p-2.5 sm:p-4 grid grid-cols-1 lg:grid-cols-12 items-stretch">
                <div className="lg:col-span-6 relative rounded-[18px] sm:rounded-[20px] overflow-hidden min-h-[220px] sm:min-h-[260px] lg:min-h-[640px] flex flex-col justify-between p-5 sm:p-7 lg:p-9 bg-[#06184a]">
                    <img
                        src="/images/hero/auth-showcase.jpg"
                        alt="Ikan cupang halfmoon biru safir koleksi Dunia Ikan"
                        className="absolute inset-0 h-full w-full object-cover object-[center_35%] lg:object-center select-none"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-[#030d2e]/95 via-[#06184a]/25 to-[#030d2e]/35"
                    />

                    <div className="relative z-10 flex items-center justify-between gap-2">
                        <Link
                            href="/"
                            className="inline-flex items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                            title={pick('Kembali ke beranda Dunia Ikan', 'Back to Dunia Ikan home')}
                        >
                            <BrandWordmark variant="white" className="h-7 sm:h-8 drop-shadow-sm" />
                        </Link>
                        <div className="flex items-center gap-2 shrink-0">
                            <LanguageSwitcher variant="overlay" />
                            <Link
                                href="/"
                                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 px-3 py-1 text-xs font-medium text-white/95 transition-colors"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                {pick('Beranda', 'Home')}
                            </Link>
                        </div>
                    </div>

                    <div className="relative z-10 pt-10 lg:pt-0">
                        <p className="text-mask text-xs sm:text-[13px] font-medium text-sky-200/95 tracking-wide">
                            <span className="text-mask-inner">
                                {resolvedEyebrow}
                            </span>
                        </p>
                        <h2 className="text-mask mt-1.5 max-w-[24ch] text-xl sm:text-2xl lg:text-[26px] font-bold leading-[1.2] tracking-[-0.02em] text-white">
                            <span className="text-mask-inner text-mask-delay-1">
                                {resolvedHeadline}
                            </span>
                        </h2>
                    </div>
                </div>

                <main className="lg:col-span-6 flex flex-col justify-center px-4 py-7 sm:px-8 sm:py-9 lg:px-12 lg:py-10">
                    <div className="mx-auto w-full max-w-[420px]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
