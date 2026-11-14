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
    ChevronDown
} from 'lucide-react';
import BrandLogo from '@/Components/BrandLogo';

export default function TopHeader({ onOpenMobileSidebar, onOpenChat }) {
    const { auth, cartCount } = usePage().props;
    const user = auth?.user;
    const [searchQuery, setSearchQuery] = useState('');
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/products?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    return (
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#1E80A0]/10 px-4 sm:px-6 lg:px-8 py-3">
            <div className="w-full flex items-center justify-between gap-3 sm:gap-6">
                {/* Left: Mobile Menu Trigger + Brand (Mobile) + Search Bar */}
                <div className="flex items-center gap-3 flex-1 min-w-0 max-w-xl">
                    {/* Mobile Hamburger Trigger */}
                    <button
                        type="button"
                        onClick={onOpenMobileSidebar}
                        className="md:hidden p-2 text-[#1E80A0] hover:text-[#001454] rounded-xl hover:bg-[#f3f2ff] transition shrink-0"
                        aria-label="Buka Menu Navigasi"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Mobile Brand Mark */}
                    <Link href="/" className="md:hidden flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-[#0a0a0a] text-white flex items-center justify-center shadow-xs border border-neutral-800">
                            <BrandLogo className="w-4 h-4 text-white" />
                        </div>
                    </Link>

                    {/* Search Form (Aquatic Coastal Pill Search) */}
                    <form onSubmit={handleSearchSubmit} className="relative w-full min-w-0">
                        <input
                            type="search"
                            placeholder="Cari spesimen, morph, penangkar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 rounded-full bg-[#f3f2ff] pl-10 pr-4 text-xs text-[#001454] placeholder:text-[#6d797a] border border-[#1E80A0]/10 focus:ring-2 focus:ring-[#4AB8BD] focus:bg-white transition"
                        />
                        <Search className="w-4 h-4 text-[#1E80A0] absolute left-3.5 top-3 pointer-events-none" />
                    </form>
                </div>

                {/* Right: Quick Action Icons (Sun, Heart, Cart, User/Auth) */}
                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                    {/* Theme Toggle Icon (Sun) */}
                    <button
                        type="button"
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 text-[#1E80A0] hover:text-[#001454] rounded-full hover:bg-[#f3f2ff] transition"
                        title={darkMode ? 'Tema Terang' : 'Tema Gelap'}
                        aria-label="Ubah Tema"
                    >
                        {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </button>

                    {/* Wishlist Icon (Heart) */}
                    <Link
                        href="/products?sort=popular"
                        className="relative p-2 text-[#1E80A0] hover:text-[#0684E5] rounded-full hover:bg-[#f3f2ff] transition"
                        title="Daftar Keinginan"
                        aria-label="Daftar Keinginan"
                    >
                        <Heart className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#0684E5]" />
                    </Link>

                    {/* Shopping Cart Icon */}
                    <Link
                        href="/cart"
                        className="relative p-2 text-[#1E80A0] hover:text-[#001454] rounded-full hover:bg-[#f3f2ff] transition"
                        title="Keranjang Belanja"
                        aria-label="Keranjang Belanja"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {cartCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#0684E5] text-white text-[10px] font-bold px-1 shadow-xs">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* User Profile / Auth Actions */}
                    {user ? (
                        <div className="relative ml-1">
                            <button
                                type="button"
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#4AB8BD]/40 transition"
                                aria-label="Menu Pengguna"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#0D2E92] text-white font-bold text-xs flex items-center justify-center">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="hidden lg:inline text-xs font-semibold text-[#001454] max-w-[110px] truncate">
                                    {user.name}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#1E80A0] hidden sm:inline" />
                            </button>

                            {userDropdownOpen && (
                                <div
                                    className="absolute right-0 z-50 mt-2 w-56 rounded-2xl bg-white border border-[#1E80A0]/15 shadow-xl py-2 text-xs"
                                    onClick={() => setUserDropdownOpen(false)}
                                >
                                    <div className="px-4 py-2 border-b border-[#1E80A0]/10">
                                        <p className="font-extrabold text-[#001454] truncate">{user.name}</p>
                                        <p className="text-[11px] text-[#3d4949] truncate">{user.email}</p>
                                    </div>

                                    <Link href="/orders" className="block px-4 py-2 hover:bg-[#f3f2ff] text-[#001454] transition">
                                        Pesanan Saya
                                    </Link>
                                    <Link href="/addresses" className="block px-4 py-2 hover:bg-[#f3f2ff] text-[#001454] transition">
                                        Buku Alamat
                                    </Link>

                                    {user.role === 'seller' && (
                                        <div className="border-t border-[#1E80A0]/10 my-1 pt-1">
                                            <span className="px-4 text-[10px] font-bold text-[#1E80A0] uppercase tracking-wider block mb-1">
                                                Toko Saya
                                            </span>
                                            <Link href="/seller/products" className="block px-4 py-1.5 hover:bg-[#f3f2ff] text-[#001454] transition">
                                                Produk Toko
                                            </Link>
                                            <Link href="/seller/orders" className="block px-4 py-1.5 hover:bg-[#f3f2ff] text-[#001454] transition">
                                                Pesanan Masuk
                                            </Link>
                                            <Link href="/seller/store" className="block px-4 py-1.5 hover:bg-[#f3f2ff] text-[#001454] transition">
                                                Profil Toko
                                            </Link>
                                        </div>
                                    )}

                                    {user.role === 'buyer' && (
                                        <div className="border-t border-[#1E80A0]/10 my-1 pt-1">
                                            <Link href="/seller/register" className="block px-4 py-2 hover:bg-[#f3f2ff] text-[#0684E5] font-bold transition">
                                                Buka Toko Penangkar
                                            </Link>
                                        </div>
                                    )}

                                    {user.role === 'admin' && (
                                        <div className="border-t border-[#1E80A0]/10 my-1 pt-1">
                                            <span className="px-4 text-[10px] font-bold text-[#1E80A0] uppercase tracking-wider block mb-1">
                                                Admin
                                            </span>
                                            <Link href="/admin" className="block px-4 py-1.5 hover:bg-[#f3f2ff] text-[#001454] transition">
                                                Dashboard Admin
                                            </Link>
                                            <Link href="/admin/guides" className="block px-4 py-1.5 hover:bg-[#f3f2ff] text-[#001454] transition">
                                                Kelola Panduan
                                            </Link>
                                        </div>
                                    )}

                                    <div className="border-t border-[#1E80A0]/10 mt-1 pt-1">
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="block w-full text-left px-4 py-2 text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition font-medium"
                                        >
                                            Keluar
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 sm:gap-2 ml-1">
                            <Link
                                href="/login"
                                className="sm:hidden p-2 text-[#001454] hover:text-[#0684E5] rounded-full hover:bg-[#f3f2ff] transition"
                                title="Masuk Akun"
                                aria-label="Masuk Akun"
                            >
                                <User className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/login"
                                className="hidden sm:inline-block text-xs font-bold text-[#001454] hover:text-[#0684E5] px-2.5 py-1.5 transition"
                            >
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="hidden sm:inline-block px-4 py-2 rounded-full bg-[#0684E5] text-white font-bold text-xs hover:bg-[#0060aa] hover:scale-[1.02] shadow-sm transition-all"
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
