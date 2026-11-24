import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Check } from '@/Components/Icons';
import BrandWordmark from '@/Components/BrandWordmark';
import { useLanguage } from '@/lib/i18n';

const SOCIAL_LINKS = [
    {
        name: 'Instagram',
        href: 'https://instagram.com',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
        ),
    },
    {
        name: 'Facebook',
        href: 'https://facebook.com',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path d="M13.5 21v-8.2h2.7l.4-3.2h-3.1V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.4H7.5v3.2h2.7V21h3.3Z" />
            </svg>
        ),
    },
    {
        name: 'Twitter',
        href: 'https://twitter.com',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
            </svg>
        ),
    },
    {
        name: 'TikTok',
        href: 'https://tiktok.com',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .6.04.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1Z" />
            </svg>
        ),
    },
];

export default function Footer() {
    const { visitorStats } = usePage().props;
    const { pick, isEn } = useLanguage();
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const formatVisits = (value) => new Intl.NumberFormat(isEn ? 'en-US' : 'id-ID').format(value ?? 0);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setTimeout(() => setSubscribed(false), 4000);
            setEmail('');
        }
    };

    return (
        <footer className="relative shrink-0 mt-12 sm:mt-20 bg-gradient-to-b from-[#fbf8ff] via-white to-[#f1f7fe] dark:from-[#070b14] dark:via-[#080f1f] dark:to-[#09142b] text-neutral-900 dark:text-neutral-100 border-t border-[#005A9D]/15 dark:border-[#60C2E6]/15 transition-colors duration-200 overflow-hidden">
            <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-0">
                {/* 1. TOP SECTION: Brand on left + 4 Navigation Columns on right (Avora Luxury Layout) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 pb-12 sm:pb-16">
                    {/* Brand Column */}
                    <div className="md:col-span-4 space-y-4">
                        <Link
                            href="/"
                            aria-label={pick('Beranda Dunia Ikan', 'Dunia Ikan Home')}
                            className="inline-block group"
                        >
                            <BrandWordmark className="h-9 sm:h-10" />
                        </Link>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-sm leading-relaxed">
                            {pick(
                                'Marketplace ikan hias & mutasi genetik (morph) captive-bred pertama di Indonesia dengan garansi ikan hidup 100% sampai tujuan.',
                                "Indonesia's first marketplace for captive-bred ornamental fish and genetic morphs with a 100% live arrival guarantee.",
                            )}
                        </p>

                        {/* Website Visitor Counter */}
                        <div className="pt-2 max-w-[230px] space-y-2">
                            <h2 className="font-bold text-neutral-900 dark:text-white text-xs">
                                {pick('Pengunjung Website', 'Website Visitors')}
                            </h2>
                            <dl className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                                <div className="flex items-center justify-between gap-4">
                                    <dt>{pick('Pengunjung Hari ini :', 'Visitors Today :')}</dt>
                                    <dd className="tabular-nums text-neutral-700 dark:text-neutral-200">
                                        {formatVisits(visitorStats?.today)}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <dt>{pick('Pengunjung Bulan ini :', 'Visitors This Month :')}</dt>
                                    <dd className="tabular-nums text-neutral-700 dark:text-neutral-200">
                                        {formatVisits(visitorStats?.month)}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <dt>{pick('Pengunjung Tahun ini :', 'Visitors This Year :')}</dt>
                                    <dd className="tabular-nums text-neutral-700 dark:text-neutral-200">
                                        {formatVisits(visitorStats?.year)}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Social Media Links (Bottom Left with Brand Icons) */}
                        <div
                            aria-label={pick('Media sosial Dunia Ikan', 'Dunia Ikan social media')}
                            className="pt-2 flex items-center gap-2"
                        >
                            {SOCIAL_LINKS.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={social.name}
                                    title={social.name}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-slate-800 text-[#14335D] dark:text-slate-200 hover:border-[#005A9D] hover:bg-[#eef6ff] hover:text-[#005A9D] dark:hover:border-[#60C2E6] dark:hover:bg-[#13223b] dark:hover:text-[#60C2E6] shadow-2xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9D]"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* 3 Navigation Columns (Koleksi, Newsletter, Bantuan) */}
                    <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
                        {/* Col 1: Koleksi Ikan */}
                        <div className="space-y-3">
                            <h2 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">
                                {pick('Koleksi', 'Collections')}
                            </h2>
                            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400 text-xs">
                                <li>
                                    <Link href="/products?water_type=freshwater" className="hover:text-black dark:hover:text-white transition">
                                        {pick('Air Tawar', 'Freshwater')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/products?water_type=saltwater" className="hover:text-black dark:hover:text-white transition">
                                        {pick('Air Laut', 'Saltwater')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/products?water_type=brackish" className="hover:text-black dark:hover:text-white transition">
                                        {pick('Air Payau', 'Brackish')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/products?category=ikan-hias&q=arwana" className="hover:text-black dark:hover:text-white transition">
                                        {pick('Arwana & Predator', 'Arowana & Predator')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/products?category=ikan-hias&q=cupang" className="hover:text-black dark:hover:text-white transition">
                                        {pick('Cupang & Channa', 'Betta & Channa')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/products?category=aquascape" className="hover:text-black dark:hover:text-white transition">
                                        Aquascape
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Col 2: Newsletter (Enter Email Address + Sign Up) */}
                        <div className="space-y-3">
                            <h2 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">
                                Newsletter
                            </h2>
                            {subscribed ? (
                                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium py-2">
                                    <Check className="w-4 h-4" />
                                    <span>{pick('Berhasil terdaftar!', 'Subscribed successfully!')}</span>
                                </div>
                            ) : (
                                <form onSubmit={handleNewsletterSubmit} className="space-y-2.5">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        aria-label={pick('Alamat email newsletter', 'Newsletter email address')}
                                        placeholder={pick('Masukkan Alamat Email', 'Enter Email Address')}
                                        className="w-full bg-transparent border-b border-neutral-300 dark:border-neutral-700 py-1.5 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-900 dark:focus:border-white transition"
                                    />
                                    <button
                                        type="submit"
                                        className="text-xs font-semibold text-neutral-900 dark:text-white hover:opacity-70 transition flex items-center gap-1 cursor-pointer"
                                    >
                                        <span>{pick('Daftar', 'Sign Up')}</span>
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Col 3: Support */}
                        <div className="space-y-3">
                            <h2 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">
                                {pick('Bantuan', 'Support')}
                            </h2>
                            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400 text-xs">
                                <li>
                                    <Link href="/community" className="hover:text-black dark:hover:text-white transition">
                                        {pick('Chat Global Komunitas', 'Community Global Chat')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/guides" className="hover:text-black dark:hover:text-white transition">
                                        {pick('Layanan 24/7', '24/7 Support')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/guides" className="hover:text-black dark:hover:text-white transition">
                                        {pick('Garansi Ikan Hidup', 'Live Arrival Guarantee')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/guides" className="hover:text-black dark:hover:text-white transition">
                                        {pick('Syarat & Ketentuan', 'Terms & Conditions')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/guides" className="hover:text-black dark:hover:text-white transition">
                                        {pick('Kebijakan Privasi', 'Privacy Policy')}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 2. DIVIDER LINE */}
                <div className="border-t border-neutral-200 dark:border-neutral-800" />

                {/* 3. SUB-FOOTER ROW: Copyright on Left, Powered By on Right */}
                <div className="py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                    <p>© Copyright 2026. Dunia Ikan All Rights Reserved.</p>
                    <p className="hover:text-neutral-900 dark:hover:text-white transition">
                        Powered By <span className="font-semibold text-neutral-900 dark:text-white">duniaikan.com</span>
                    </p>
                </div>
            </div>

            {/* 4. MONUMENTAL EDITORIAL WORDMARK: Giant Faded "Duniaikan" Bleeding Off Bottom Edge */}
            <div
                aria-hidden="true"
                className="relative z-10 w-full overflow-hidden select-none pointer-events-none pt-2 sm:pt-3 flex justify-center"
            >
                <span className="block w-full text-center font-sans font-medium tracking-[-0.035em] leading-[0.82] translate-y-[10%] text-[21.5vw] bg-gradient-to-b from-slate-900/[0.22] via-slate-900/[0.11] to-slate-900/[0.02] dark:from-white/[0.22] dark:via-white/[0.10] dark:to-white/[0.02] bg-clip-text text-transparent whitespace-nowrap">
                    Duniaikan
                </span>
            </div>
        </footer>
    );
}
