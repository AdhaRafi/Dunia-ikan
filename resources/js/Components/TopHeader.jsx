import { useState, useEffect } from 'react';
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
import BrandWordmark from '@/Components/BrandWordmark';

export default function TopHeader({ onOpenMobileSidebar, onOpenChat }) {
    const { auth, cartCount } = usePage().props;
    const user = auth?.user;
    const [searchQuery, setSearchQuery] = useState('');
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark') || 
                   localStorage.getItem('theme') === 'dark';
        }
        return false;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (darkMode) {
                document.documentElement.classList.add('dark');
                document.documentElement.style.colorScheme = 'dark';
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.style.colorScheme = 'light';
                localStorage.setItem('theme', 'light');
            }
        }
    }, [darkMode]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/products?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    return (
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#070b14]/90 backdrop-blur-md border-b border-[#1E80A0]/10 dark:border-neutral-800 px-4 sm:px-6 lg:px-8 py-3 transition-colors">
            <div className="w-full flex items-center justify-between gap-3 sm:gap-6">
                {/* Left: Mobile Menu Trigger + Brand (Mobile) + Search Bar */}
                <div className="flex items-center gap-3 flex-1 min-w-0 max-w-xl">
                    {/* Mobile Hamburger Trigger */}
                    <button
                        type="button"
                        onClick={onOpenMobileSidebar}
                        className="md:hidden p-2 text-[#1E80A0] dark:text-[#4AB8BD] hover:text-[#001454] dark:hover:text-white rounded-xl hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 transition shrink-0"
                        aria-label="Buka Menu Navigasi"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Mobile Brand Mark */}
                    <Link href="/" className="md:hidden flex items-center shrink-0">
                        <BrandWordmark className="h-7" />
                    </Link>

                    {/* Search Form (Aquatic Coastal Pill Search) */}
                    <form onSubmit={handleSearchSubmit} className="relative w-full min-w-0">
                        <input
                            type="search"
                            placeholder="Cari spesimen, morph, penangkar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 rounded-full bg-[#f3f2ff] dark:bg-[#111a30] pl-10 pr-4 text-xs text-[#001454] dark:text-white placeholder:text-[#6d797a] dark:placeholder:text-neutral-400 border border-[#1E80A0]/10 dark:border-neutral-700 focus:ring-2 focus:ring-[#4AB8BD] focus:bg-white dark:focus:bg-[#152038] transition"
                        />
                        <Search className="w-4 h-4 text-[#1E80A0] dark:text-[#4AB8BD] absolute left-3.5 top-3 pointer-events-none" />
                    </form>
                </div>

                {/* Right: Quick Action Icons (Sun/Moon, Heart, Cart, User/Auth) */}
                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                    {/* Theme Toggle Icon (Sun / Moon) */}
                    <button
                        type="button"
                        onClick={() => setDarkMode(prev => !prev)}
                        className="p-2 text-[#1E80A0] dark:text-[#4AB8BD] hover:text-[#001454] dark:hover:text-white rounded-full hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 transition"
                        title={darkMode ? 'Tema Terang' : 'Tema Gelap'}
                        aria-label="Ubah Tema"
                    >
                        {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </button>

                    {/* Wishlist Icon (Heart) */}
                    <Link
                        href="/products?sort=popular"
                        className="relative p-2 text-[#1E80A0] dark:text-neutral-300 hover:text-[#0684E5] dark:hover:text-[#4AB8BD] rounded-full hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 transition"
                        title="Daftar Keinginan"
                        aria-label="Daftar Keinginan"
                    >
                        <Heart className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#0684E5]" />
                    </Link>

                    {/* Shopping Cart Icon */}
                    <Link
                        href="/cart"
                        className="relative p-2 text-[#1E80A0] dark:text-neutral-300 hover:text-[#001454] dark:hover:text-white rounded-full hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 transition"
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
                                <span className="hidden lg:inline text-xs font-semibold text-[#001454] dark:text-white max-w-[110px] truncate">
                                    {user.name}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#1E80A0] dark:text-neutral-400 hidden sm:inline" />
                            </button>

                            {userDropdownOpen && (
                                <div
                                    className="absolute right-0 z-50 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0f172a] border border-[#1E80A0]/15 dark:border-neutral-700 shadow-xl py-2 text-xs"
                                    onClick={() => setUserDropdownOpen(false)}
                                >
                                    <div className="px-4 py-2 border-b border-[#1E80A0]/10 dark:border-neutral-800">
                                        <p className="font-extrabold text-[#001454] dark:text-white truncate">{user.name}</p>
                                        <p className="text-[11px] text-[#3d4949] dark:text-neutral-400 truncate">{user.email}</p>
                                    </div>

                                    <Link href="/orders" className="block px-4 py-2 hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 text-[#001454] dark:text-neutral-200 transition">
                                        Pesanan Saya
                                    </Link>
                                    <Link href="/addresses" className="block px-4 py-2 hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 text-[#001454] dark:text-neutral-200 transition">
                                        Buku Alamat
                                    </Link>

                                    {user.role === 'seller' && (
                                        <div className="border-t border-[#1E80A0]/10 dark:border-neutral-800 my-1 pt-1">
                                            <span className="px-4 text-[10px] font-bold text-[#1E80A0] dark:text-[#4AB8BD] uppercase tracking-wider block mb-1">
                                                Toko Saya
                                            </span>
                                            <Link href="/seller/products" className="block px-4 py-1.5 hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 text-[#001454] dark:text-neutral-200 transition">
                                                Produk Toko
                                            </Link>
                                            <Link href="/seller/orders" className="block px-4 py-1.5 hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 text-[#001454] dark:text-neutral-200 transition">
                                                Pesanan Masuk
                                            </Link>
                                            <Link href="/seller/store" className="block px-4 py-1.5 hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 text-[#001454] dark:text-neutral-200 transition">
                                                Profil Toko
                                            </Link>
                                        </div>
                                    )}

                                    {user.role === 'buyer' && (
                                        <div className="border-t border-[#1E80A0]/10 dark:border-neutral-800 my-1 pt-1">
                                            <Link href="/seller/register" className="block px-4 py-2 hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 text-[#0684E5] dark:text-cyan-400 font-bold transition">
                                                Buka Toko Penangkar
                                            </Link>
                                        </div>
                                    )}

                                    {user.role === 'admin' && (
                                        <div className="border-t border-[#1E80A0]/10 dark:border-neutral-800 my-1 pt-1">
                                            <span className="px-4 text-[10px] font-bold text-[#1E80A0] dark:text-[#4AB8BD] uppercase tracking-wider block mb-1">
                                                Admin
                                            </span>
                                            <Link href="/admin" className="block px-4 py-1.5 hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 text-[#001454] dark:text-neutral-200 transition">
                                                Dashboard Admin
                                            </Link>
                                            <Link href="/admin/guides" className="block px-4 py-1.5 hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 text-[#001454] dark:text-neutral-200 transition">
                                                Kelola Panduan
                                            </Link>
                                        </div>
                                    )}

                                    <div className="border-t border-[#1E80A0]/10 dark:border-neutral-800 mt-1 pt-1">
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="block w-full text-left px-4 py-2 text-[#ba1a1a] dark:text-red-400 hover:bg-[#ffdad6]/40 dark:hover:bg-red-950/40 transition font-medium"
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
                                className="sm:hidden p-2 text-[#001454] dark:text-white hover:text-[#0684E5] dark:hover:text-[#4AB8BD] rounded-full hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 transition"
                                title="Masuk Akun"
                                aria-label="Masuk Akun"
                            >
                                <User className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/login"
                                className="hidden sm:inline-block text-xs font-bold text-[#001454] dark:text-neutral-200 hover:text-[#0684E5] dark:hover:text-[#4AB8BD] px-2.5 py-1.5 transition"
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
