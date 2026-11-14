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
    const { auth, flash } = usePage().props;
    const store = auth?.user?.store;
    const [showFlash, setShowFlash] = useState(true);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Top Seller Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-slate-500 hover:text-dunia-navy flex items-center gap-1.5 text-xs font-semibold">
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Toko Publik
                        </Link>
                        <span className="text-slate-300">|</span>
                        <div className="flex items-center gap-2">
                            <span className="font-extrabold text-dunia-navy text-lg">DUNIA<span className="text-dunia-blue">IKAN</span></span>
                            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-dunia-blue text-[11px] font-bold uppercase">
                                Portal Penjual
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/profile"
                            className="flex items-center gap-2 rounded-full pr-2 hover:bg-slate-100 transition"
                            title="Pengaturan Profil Akun"
                        >
                            <UserAvatar user={auth.user} className="w-7 h-7 text-[11px]" />
                            <span className="text-sm font-semibold text-slate-800">{store?.name || auth.user.name}</span>
                        </Link>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition"
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <aside className="md:col-span-1 space-y-2">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-dunia-blue/10 text-dunia-blue flex items-center justify-center font-bold">
                                <Store className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate text-sm">{store?.name || 'Toko Belum Dinamai'}</p>
                                <p className="text-xs text-slate-500 truncate">{store?.city || 'Indonesia'}</p>
                            </div>
                        </div>
                    </div>

                    <nav className="bg-white rounded-2xl border border-slate-200 p-2 space-y-1 shadow-xs text-sm font-semibold">
                        <Link
                            href="/seller/products"
                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-sky-50 hover:text-dunia-blue transition"
                        >
                            <Fish className="w-4 h-4 text-dunia-blue" />
                            Produk & Morf Ikan
                        </Link>
                        <Link
                            href="/seller/products/create"
                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-sky-50 hover:text-dunia-blue transition"
                        >
                            <PlusCircle className="w-4 h-4 text-emerald-600" />
                            Tambah Produk Baru
                        </Link>
                        <Link
                            href="/seller/orders"
                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-sky-50 hover:text-dunia-blue transition"
                        >
                            <Package className="w-4 h-4 text-amber-600" />
                            Pesanan Masuk
                        </Link>
                        <Link
                            href="/seller/store"
                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-sky-50 hover:text-dunia-blue transition"
                        >
                            <ShieldCheck className="w-4 h-4 text-dunia-marine" />
                            Profil & Garansi DOA
                        </Link>
                    </nav>
                </aside>

                {/* Main View Area */}
                <main className="md:col-span-3">
                    {children}
                </main>
            </div>
        </div>
    );
}
