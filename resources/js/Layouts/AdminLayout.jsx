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

export default function AdminLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const [showFlash, setShowFlash] = useState(true);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold">
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Marketplace
                        </Link>
                        <span className="text-slate-700">|</span>
                        <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white text-lg">DUNIA<span className="text-dunia-aqua">IKAN</span></span>
                            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[11px] font-bold uppercase border border-purple-500/30">
                                Super Admin
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                        <span className="font-semibold text-slate-300">{auth.user.name}</span>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="font-semibold text-rose-400 hover:text-rose-300 transition"
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
                {/* Sidebar */}
                <aside className="md:col-span-1 space-y-2">
                    <nav className="bg-white rounded-2xl border border-slate-200 p-2 space-y-1 shadow-xs text-sm font-semibold">
                        <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-sky-50 hover:text-dunia-blue transition"
                        >
                            <LayoutDashboard className="w-4 h-4 text-purple-600" />
                            Ringkasan Platform
                        </Link>
                        <Link
                            href="/admin/categories"
                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-sky-50 hover:text-dunia-blue transition"
                        >
                            <Folders className="w-4 h-4 text-dunia-blue" />
                            Kelola Kategori
                        </Link>
                        <Link
                            href="/admin/guides"
                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-sky-50 hover:text-dunia-blue transition"
                        >
                            <BookOpen className="w-4 h-4 text-emerald-600" />
                            Panduan Chatbot Ikan
                        </Link>
                        <Link
                            href="/admin/users"
                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-sky-50 hover:text-dunia-blue transition"
                        >
                            <Users className="w-4 h-4 text-amber-600" />
                            Manajemen Pengguna
                        </Link>
                        <Link
                            href="/admin/transactions"
                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-sky-50 hover:text-dunia-blue transition"
                        >
                            <ReceiptText className="w-4 h-4 text-sky-600" />
                            Semua Transaksi
                        </Link>
                    </nav>
                </aside>

                {/* Content */}
                <main className="md:col-span-3">
                    {children}
                </main>
            </div>
        </div>
    );
}
