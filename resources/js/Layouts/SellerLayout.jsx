import { Link, usePage } from '@inertiajs/react';
import AnimatedThemeToggler, { toggleThemeWithTransition } from '@/Components/AnimatedThemeToggler';
import BrandWordmark from '@/Components/BrandWordmark';
import UserAvatar from '@/Components/UserAvatar';
import {
    Store,
    Fish,
    Package,
    PlusCircle,
    ArrowLeft,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { LanguageSwitcher, useLanguage } from '@/lib/i18n';

export default function SellerLayout({ children, title }) {
    const { url, props } = usePage();
    const { pick } = useLanguage();
    const { auth, flash } = props;
    const store = auth?.user?.store;
    const [showFlash, setShowFlash] = useState(true);
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return (
                document.documentElement.classList.contains('dark') ||
                localStorage.getItem('theme') === 'dark'
            );
        }
        return false;
    });

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        if (darkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const navItems = [
        {
            href: '/seller/products',
            label: pick('Produk & Morf Ikan', 'Products & Morphs'),
            icon: Fish,
            iconClass: 'text-dunia-blue',
            active: url === '/seller/products' || /^\/seller\/products\/\d+\/edit/.test(url),
        },
        {
            href: '/seller/products/create',
            label: pick('Tambah Produk Baru', 'Add New Product'),
            icon: PlusCircle,
            iconClass: 'text-emerald-600',
            active: url.startsWith('/seller/products/create'),
        },
        {
            href: '/seller/orders',
            label: pick('Pesanan Masuk', 'Incoming Orders'),
            icon: Package,
            iconClass: 'text-amber-600',
            active: url.startsWith('/seller/orders'),
        },
        {
            href: '/seller/store',
            label: pick('Profil & Garansi DOA', 'Store & DOA Policy'),
            icon: ShieldCheck,
            iconClass: 'text-dunia-marine',
            active: url.startsWith('/seller/store'),
        },
    ];

    return (
        <div className="relative isolate min-h-screen aquatic-canvas-ambient text-[#001454] dark:text-[#e4e7ff] flex flex-col font-sans overflow-x-clip transition-colors duration-200">
            {/* Top Seller Bar */}
            <header className="bg-white/90 dark:bg-[#0e1424]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                        <Link
                            href="/"
                            aria-label={pick('Kembali ke Toko Publik', 'Back to Public Storefront')}
                            className="p-1.5 -ml-1.5 sm:p-0 sm:ml-0 rounded-lg text-slate-500 dark:text-slate-400 hover:text-dunia-navy dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 sm:hover:bg-transparent flex items-center gap-1.5 text-xs font-semibold shrink-0 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">{pick('Kembali ke Toko Publik', 'Back to Storefront')}</span>
                        </Link>
                        <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                            <BrandWordmark className="h-7 sm:h-8 shrink-0" />
                            <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-blue-100 dark:bg-[#0684E5]/20 text-dunia-blue dark:text-sky-300 text-[10px] sm:text-[11px] font-bold uppercase whitespace-nowrap">
                                {pick('Portal Penjual', 'Seller Portal')}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <LanguageSwitcher />
                        <AnimatedThemeToggler
                            darkMode={darkMode}
                            onToggle={(event) => toggleThemeWithTransition(event, !darkMode, setDarkMode)}
                            label={pick('Ubah Tema', 'Toggle Theme')}
                            title={darkMode ? pick('Tema Terang', 'Light Theme') : pick('Tema Gelap', 'Dark Theme')}
                            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        />
                        <Link
                            href="/profile"
                            className="flex items-center gap-2 rounded-full p-0.5 sm:pr-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title={pick('Pengaturan Profil Akun', 'Account Profile Settings')}
                            aria-label={pick('Pengaturan Profil Akun', 'Account Profile Settings')}
                        >
                            <UserAvatar user={auth.user} className="w-7 h-7 text-[11px]" />
                            <span className="hidden sm:inline text-sm font-semibold text-slate-800 dark:text-slate-200 max-w-[160px] truncate">
                                {store?.name || auth.user.name}
                            </span>
                        </Link>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition whitespace-nowrap shrink-0"
                        >
                            {pick('Keluar', 'Sign Out')}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Flash Messages */}
            {showFlash && (flash?.success || flash?.error) && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
                    {flash.success && (
                        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between text-sm shadow-xs">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span className="font-medium">{flash.success}</span>
                            </div>
                            <button onClick={() => setShowFlash(false)} className="text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-200">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    {flash.error && (
                        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center justify-between text-sm shadow-xs">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                                <span className="font-medium">{flash.error}</span>
                            </div>
                            <button onClick={() => setShowFlash(false)} className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-200">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 w-full grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-8">
                {/* Sidebar Navigation */}
                <aside className="md:col-span-1 space-y-2.5 md:space-y-3 min-w-0">
                    <div className="bg-white dark:bg-[#0e1424] p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-dunia-blue/10 dark:bg-[#0684E5]/20 text-dunia-blue dark:text-[#4AB8BD] flex items-center justify-center font-bold shrink-0">
                                <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-slate-900 dark:text-white truncate text-sm">{store?.name || pick('Toko Belum Dinamai', 'Unnamed Store')}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{store?.city || 'Indonesia'}</p>
                            </div>
                        </div>
                    </div>

                    <nav className="bg-white dark:bg-[#0e1424] rounded-2xl border border-slate-200 dark:border-slate-800 p-1.5 sm:p-2 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible shadow-xs text-xs sm:text-sm font-semibold">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`shrink-0 whitespace-nowrap flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl transition ${
                                        item.active
                                            ? 'bg-sky-50 dark:bg-[#0684E5]/15 text-dunia-blue dark:text-[#4AB8BD] font-bold'
                                            : 'text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-800/80 hover:text-dunia-blue dark:hover:text-[#4AB8BD]'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 shrink-0 ${item.iconClass}`} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main View Area */}
                <main className="md:col-span-3 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
