import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Search, 
    Menu, 
    X, 
    ShoppingCart, 
    ChevronDown, 
    Phone, 
    Sparkles, 
    Fish, 
    ShieldCheck, 
    HeartPulse,
    User
} from 'lucide-react';

export default function Navbar({ onOpenChat }) {
    const { auth, cartCount, navCategories } = usePage().props;
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/products?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    return (
        <header className="sticky top-0 z-40 w-full shadow-lg">
            {/* Top utility line (like reference) */}
            <div className="bg-[#0A1214] text-slate-400 text-xs py-2 border-b border-slate-800/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5 hover:text-white transition">
                            <Phone className="w-3 h-3 text-[#00C882]" />
                            <span>+62 812-8864-4725</span>
                        </span>
                        <span className="hidden sm:inline-block text-slate-600">|</span>
                        <div className="hidden sm:flex items-center gap-3 text-[11px]">
                            <span className="hover:text-emerald-400 cursor-pointer transition">Facebook</span>
                            <span className="hover:text-emerald-400 cursor-pointer transition">Instagram</span>
                            <span className="hover:text-emerald-400 cursor-pointer transition">YouTube</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-[11px]">
                        <Link href="/guides" className="hover:text-[#00C882] transition hidden md:inline">
                            Panduan Biologi
                        </Link>
                        <span className="text-slate-700 hidden md:inline">•</span>
                        <span className="text-emerald-400/90 font-medium hidden sm:inline">
                            Garansi Ikan Hidup 100%
                        </span>
                        <span className="text-slate-700 hidden sm:inline">•</span>
                        <Link href={user ? (user.role === 'seller' ? '/seller/products' : '/seller/register') : '/register'} className="text-[#00C882] hover:text-white font-semibold transition">
                            Buka Toko Penangkar
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <div className="bg-[#0E1719]/95 backdrop-blur-md border-b border-emerald-950/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between gap-4">
                        {/* Brand Logo (like reference Wild World with vibrant glowing animal mark) */}
                        <Link href="/" className="flex items-center gap-3 shrink-0 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00C882] to-emerald-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
                                <Fish className="w-6 h-6 text-[#0A1214]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
                                    DUNIA <span className="text-[#00C882]">IKAN</span>
                                </span>
                                <span className="text-[10px] tracking-widest font-semibold text-slate-400 uppercase">
                                    Aquatic Morph & Care
                                </span>
                            </div>
                        </Link>

                        {/* Search Bar */}
                        <form onSubmit={handleSearchSubmit} className="hidden lg:block relative max-w-xs xl:max-w-sm w-full mx-2">
                            <input
                                type="search"
                                placeholder="Cari ikan, morph, penangkar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full text-xs py-2 pl-9 pr-3 rounded-xl bg-[#142224] text-slate-200 placeholder:text-slate-500 border border-slate-700/60 focus:outline-none focus:border-[#00C882] focus:ring-1 focus:ring-[#00C882] transition"
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        </form>

                        {/* Middle Navigation Links (with green active underline like reference) */}
                        <nav className="hidden md:flex items-center gap-7 text-xs font-bold tracking-wider uppercase">
                            <Link 
                                href="/" 
                                className="text-white hover:text-[#00C882] py-2 border-b-2 border-[#00C882] transition"
                            >
                                Beranda
                            </Link>
                            <Link 
                                href="/products" 
                                className="text-slate-300 hover:text-[#00C882] py-2 border-b-2 border-transparent hover:border-[#00C882] transition flex items-center gap-1"
                            >
                                Katalog Ikan
                                <ChevronDown className="w-3 h-3 text-slate-500" />
                            </Link>
                            <Link 
                                href="/guides" 
                                className="text-slate-300 hover:text-[#00C882] py-2 border-b-2 border-transparent hover:border-[#00C882] transition"
                            >
                                Panduan Rawat
                            </Link>
                            {onOpenChat && (
                                <button
                                    type="button"
                                    onClick={onOpenChat}
                                    className="text-slate-300 hover:text-[#00C882] py-2 border-b-2 border-transparent hover:border-[#00C882] transition flex items-center gap-1.5"
                                >
                                    <span className="w-2 h-2 rounded-full bg-[#00C882] animate-pulse"></span>
                                    Asisten AI
                                </button>
                            )}
                        </nav>

                        {/* Right Actions: Cart & Green CTA Button (like "TICKETS" button in reference) */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/cart"
                                className="relative p-2.5 text-slate-300 hover:text-white rounded-xl bg-[#142224] border border-slate-800 transition"
                                title="Keranjang Belanja"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#00C882] text-slate-950 px-1 text-[11px] font-extrabold shadow-sm">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                        className="flex items-center gap-2 text-xs font-bold text-white bg-[#142224] border border-slate-700/60 rounded-xl px-3 py-2 hover:border-[#00C882] transition"
                                    >
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00C882] text-slate-950 text-xs font-extrabold uppercase">
                                            {user.name.charAt(0)}
                                        </span>
                                        <span className="hidden sm:inline max-w-[100px] truncate">
                                            {user.name}
                                        </span>
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                    </button>

                                    {userDropdownOpen && (
                                        <div
                                            className="absolute right-0 z-50 mt-2 w-56 rounded-xl bg-[#142224] border border-slate-700/80 shadow-2xl py-2 text-xs text-slate-200"
                                            onClick={() => setUserDropdownOpen(false)}
                                        >
                                            <div className="px-4 py-2 border-b border-slate-800">
                                                <p className="font-bold text-white truncate">{user.name}</p>
                                                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                                            </div>

                                            <Link href="/orders" className="block px-4 py-2 hover:bg-[#00C882]/10 hover:text-[#00C882] transition">
                                                Pesanan Saya
                                            </Link>
                                            <Link href="/addresses" className="block px-4 py-2 hover:bg-[#00C882]/10 hover:text-[#00C882] transition">
                                                Buku Alamat
                                            </Link>

                                            {user.role === 'seller' && (
                                                <div className="border-t border-slate-800 my-1 pt-1">
                                                    <span className="px-4 text-[10px] font-bold text-[#00C882] uppercase tracking-wider block mb-1">
                                                        Panel Toko
                                                    </span>
                                                    <Link href="/seller/products" className="block px-4 py-1.5 hover:bg-[#00C882]/10 hover:text-[#00C882] transition">
                                                        Kelola Produk
                                                    </Link>
                                                    <Link href="/seller/orders" className="block px-4 py-1.5 hover:bg-[#00C882]/10 hover:text-[#00C882] transition">
                                                        Pesanan Masuk
                                                    </Link>
                                                    <Link href="/seller/store" className="block px-4 py-1.5 hover:bg-[#00C882]/10 hover:text-[#00C882] transition">
                                                        Profil Toko
                                                    </Link>
                                                </div>
                                            )}

                                            <div className="border-t border-slate-800 mt-1 pt-1">
                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    className="block w-full text-left px-4 py-2 text-rose-400 hover:bg-rose-500/10 transition"
                                                >
                                                    Keluar
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        href="/login"
                                        className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 transition hidden sm:inline"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/products"
                                        className="px-5 py-2.5 rounded-lg bg-[#00C882] hover:bg-emerald-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-md shadow-emerald-500/20 transition duration-200"
                                    >
                                        JELAJAHI KATALOG
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Hamburger */}
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 text-slate-300 hover:text-white md:hidden"
                                aria-label="Menu Navigasi"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div className="bg-[#0E1719] border-b border-slate-800 px-5 py-4 md:hidden text-slate-200 space-y-3">
                    <form onSubmit={handleSearchSubmit} className="relative mb-3">
                        <input
                            type="search"
                            placeholder="Cari ikan atau morph..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full text-xs py-2 pl-9 pr-3 rounded-xl bg-[#142224] text-slate-200 placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:border-[#00C882]"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </form>

                    <div className="space-y-2 text-xs font-bold uppercase tracking-wider">
                        <Link href="/" className="block py-1.5 text-[#00C882]">
                            Beranda
                        </Link>
                        <Link href="/products" className="block py-1.5 hover:text-[#00C882]">
                            Katalog Ikan
                        </Link>
                        <Link href="/guides" className="block py-1.5 hover:text-[#00C882]">
                            Panduan Perawatan
                        </Link>
                        {onOpenChat && (
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    onOpenChat();
                                }}
                                className="block py-1.5 text-left text-emerald-400 hover:text-[#00C882]"
                            >
                                Asisten Ikan AI
                            </button>
                        )}
                        {!user && (
                            <Link href="/login" className="block py-1.5 hover:text-[#00C882]">
                                Masuk Akun
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
