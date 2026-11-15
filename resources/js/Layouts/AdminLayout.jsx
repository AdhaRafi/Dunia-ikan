import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Folders, 
    BookOpen, 
    Users, 
    ReceiptText, 
    ArrowLeft, 
    ShieldAlert, 
    CheckCircle2, 
    AlertCircle, 
    X 
} from 'lucide-react';
import { useState } from 'react';
import { LanguageSwitcher, useLanguage } from '@/lib/i18n';

export default function AdminLayout({ children, title }) {
    const { url, props } = usePage();
    const { pick } = useLanguage();
    const { auth, flash, pendingSellerCount = 0 } = props;
    const [showFlash, setShowFlash] = useState(true);

    const navItems = [
        { href: '/admin-portal', label: pick('Ringkasan Platform', 'Platform Overview'), icon: LayoutDashboard, iconClass: 'text-purple-600', active: url === '/admin-portal' || url === '/admin' },
        { href: '/admin-portal/categories', label: pick('Kelola Kategori', 'Manage Categories'), icon: Folders, iconClass: 'text-dunia-blue', active: url.includes('/categories') },
        { href: '/admin-portal/guides', label: pick('Panduan Chatbot Ikan', 'Fish Care Guides'), icon: BookOpen, iconClass: 'text-emerald-600', active: url.includes('/guides') },
        { href: '/admin-portal/users', label: pick('Manajemen Pengguna', 'User Management'), icon: Users, iconClass: 'text-amber-600', badge: pendingSellerCount, active: url.includes('/users') },
        { href: '/admin-portal/transactions', label: pick('Semua Transaksi', 'All Transactions'), icon: ReceiptText, iconClass: 'text-sky-600', active: url.includes('/transactions') },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-clip">
            {/* Header */}
            <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                        <Link
                            href="/"
                            aria-label={pick('Kembali ke Marketplace', 'Back to Marketplace')}
                            className="p-1.5 -ml-1.5 sm:p-0 sm:ml-0 rounded-lg text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold shrink-0 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">{pick('Kembali ke Marketplace', 'Back to Marketplace')}</span>
                        </Link>
                        <span className="hidden sm:inline text-slate-700">|</span>
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                            <span className="font-extrabold text-white text-base sm:text-lg whitespace-nowrap">DUNIA<span className="text-dunia-aqua">IKAN</span></span>
                            <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] sm:text-[11px] font-bold uppercase border border-purple-500/30 whitespace-nowrap">
                                Super Admin
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 text-xs shrink-0">
                        <a
                            href="/admin"
                            className="px-2 sm:px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition whitespace-nowrap"
                        >
                            <span className="hidden sm:inline">{pick('Panel Filament', 'Filament Panel')}</span>
                            <span className="sm:hidden">Filament</span>
                        </a>
                        <LanguageSwitcher variant="overlay" />
                        <span className="hidden sm:inline font-semibold text-slate-300 max-w-[160px] truncate">{auth.user.name}</span>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="font-semibold text-rose-400 hover:text-rose-300 transition whitespace-nowrap"
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
                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-sm shadow-xs">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                <span className="font-medium">{flash.success}</span>
                            </div>
                            <button onClick={() => setShowFlash(false)} className="text-emerald-500 hover:text-emerald-700">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    {flash.error && (
                        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between text-sm shadow-xs">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                                <span className="font-medium">{flash.error}</span>
                            </div>
                            <button onClick={() => setShowFlash(false)} className="text-rose-500 hover:text-rose-700">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 w-full grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-8">
                {/* Sidebar */}
                <aside className="md:col-span-1 space-y-2 min-w-0">
                    <nav className="bg-white rounded-2xl border border-slate-200 p-1.5 sm:p-2 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible shadow-xs text-xs sm:text-sm font-semibold">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`shrink-0 whitespace-nowrap flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl transition ${
                                        item.active
                                            ? 'bg-sky-50 text-dunia-blue font-bold'
                                            : 'text-slate-700 hover:bg-sky-50 hover:text-dunia-blue'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 shrink-0 ${item.iconClass}`} />
                                    <span>{item.label}</span>
                                    {item.badge > 0 && (
                                        <span className="ml-auto px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Content */}
                <main className="md:col-span-3 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
