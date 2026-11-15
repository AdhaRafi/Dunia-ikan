import { useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import BrandWordmark from '@/Components/BrandWordmark';
import { LanguageSwitcher, useLanguage } from '@/lib/i18n';

export const authPrimaryButtonClass =
    'w-full h-11 rounded-xl bg-gradient-to-r from-[#2448f5] via-[#1c64f2] to-[#0684E5] px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(36,72,245,0.28)] hover:brightness-105 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed';

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
        <div className="min-h-screen w-full overflow-x-hidden bg-[#f4f5ff] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex items-center justify-center p-3.5 sm:p-6 lg:p-10">
            <div className="w-full max-w-[960px] rounded-[24px] sm:rounded-[28px] bg-white dark:bg-[#0e1424] shadow-[0_24px_70px_rgba(24,52,166,0.12)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.5)] border border-[#e6e9ff] dark:border-neutral-800 p-2.5 sm:p-3.5 grid grid-cols-1 lg:grid-cols-12 items-stretch">
                <div className="lg:col-span-6 relative rounded-[18px] sm:rounded-[20px] overflow-hidden min-h-[210px] sm:min-h-[240px] lg:min-h-[600px] flex flex-col justify-between p-5 sm:p-7 lg:p-8 bg-[#06184a]">
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
                        <p className="text-xs sm:text-[13px] font-medium text-sky-200/95 tracking-wide">
                            {resolvedEyebrow}
                        </p>
                        <h2 className="mt-1.5 max-w-[24ch] text-xl sm:text-2xl lg:text-[26px] font-bold leading-[1.2] tracking-[-0.02em] text-white">
                            {resolvedHeadline}
                        </h2>
                    </div>
                </div>

                <main className="lg:col-span-6 flex flex-col justify-center px-3 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
                    <div className="mx-auto w-full max-w-[356px]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
