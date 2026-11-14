import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    Search, 
    Sun, 
    Moon, 
    Heart, 
    ShoppingCart, 
    User, 
    Menu, 
    ChevronDown,
    X,
    MessageSquare,
    Store
} from 'lucide-react';

export default function TopHeader({ onOpenMobileSidebar, onOpenChat }) {
    const { auth, cartCount } = usePage().props;
    const user = auth?.user;
    const [searchQuery, setSearchQuery] = useState('');
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [wishlistCount, setWishlistCount] = useState(3);
    const [darkMode, setDarkMode] = useState(false);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/products?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    return (
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                {/* Left: Mobile Sidebar Trigger + Search Input */}
                <div className="flex items-center gap-3 flex-1 max-w-md">
                    {/* Mobile Hamburger Button */}
                    <button
                        type="button"
                        onClick={onOpenMobileSidebar}
                        className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
                        aria-label="Buka Menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Search Form (matches Catalyst search input) */}
                    <form onSubmit={handleSearchSubmit} className="relative w-full">
                        <input
                            type="search"
                            placeholder="Cari spesimen, morph, penangkar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 rounded-full bg-slate-100/90 pl-10 pr-4 text-xs placeholder:text-slate-400 border-0 focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    </form>
                </div>

                {/* Right: Quick Action Icons (Sun, Heart, Cart, User - exactly like Catalyst) */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {/* Theme Toggle Icon (Sun) */}
                    <button
                        type="button"
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition"
                        title="Ubah Tema"
                    >
                        {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </button>

                    {/* Wishlist Icon (Heart) */}
                    <Link
                        href="/products?sort=popular"
                        className="relative p-2 text-slate-500 hover:text-rose-600 rounded-full hover:bg-slate-100 transition"
                        title="Favorit"
                    >
                        <Heart className="w-4 h-4" />
                        {wishlistCount > 0 && (
                            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500" />
                        )}
                    </Link>

                    {/* Shopping Cart Icon */}
                    <Link
                        href="/cart"
                        className="relative p-2 text-slate-700 hover:text-slate-950 rounded-full hover:bg-slate-100 transition"
                        title="Keranjang Belanja"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-slate-950 text-white text-[10px] font-bold px-1 shadow-xs">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* User Profile / Account Dropdown */}
                    {user ? (
                        <div className="relative ml-1">
                            <button
                                type="button"
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-slate-200 transition"
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="hidden lg:inline text-xs font-semibold text-slate-800 max-w-[110px] truncate">
                                    {user.name}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                            </button>

                            {userDropdownOpen && (
                                <div
                                    className="absolute right-0 z-50 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 text-xs"
                                    onClick={() => setUserDropdownOpen(false)}
                                >
                                    <div className="px-4 py-2 border-b border-slate-100">
                                        <p className="font-extrabold text-slate-900 truncate">{user.name}</p>
                                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                                    </div>

                                    <Link href="/orders" className="block px-4 py-2 hover:bg-slate-50 text-slate-700 transition">
                                        Pesanan Saya
                                    </Link>
                                    <Link href="/addresses" className="block px-4 py-2 hover:bg-slate-50 text-slate-700 transition">
                                        Buku Alamat
                                    </Link>

                                    {user.role === 'seller' && (
                                        <div className="border-t border-slate-100 my-1 pt-1">
                                            <span className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                                Toko Saya
                                            </span>
                                            <Link href="/seller/products" className="block px-4 py-1.5 hover:bg-slate-50 text-slate-700 transition">
                                                Produk Toko
                                            </Link>
                                            <Link href="/seller/orders" className="block px-4 py-1.5 hover:bg-slate-50 text-slate-700 transition">
                                                Pesanan Masuk
                                            </Link>
                                            <Link href="/seller/store" className="block px-4 py-1.5 hover:bg-slate-50 text-slate-700 transition">
                                                Profil Toko
                                            </Link>
                                        </div>
                                    )}

                                    {user.role === 'buyer' && (
                                        <div className="border-t border-slate-100 my-1 pt-1">
                                            <Link href="/seller/register" className="block px-4 py-2 hover:bg-slate-50 text-emerald-700 font-bold transition">
                                                Buka Toko Penangkar
                                            </Link>
                                        </div>
                                    )}

                                    {user.role === 'admin' && (
                                        <div className="border-t border-slate-100 my-1 pt-1">
                                            <span className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                                Admin
                                            </span>
                                            <Link href="/admin" className="block px-4 py-1.5 hover:bg-slate-50 text-slate-700 transition">
                                                Dashboard Admin
                                            </Link>
                                            <Link href="/admin/guides" className="block px-4 py-1.5 hover:bg-slate-50 text-slate-700 transition">
                                                Kelola Panduan
                                            </Link>
                                        </div>
                                    )}

                                    <div className="border-t border-slate-100 mt-1 pt-1">
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="block w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 transition"
                                        >
                                            Keluar
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 ml-1">
                            <Link
                                href="/login"
                                className="p-2 text-slate-700 hover:text-slate-950 rounded-full hover:bg-slate-100 transition"
                                title="Masuk Akun"
                            >
                                <User className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/login"
                                className="hidden sm:inline-block text-xs font-bold text-slate-700 hover:text-slate-950 px-2 py-1.5"
                            >
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="hidden sm:inline-block px-3.5 py-1.5 rounded-full bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 shadow-xs transition"
                            >
                                Daftar
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
