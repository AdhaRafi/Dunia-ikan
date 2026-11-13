import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Fish, 
    ShoppingCart, 
    User as UserIcon, 
    Search, 
    Menu, 
    X, 
    Store, 
    ShieldCheck, 
    BookOpen, 
    LayoutDashboard, 
    LogOut,
    PlusCircle,
    ChevronDown
} from 'lucide-react';

export default function Navbar({ onOpenChat }) {
    const { auth, cartCount, navCategories, flash } = usePage().props;
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
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs transition-all">
            {/* Top Bar: Live Fish Shipping Guarantee Notice */}
            <div className="bg-gradient-to-r from-dunia-navy to-dunia-marine text-white text-xs py-1.5 px-4 text-center font-medium">
                <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-dunia-aqua" />
                    Garansi Ikan Hidup (D.O.A. 100%) & Kurir Oksigen Khusus Ikan Hias Terdaftar
                </span>
            </div>

            {/* Main Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 gap-4">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-3 shrink-0 group">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-dunia-navy via-dunia-marine to-dunia-blue flex items-center justify-center text-white shadow-md shadow-dunia-blue/20 group-hover:scale-105 transition-transform">
                            <Fish className="w-6 h-6 transform -rotate-12" />
                        </div>
                        <div>
                            <div className="font-extrabold text-xl tracking-tight text-dunia-navy flex items-center gap-1">
                                DUNIA<span className="text-dunia-blue">IKAN</span>
                            </div>
                            <p className="text-[10px] tracking-wider uppercase text-dunia-marine font-semibold -mt-1">
                                Morph & Fish Marketplace
                            </p>
                        </div>
                    </Link>

                    {/* Search Bar Desktop */}
                    <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
                        <input
                            type="text"
                            placeholder="Cari jenis ikan, morph (e.g. Halfmoon, Maru, AFR)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-sky-200 focus:outline-hidden focus:border-dunia-aqua focus:ring-2 focus:ring-dunia-aqua/20 bg-dunia-soft/40 transition"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <button type="submit" className="sr-only">Cari</button>
                    </form>

                    {/* Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
                        <Link href="/products" className="hover:text-dunia-blue transition">
                            Katalog Ikan
                        </Link>
                        <Link href="/guides" className="hover:text-dunia-blue transition flex items-center gap-1">
                            <BookOpen className="w-4 h-4 text-dunia-marine" />
                            Panduan Perawatan
                        </Link>
                        {onOpenChat && (
                            <button
                                type="button"
                                onClick={onOpenChat}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dunia-aqua/10 text-dunia-navy font-semibold hover:bg-dunia-aqua/20 transition cursor-pointer"
                            >
                                <span className="w-2 h-2 rounded-full bg-dunia-aqua animate-pulse"></span>
                                Asisten Ikan AI
                            </button>
                        )}
                    </nav>

                    {/* Right Action Icons & User Account */}
                    <div className="flex items-center gap-3">
                        {/* Cart Button */}
                        <Link
                            href="/cart"
                            className="relative p-2.5 rounded-xl text-slate-700 hover:text-dunia-blue hover:bg-sky-50 transition"
                            title="Keranjang Belanja"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-dunia-blue text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User Authentication Menu */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-sky-50 border border-slate-200 text-sm font-semibold text-dunia-navy transition cursor-pointer"
                                >
                                    <div className="w-7 h-7 rounded-full bg-dunia-blue/10 text-dunia-blue flex items-center justify-center font-bold text-xs uppercase">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="hidden sm:inline max-w-[120px] truncate">{user.name}</span>
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </button>

                                {userDropdownOpen && (
                                    <div 
                                        className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-sky-100 py-2 z-50 text-sm"
                                        onClick={() => setUserDropdownOpen(false)}
                                    >
                                        <div className="px-4 py-2 border-b border-slate-100">
                                            <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                                                {user.role}
                                            </span>
                                        </div>

                                        {/* Buyer Menu */}
                                        <Link href="/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-sky-50 text-slate-700">
                                            <ShoppingCart className="w-4 h-4 text-dunia-marine" />
                                            Pesanan Saya
                                        </Link>
                                        <Link href="/addresses" className="flex items-center gap-2 px-4 py-2 hover:bg-sky-50 text-slate-700">
                                            <UserIcon className="w-4 h-4 text-dunia-marine" />
                                            Buku Alamat
                                        </Link>

                                        {/* Seller Menu */}
                                        {user.role === 'seller' ? (
                                            <>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <div className="px-4 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                    Menu Toko
                                                </div>
                                                <Link href="/seller/products" className="flex items-center gap-2 px-4 py-2 hover:bg-sky-50 text-slate-700">
                                                    <Fish className="w-4 h-4 text-dunia-blue" />
                                                    Kelola Produk & Morf
                                                </Link>
                                                <Link href="/seller/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-sky-50 text-slate-700">
                                                    <Store className="w-4 h-4 text-dunia-blue" />
                                                    Pesanan Toko Masuk
                                                </Link>
                                                <Link href="/seller/store" className="flex items-center gap-2 px-4 py-2 hover:bg-sky-50 text-slate-700">
                                                    <Store className="w-4 h-4 text-dunia-blue" />
                                                    Profil Toko & Garansi DOA
                                                </Link>
                                            </>
                                        ) : user.role === 'buyer' ? (
                                            <>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <Link href="/seller/register" className="flex items-center gap-2 px-4 py-2 text-dunia-blue hover:bg-blue-50 font-semibold">
                                                    <PlusCircle className="w-4 h-4" />
                                                    Buka Toko Ikan
                                                </Link>
                                            </>
                                        ) : null}

                                        {/* Admin Menu */}
                                        {user.role === 'admin' && (
                                            <>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <div className="px-4 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                    Panel Admin
                                                </div>
                                                <Link href="/admin" className="flex items-center gap-2 px-4 py-2 hover:bg-sky-50 text-slate-700">
                                                    <LayoutDashboard className="w-4 h-4 text-purple-600" />
                                                    Dashboard Admin
                                                </Link>
                                                <Link href="/admin/guides" className="flex items-center gap-2 px-4 py-2 hover:bg-sky-50 text-slate-700">
                                                    <BookOpen className="w-4 h-4 text-purple-600" />
                                                    Kelola Panduan Ikan
                                                </Link>
                                            </>
                                        )}

                                        <div className="border-t border-slate-100 my-1"></div>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 text-left font-medium"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Keluar
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-dunia-navy hover:text-dunia-blue transition"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-dunia-blue text-white shadow-sm hover:bg-sky-600 transition"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Categories Bar (Sub-header) */}
                <div className="hidden md:flex items-center gap-6 py-2 border-t border-slate-100 text-xs font-semibold text-slate-600 overflow-x-auto no-scrollbar">
                    <span className="text-dunia-navy font-bold uppercase tracking-wider shrink-0">Kategori:</span>
                    {navCategories?.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/products?category=${cat.slug}`}
                            className="hover:text-dunia-blue whitespace-nowrap transition"
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-sky-100 bg-white px-4 pt-3 pb-6 space-y-3">
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                            type="text"
                            placeholder="Cari jenis ikan, morph..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-sky-200 bg-dunia-soft/40"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </form>

                    <div className="space-y-1 font-medium text-sm text-slate-700">
                        <Link href="/products" className="block py-2 hover:text-dunia-blue">
                            Semua Katalog Ikan
                        </Link>
                        <Link href="/guides" className="block py-2 hover:text-dunia-blue">
                            Panduan Perawatan Ikan
                        </Link>
                        {onOpenChat && (
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    onOpenChat();
                                }}
                                className="w-full text-left py-2 text-dunia-blue font-semibold flex items-center gap-2"
                            >
                                <span className="w-2 h-2 rounded-full bg-dunia-aqua"></span>
                                Tanya Asisten Ikan AI
                            </button>
                        )}
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kategori Ikan</p>
                        <div className="flex flex-wrap gap-2">
                            {navCategories?.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/products?category=${cat.slug}`}
                                    className="px-3 py-1 rounded-lg bg-sky-50 text-xs font-medium text-dunia-navy hover:bg-sky-100"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
