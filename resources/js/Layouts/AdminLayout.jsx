import { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Bell,
    BookOpen,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Download,
    FileBarChart2,
    Folders,
    Globe,
    LayoutDashboard,
    LogOut,
    Menu,
    PieChart,
    ReceiptText,
    Search,
    ShieldCheck,
    Users,
    X,
} from 'lucide-react';
import { LanguageSwitcher, useLanguage } from '@/lib/i18n';

export default function AdminLayout({ children }) {
    const { url, props } = usePage();
    const { pick } = useLanguage();
    const { auth, flash, pendingSellerCount = 0 } = props;

    const [showFlash, setShowFlash] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [reportOpen, setReportOpen] = useState(true);
    const [topSearch, setTopSearch] = useState('');

    useEffect(() => {
        if (!mobileMenuOpen) {
            return;
        }

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [mobileMenuOpen]);

    const handleGlobalSearch = (event) => {
        event.preventDefault();
        const trimmed = topSearch.trim();
        router.get(
            '/admin-portal/transactions',
            trimmed ? { q: trimmed } : {},
            { preserveScroll: false },
        );
        setMobileMenuOpen(false);
    };

    const isDashboardActive = url === '/admin-portal' || url === '/admin-portal/';
    const isReportsSectionActive =
        url.includes('/admin-portal/reports') || url.includes('/admin-portal/transactions');

    const userInitial = (auth?.user?.name?.trim()?.charAt(0) || 'A').toUpperCase();

    const renderSidebarNav = (collapsed = false, closeMobile = () => {}) => (
        <div className="flex flex-1 flex-col justify-between px-3 py-3 overflow-y-auto">
            <nav aria-label={pick('Navigasi Admin', 'Admin Navigation')} className="space-y-1.5 text-[13px]">
                {/* Dashboard */}
                <Link
                    href="/admin-portal"
                    onClick={closeMobile}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition ${
                        isDashboardActive
                            ? 'text-white font-semibold bg-white/[0.06]'
                            : 'text-[#B4BAC8] hover:text-white hover:bg-white/[0.04]'
                    }`}
                    title={collapsed ? pick('Dashboard', 'Dashboard') : undefined}
                >
                    <LayoutDashboard
                        className={`h-[18px] w-[18px] shrink-0 stroke-[1.7] ${
                            isDashboardActive ? 'text-[#00C0E8]' : 'text-[#9CA3AF]'
                        }`}
                    />
                    {!collapsed && <span>{pick('Dashboard', 'Dashboard')}</span>}
                </Link>

                {/* Accordion: Laporan & Transaksi (Equify style) */}
                <div>
                    <button
                        type="button"
                        onClick={() => {
                            if (collapsed) {
                                setSidebarCollapsed(false);
                                setReportOpen(true);
                            } else {
                                setReportOpen((prev) => !prev);
                            }
                        }}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 font-medium transition ${
                            isReportsSectionActive || reportOpen
                                ? 'text-white font-semibold'
                                : 'text-[#B4BAC8] hover:text-white hover:bg-white/[0.04]'
                        }`}
                        title={collapsed ? pick('Laporan', 'Reports') : undefined}
                    >
                        <span className="flex items-center gap-3">
                            <PieChart
                                className={`h-[18px] w-[18px] shrink-0 stroke-[1.7] ${
                                    isReportsSectionActive || reportOpen
                                        ? 'text-[#00C0E8]'
                                        : 'text-[#9CA3AF]'
                                }`}
                            />
                            {!collapsed && <span>{pick('Laporan', 'Reports')}</span>}
                        </span>
                        {!collapsed &&
                            (reportOpen ? (
                                <ChevronUp className="h-4 w-4 text-[#9CA3AF]" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-[#9CA3AF]" />
                            ))}
                    </button>

                    {!collapsed && reportOpen && (
                        <div className="mt-1 rounded-xl bg-[#1C1E24] border border-white/[0.05] p-1.5 space-y-0.5">
                            <Link
                                href="/admin-portal/transactions"
                                onClick={closeMobile}
                                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12.5px] transition ${
                                    url.includes('/transactions')
                                        ? 'bg-white/[0.06] font-semibold text-white'
                                        : 'text-[#A5ACB9] hover:text-white hover:bg-white/[0.03]'
                                }`}
                            >
                                <ReceiptText className="h-3.5 w-3.5 shrink-0" />
                                <span>{pick('Semua Transaksi', 'All Transactions')}</span>
                            </Link>
                            <Link
                                href="/admin-portal/reports"
                                onClick={closeMobile}
                                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12.5px] transition ${
                                    url.includes('/reports')
                                        ? 'bg-white/[0.06] font-semibold text-white'
                                        : 'text-[#A5ACB9] hover:text-white hover:bg-white/[0.03]'
                                }`}
                            >
                                <FileBarChart2 className="h-3.5 w-3.5 shrink-0" />
                                <span>{pick('Laporan Transaksi', 'Transaction Report')}</span>
                            </Link>
                            <a
                                href="/admin-portal/reports/export"
                                onClick={closeMobile}
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12.5px] text-[#A5ACB9] hover:text-white hover:bg-white/[0.03] transition"
                            >
                                <Download className="h-3.5 w-3.5 shrink-0" />
                                <span>{pick('Unduh CSV', 'Download CSV')}</span>
                            </a>
                        </div>
                    )}
                </div>

                {/* Kategori */}
                <Link
                    href="/admin-portal/categories"
                    onClick={closeMobile}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition ${
                        url.includes('/categories')
                            ? 'text-white font-semibold bg-white/[0.06]'
                            : 'text-[#B4BAC8] hover:text-white hover:bg-white/[0.04]'
                    }`}
                    title={collapsed ? pick('Kategori Produk', 'Categories') : undefined}
                >
                    <Folders
                        className={`h-[18px] w-[18px] shrink-0 stroke-[1.7] ${
                            url.includes('/categories') ? 'text-[#00C0E8]' : 'text-[#9CA3AF]'
                        }`}
                    />
                    {!collapsed && <span>{pick('Kategori Produk', 'Categories')}</span>}
                </Link>

                {/* Panduan Kiko */}
                <Link
                    href="/admin-portal/guides"
                    onClick={closeMobile}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition ${
                        url.includes('/guides')
                            ? 'text-white font-semibold bg-white/[0.06]'
                            : 'text-[#B4BAC8] hover:text-white hover:bg-white/[0.04]'
                    }`}
                    title={collapsed ? pick('Panduan Chatbot Kiko', 'Kiko Fish Guides') : undefined}
                >
                    <BookOpen
                        className={`h-[18px] w-[18px] shrink-0 stroke-[1.7] ${
                            url.includes('/guides') ? 'text-[#00C0E8]' : 'text-[#9CA3AF]'
                        }`}
                    />
                    {!collapsed && <span>{pick('Panduan Ikan Kiko', 'Kiko Guides')}</span>}
                </Link>

                {/* Pengguna & Verifikasi Penjual */}
                <Link
                    href="/admin-portal/users"
                    onClick={closeMobile}
                    className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 font-medium transition ${
                        url.includes('/users')
                            ? 'text-white font-semibold bg-white/[0.06]'
                            : 'text-[#B4BAC8] hover:text-white hover:bg-white/[0.04]'
                    }`}
                    title={collapsed ? pick('Pengguna & Penjual', 'Users & Sellers') : undefined}
                >
                    <span className="flex items-center gap-3 min-w-0">
                        <Users
                            className={`h-[18px] w-[18px] shrink-0 stroke-[1.7] ${
                                url.includes('/users') ? 'text-[#00C0E8]' : 'text-[#9CA3AF]'
                            }`}
                        />
                        {!collapsed && (
                            <span className="truncate">{pick('Pengguna & Penjual', 'Users & Sellers')}</span>
                        )}
                    </span>
                    {!collapsed && pendingSellerCount > 0 && (
                        <span className="shrink-0 rounded-full bg-[#00C0E8] px-2 py-0.5 text-[10px] font-bold text-[#0E1117]">
                            {pendingSellerCount}
                        </span>
                    )}
                </Link>

                <div className="my-2 border-t border-white/[0.07]" />

                {/* Panel Filament */}
                <a
                    href="/admin"
                    onClick={closeMobile}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-[#B4BAC8] hover:text-white hover:bg-white/[0.04] transition"
                    title={collapsed ? pick('Panel Filament', 'Filament Panel') : undefined}
                >
                    <ShieldCheck className="h-[18px] w-[18px] shrink-0 stroke-[1.7] text-[#9CA3AF]" />
                    {!collapsed && <span>{pick('Panel Filament', 'Filament Panel')}</span>}
                </a>

                {/* Lihat Marketplace */}
                <Link
                    href="/"
                    onClick={closeMobile}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-[#B4BAC8] hover:text-white hover:bg-white/[0.04] transition"
                    title={collapsed ? pick('Lihat Marketplace', 'View Marketplace') : undefined}
                >
                    <Globe className="h-[18px] w-[18px] shrink-0 stroke-[1.7] text-[#9CA3AF]" />
                    {!collapsed && <span>{pick('Lihat Marketplace', 'View Storefront')}</span>}
                </Link>
            </nav>

            <div className="pt-3 mt-3 border-t border-white/[0.07]">
                <Link
                    href="/admin-portal/logout"
                    method="post"
                    as="button"
                    onClick={closeMobile}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
                >
                    <LogOut className="h-[18px] w-[18px] shrink-0 stroke-[1.7]" />
                    {!collapsed && <span>{pick('Keluar Admin', 'Sign Out')}</span>}
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#15171C] text-slate-100 flex font-sans overflow-x-clip print:block print:bg-white print:text-slate-900">
            {/* Desktop Left Dark Sidebar */}
            <aside
                className={`hidden md:flex flex-col shrink-0 bg-[#15171C] border-r border-white/[0.04] transition-all duration-200 print:hidden ${
                    sidebarCollapsed ? 'w-[74px]' : 'w-[238px]'
                }`}
            >
                {/* Brand & Collapse Header */}
                <div className="h-16 px-4 flex items-center justify-between shrink-0">
                    <Link
                        href="/admin-portal"
                        className="flex items-center gap-2.5 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C0E8] rounded-lg"
                    >
                        <svg viewBox="0 0 28 24" className="h-6 w-7 shrink-0" aria-hidden="true">
                            <defs>
                                <linearGradient id="di-eq-a" x1="0" y1="1" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#00C0FF" />
                                    <stop offset="100%" stopColor="#3B82F6" />
                                </linearGradient>
                            </defs>
                            <polygon points="10,2 20,21 0,21" fill="url(#di-eq-a)" />
                            <polygon points="18,6 27,21 11,21" fill="#38BDF8" fillOpacity="0.88" />
                        </svg>
                        {!sidebarCollapsed && (
                            <span className="text-[19px] font-extrabold tracking-tight text-white lowercase truncate">
                                dunia ikan
                            </span>
                        )}
                    </Link>

                    <button
                        type="button"
                        onClick={() => setSidebarCollapsed((prev) => !prev)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-white/[0.06] hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C0E8]"
                        aria-label={pick('Ciutkan menu samping', 'Toggle sidebar')}
                    >
                        <Menu className="h-4 w-4" />
                    </button>
                </div>

                {renderSidebarNav(sidebarCollapsed)}
            </aside>

            {/* Mobile Slide-Over Sidebar Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden print:hidden">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-[1px]"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-hidden="true"
                    />
                    <aside className="relative z-10 flex w-[264px] max-w-[85vw] flex-col bg-[#15171C] border-r border-white/10 shadow-2xl">
                        <div className="h-16 px-4 flex items-center justify-between border-b border-white/[0.06]">
                            <span className="text-[18px] font-extrabold tracking-tight text-white lowercase">
                                dunia ikan
                            </span>
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
                                aria-label={pick('Tutup menu', 'Close menu')}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        {renderSidebarNav(false, () => setMobileMenuOpen(false))}
                    </aside>
                </div>
            )}

            {/* Right Main Column: Dark Top Bar + Rounded Light Canvas */}
            <div className="flex-1 min-w-0 flex flex-col md:pr-3 md:pb-3 print:block print:p-0">
                {/* Dark Top Header Utility Bar */}
                <header className="h-16 px-3 sm:px-5 md:px-2 flex items-center justify-between gap-3 shrink-0 bg-[#15171C] print:hidden">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#202228] text-slate-200 hover:text-white border border-white/[0.06]"
                            aria-label={pick('Buka menu navigasi', 'Open navigation menu')}
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        <form onSubmit={handleGlobalSearch} className="flex-1 max-w-[360px]">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                                <input
                                    type="search"
                                    value={topSearch}
                                    onChange={(e) => setTopSearch(e.target.value)}
                                    placeholder={pick(
                                        'Cari pesanan, toko, pembeli...',
                                        'Search orders, stores, buyers...',
                                    )}
                                    className="w-full h-9 rounded-lg bg-[#202228] border border-white/[0.06] pl-9 pr-3 text-xs text-white placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#00C0E8]"
                                />
                            </div>
                        </form>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <LanguageSwitcher variant="overlay" />

                        <Link
                            href="/admin-portal/users?seller_status=pending"
                            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#B4BAC8] hover:bg-white/[0.06] hover:text-white transition"
                            title={pick('Pengajuan penjual menunggu verifikasi', 'Pending seller applications')}
                            aria-label={pick('Notifikasi pengajuan penjual', 'Seller verification notifications')}
                        >
                            <Bell className="h-[18px] w-[18px]" />
                            {pendingSellerCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#00C0E8] px-1 text-[10px] font-bold text-[#0E1117]">
                                    {pendingSellerCount}
                                </span>
                            )}
                        </Link>

                        <div className="flex items-center gap-2.5 pl-1">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#242832] border border-white/15 text-xs font-bold text-[#00C0E8]">
                                {userInitial}
                            </div>
                            <div className="hidden sm:block text-left leading-tight">
                                <p className="text-[12.5px] font-semibold text-white max-w-[130px] truncate">
                                    {auth?.user?.name}
                                </p>
                                <p className="text-[10.5px] text-[#9CA3AF]">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Crisp Off-White Workspace Canvas */}
                <main className="flex-1 bg-[#F4F6F8] text-slate-900 rounded-t-2xl md:rounded-[20px] border border-white/[0.08] p-4 sm:p-6 lg:p-7 shadow-xl min-w-0 print:bg-white print:p-0 print:rounded-none print:border-0 print:shadow-none">
                    {/* Flash Messages */}
                    {showFlash && (flash?.success || flash?.error) && (
                        <div className="mb-5 space-y-2 print:hidden">
                            {flash.success && (
                                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-xs sm:text-sm shadow-2xs">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span className="font-medium">{flash.success}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowFlash(false)}
                                        className="text-emerald-600 hover:text-emerald-800"
                                        aria-label={pick('Tutup notifikasi', 'Dismiss notification')}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            {flash.error && (
                                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between text-xs sm:text-sm shadow-2xs">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                        <span className="font-medium">{flash.error}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowFlash(false)}
                                        className="text-rose-600 hover:text-rose-800"
                                        aria-label={pick('Tutup notifikasi', 'Dismiss notification')}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {children}
                </main>
            </div>
        </div>
    );
}
