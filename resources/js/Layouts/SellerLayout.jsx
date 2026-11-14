import { Link, usePage } from '@inertiajs/react';
import UserAvatar from '@/Components/UserAvatar';
import { 
    Store, 
    Fish, 
    Package, 
    PlusCircle, 
    ArrowLeft, 
    ShieldCheck, 
    LogOut,
    CheckCircle2,
    AlertCircle,
    X
} from 'lucide-react';
import { useState } from 'react';

export default function SellerLayout({ children, title }) {
    const { url, props } = usePage();
    const { auth, flash } = props;
    const store = auth?.user?.store;
    const [showFlash, setShowFlash] = useState(true);

    const navItems = [
        {
            href: '/seller/products',
            label: 'Produk & Morf Ikan',
            icon: Fish,
            iconClass: 'text-dunia-blue',
            active: url === '/seller/products' || /^\/seller\/products\/\d+\/edit/.test(url),
        },
        {
            href: '/seller/products/create',
            label: 'Tambah Produk Baru',
            icon: PlusCircle,
            iconClass: 'text-emerald-600',
            active: url.startsWith('/seller/products/create'),
        },
        {
            href: '/seller/orders',
            label: 'Pesanan Masuk',
            icon: Package,
            iconClass: 'text-amber-600',
            active: url.startsWith('/seller/orders'),
        },
        {
            href: '/seller/store',
            label: 'Profil & Garansi DOA',
            icon: ShieldCheck,
            iconClass: 'text-dunia-marine',
            active: url.startsWith('/seller/store'),
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-clip">
            {/* Top Seller Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                        <Link
                            href="/"
                            aria-label="Kembali ke Toko Publik"
                            className="p-1.5 -ml-1.5 sm:p-0 sm:ml-0 rounded-lg text-slate-500 hover:text-dunia-navy hover:bg-slate-100 sm:hover:bg-transparent flex items-center gap-1.5 text-xs font-semibold shrink-0 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Kembali ke Toko Publik</span>
                        </Link>
                        <span className="hidden sm:inline text-slate-300">|</span>
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                            <span className="font-extrabold text-dunia-navy text-base sm:text-lg whitespace-nowrap">
                                DUNIA<span className="text-dunia-blue">IKAN</span>
                            </span>
                            <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-blue-100 text-dunia-blue text-[10px] sm:text-[11px] font-bold uppercase whitespace-nowrap">
                                Portal Penjual
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <Link
                            href="/profile"
                            className="flex items-center gap-2 rounded-full p-0.5 sm:pr-2 hover:bg-slate-100 transition"
                            title="Pengaturan Profil Akun"
                            aria-label="Pengaturan Profil Akun"
                        >
                            <UserAvatar user={auth.user} className="w-7 h-7 text-[11px]" />
                            <span className="hidden sm:inline text-sm font-semibold text-slate-800 max-w-[160px] truncate">
                                {store?.name || auth.user.name}
                            </span>
                        </Link>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="px-2 py-1 text-xs font-semibold text-slate-500 hover:text-rose-600 transition whitespace-nowrap shrink-0"
                        >
                            Keluar
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
                {/* Sidebar Navigation */}
                <aside className="md:col-span-1 space-y-2.5 md:space-y-3 min-w-0">
                    <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-dunia-blue/10 text-dunia-blue flex items-center justify-center font-bold shrink-0">
                                <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate text-sm">{store?.name || 'Toko Belum Dinamai'}</p>
                                <p className="text-xs text-slate-500 truncate">{store?.city || 'Indonesia'}</p>
                            </div>
                        </div>
                    </div>

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
