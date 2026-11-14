import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Check } from 'lucide-react';
import BrandWordmark from '@/Components/BrandWordmark';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setTimeout(() => setSubscribed(false), 4000);
            setEmail('');
        }
    };

    return (
        <footer className="shrink-0 mt-12 sm:mt-20 bg-white dark:bg-[#070b14] text-neutral-900 dark:text-neutral-100 border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-200 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-0">
                {/* 1. TOP SECTION: Brand on left + 4 Navigation Columns on right (Avora Luxury Layout) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 pb-12 sm:pb-16">
                    {/* Brand Column */}
                    <div className="md:col-span-4 space-y-4">
                        <Link href="/" className="inline-block group">
                            <BrandWordmark className="h-9 sm:h-10" />
                        </Link>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed">
                            Marketplace ikan hias & mutasi genetik (morph) captive-bred pertama di Indonesia dengan garansi ikan hidup 100% sampai tujuan.
                        </p>
                    </div>

                    {/* 4 Navigation Columns (Skincare, Newsletter, Connect, Support) */}
                    <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs">
                        {/* Col 1: Koleksi Ikan (Skincare equivalent) */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">
                                Koleksi
                            </h4>
                            <ul className="space-y-2 text-neutral-500 dark:text-neutral-400 text-xs">
                                <li>
                                    <Link href="/products?water_type=freshwater" className="hover:text-black dark:hover:text-white transition">
                                        Air Tawar
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/products?water_type=saltwater" className="hover:text-black dark:hover:text-white transition">
                                        Air Laut
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/products?category=cupang" className="hover:text-black dark:hover:text-white transition">
                                        Cupang / Betta
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/products?category=channa" className="hover:text-black dark:hover:text-white transition">
                                        Channa Predator
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
                            <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">
                                Newsletter
                            </h4>
                            {subscribed ? (
                                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium py-2">
                                    <Check className="w-4 h-4" />
                                    <span>Berhasil terdaftar!</span>
                                </div>
                            ) : (
                                <form onSubmit={handleNewsletterSubmit} className="space-y-2.5">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter Email Address"
                                        className="w-full bg-transparent border-b border-neutral-300 dark:border-neutral-700 py-1.5 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-white transition"
                                    />
                                    <button
                                        type="submit"
                                        className="text-xs font-semibold text-neutral-900 dark:text-white hover:opacity-70 transition flex items-center gap-1 cursor-pointer"
                                    >
                                        <span>Sign Up</span>
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Col 3: Connect (Social Links) */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">
                                Connect
                            </h4>
                            <ul className="space-y-2 text-neutral-500 dark:text-neutral-400 text-xs">
                                <li>
                                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition">
                                        Instagram
                                    </a>
                                </li>
                                <li>
                                    <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition">
                                        Facebook
                                    </a>
                                </li>
                                <li>
                                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition">
                                        Twitter
                                    </a>
                                </li>
                                <li>
                                    <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition">
                                        TikTok
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Col 4: Support */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">
                                Support
                            </h4>
                            <ul className="space-y-2 text-neutral-500 dark:text-neutral-400 text-xs">
                                <li>
                                    <Link href="/guides" className="hover:text-black dark:hover:text-white transition">
                                        24/7 Support
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/guides" className="hover:text-black dark:hover:text-white transition">
                                        Garansi Ikan Hidup
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/guides" className="hover:text-black dark:hover:text-white transition">
                                        Terms & Conditions
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/guides" className="hover:text-black dark:hover:text-white transition">
                                        Privacy Policy
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

                {/* 4. MONUMENTAL TYPOGRAPHIC HERO: Giant "Duniaikan" Bleeding Off Bottom Edge */}
                <div className="w-full overflow-hidden select-none pointer-events-none -mb-2 sm:-mb-4 md:-mb-6 text-center text-neutral-900 dark:text-white">
                    <svg
                        viewBox="0 0 1400 200"
                        className="w-full h-auto block"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <text
                            x="50%"
                            y="185"
                            textAnchor="middle"
                            fill="currentColor"
                            className="font-black font-['Montserrat',sans-serif]"
                            style={{
                                fontSize: '225px',
                                fontWeight: 900,
                                letterSpacing: '-0.04em',
                            }}
                        >
                            Duniaikan
                        </text>
                    </svg>
                </div>
            </div>
        </footer>
    );
}
