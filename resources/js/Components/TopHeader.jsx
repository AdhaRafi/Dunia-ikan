import { useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { 
    Search, 
    Sun, 
    Moon, 
    Heart, 
    ShoppingCart, 
    User, 
    Menu, 
    ChevronDown,
    Package,
    MapPin,
    X
} from 'lucide-react';
import BrandWordmark from '@/Components/BrandWordmark';
import UserAvatar from '@/Components/UserAvatar';
import { LanguageSwitcher, useLanguage } from '@/lib/i18n';

const SEARCH_GROUPS = [
    {
        labelId: 'Jenis Ikan',
        labelEn: 'Fish Species',
        items: [
            { titleId: 'Cupang', titleEn: 'Betta', href: '/products?category=ikan-hias&q=cupang' },
            { titleId: 'Channa', titleEn: 'Channa', href: '/products?category=ikan-hias&q=channa' },
            { titleId: 'Arwana', titleEn: 'Arowana', href: '/products?category=ikan-hias&q=arwana' },
            { titleId: 'Koi', titleEn: 'Koi', href: '/products?category=ikan-hias&q=koi' },
            { titleId: 'Mas Koki', titleEn: 'Goldfish', href: '/products?category=ikan-hias&q=koki' },
            { titleId: 'Louhan', titleEn: 'Flowerhorn', href: '/products?category=ikan-hias&q=louhan' },
            { titleId: 'Discus', titleEn: 'Discus', href: '/products?category=ikan-hias&q=discus' },
            { titleId: 'Guppy', titleEn: 'Guppy', href: '/products?category=ikan-hias&q=guppy' },
            { titleId: 'Tetra', titleEn: 'Tetra', href: '/products?water_type=freshwater&q=tetra' },
            { titleId: 'Oscar & Bass', titleEn: 'Oscar & Bass', href: '/products?category=ikan-hias&q=oscar' },
            { titleId: 'Manfish', titleEn: 'Angelfish', href: '/products?category=ikan-hias&q=manfish' },
            { titleId: 'Botia & Pleco', titleEn: 'Loach & Pleco', href: '/products?category=ikan-hias&q=botia' },
            { titleId: 'Rainbowfish', titleEn: 'Rainbowfish', href: '/products?category=ikan-hias&q=boesemani' },
            { titleId: 'Ikan Badut', titleEn: 'Clownfish', href: '/products?water_type=saltwater&q=badut' },
            { titleId: 'Blue & Yellow Tang', titleEn: 'Tang Reef Fish', href: '/products?water_type=saltwater&q=tang' },
            { titleId: 'Ikan Air Payau', titleEn: 'Brackish Fish', href: '/products?water_type=brackish' },
        ],
    },
    {
        labelId: 'Alat & Kebutuhan',
        labelEn: 'Gear & Supplies',
        items: [
            { titleId: 'Filter Aquarium', titleEn: 'Aquarium Filter', href: '/products?category=perlengkapan-aquarium&q=filter' },
            { titleId: 'Tank Aquarium', titleEn: 'Aquarium Tank', href: '/products?category=perlengkapan-aquarium&q=aquarium' },
            { titleId: 'Pakan & Pelet', titleEn: 'Food & Pellets', href: '/products?category=pakan-ikan' },
            { titleId: 'Perawatan Air', titleEn: 'Water Care', href: '/products?category=perawatan-ikan' },
        ],
    },
    {
        labelId: 'Tumbuhan & Hiasan',
        labelEn: 'Plants & Decor',
        items: [
            { titleId: 'Tanaman Hias', titleEn: 'Aquatic Plants', href: '/products?category=aquascape' },
            { titleId: 'Anubias', titleEn: 'Anubias', href: '/products?category=aquascape&q=anubias' },
            { titleId: 'Bucephalandra', titleEn: 'Bucephalandra', href: '/products?category=aquascape&q=bucephalandra' },
        ],
    },
];

export default function TopHeader({
    onOpenMobileSidebar,
    onOpenChat,
    darkMode: controlledDarkMode,
    onToggleDarkMode,
}) {
    const { auth, cartCount } = usePage().props;
    const { pick, isEn } = useLanguage();
    const user = auth?.user;
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const searchBoxRef = useRef(null);
    const mobileSearchInputRef = useRef(null);
    const [internalDarkMode, setInternalDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return (
                document.documentElement.classList.contains('dark') ||
                localStorage.getItem('theme') === 'dark'
            );
        }
        return false;
    });

    const isControlledTheme = typeof controlledDarkMode === 'boolean' && typeof onToggleDarkMode === 'function';
    const darkMode = isControlledTheme ? controlledDarkMode : internalDarkMode;

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
                setSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    useEffect(() => {
        if (isControlledTheme || typeof window === 'undefined') {
            return;
        }
        if (internalDarkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
            localStorage.setItem('theme', 'light');
        }
    }, [internalDarkMode, isControlledTheme]);

    const handleToggleTheme = () => {
        if (isControlledTheme) {
            onToggleDarkMode();
        } else {
            setInternalDarkMode((prev) => !prev);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearchFocused(false);
            setMobileSearchOpen(false);
            router.get('/products', { q: searchQuery.trim() });
        }
    };

    const normalizedSearch = searchQuery.trim().toLowerCase();
    const filteredGroups = SEARCH_GROUPS.map((group) => {
        const label = isEn ? group.labelEn : group.labelId;
        return {
            label,
            items: normalizedSearch
                ? group.items
                      .map((item) => ({
                          ...item,
                          title: isEn ? item.titleEn : item.titleId,
                      }))
                      .filter(
                          (item) =>
                              item.title.toLowerCase().includes(normalizedSearch) ||
                              item.titleId.toLowerCase().includes(normalizedSearch) ||
                              item.titleEn.toLowerCase().includes(normalizedSearch) ||
                              label.toLowerCase().includes(normalizedSearch),
                      )
                : group.items.map((item) => ({
                      ...item,
                      title: isEn ? item.titleEn : item.titleId,
                  })),
        };
    }).filter((group) => group.items.length > 0);

    const handleToggleMobileSearch = () => {
        setMobileSearchOpen((prev) => {
            const next = !prev;
            if (next) {
                setSearchFocused(true);
                setTimeout(() => mobileSearchInputRef.current?.focus(), 20);
            } else {
                setSearchFocused(false);
            }
            return next;
        });
    };

    const renderSearchDropdown = (extraClose) => (
        <div className="space-y-2.5 sm:space-y-3">
            {searchQuery.trim() && (
                <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl bg-[#f3f2ff] dark:bg-[#152038] text-xs font-bold text-[#001454] dark:text-white hover:bg-[#4AB8BD]/15 transition text-left"
                >
                    <Search className="w-3.5 h-3.5 text-[#1E80A0] dark:text-[#4AB8BD]" />
                    <span>
                        {pick(
                            `Cari “${searchQuery.trim()}” di seluruh toko`,
                            `Search “${searchQuery.trim()}” across stores`,
                        )}
                    </span>
                </button>
            )}

            {filteredGroups.map((group) => (
                <div key={group.label} className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-1">
                        {group.label}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                onClick={() => {
                                    setSearchFocused(false);
                                    extraClose?.();
                                }}
                                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-neutral-800 hover:bg-[#4AB8BD] hover:text-white dark:hover:bg-[#4AB8BD] dark:hover:text-[#001454] text-[11px] font-semibold text-[#001454] dark:text-neutral-200 transition"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <header className="sticky top-0 z-40 transform-gpu bg-white/95 dark:bg-[#070b14]/95 backdrop-blur-md border-b border-[#1E80A0]/10 dark:border-neutral-800 transition-colors">
            <div className="h-14 sm:h-16 px-3 sm:px-6 lg:px-8 w-full flex items-center justify-between gap-2 sm:gap-6">
                {/* Left: Mobile Menu Trigger + Brand + Desktop Search Bar */}
                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 max-w-3xl">
                    {/* Mobile Hamburger Trigger */}
                    <button
                        type="button"
                        onClick={onOpenMobileSidebar}
                        className="md:hidden p-2 -ml-1 text-[#1E80A0] dark:text-[#4AB8BD] hover:text-[#001454] dark:hover:text-white rounded-xl hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 transition shrink-0"
                        aria-label={pick('Buka Menu Navigasi', 'Open Navigation Menu')}
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Brand Mark */}
                    <Link href="/" className="flex items-center shrink-0 hover:opacity-90 transition pr-1 sm:pr-2">
                        <BrandWordmark className="h-7 sm:h-9" />
                    </Link>

                    {/* Desktop/Tablet Inline Search Form */}
                    <div ref={searchBoxRef} className="hidden sm:block relative w-full min-w-0 flex-1">
                        <form onSubmit={handleSearchSubmit} className="relative w-full">
                            <input
                                type="search"
                                placeholder={pick(
                                    'Cari ikan, filter, aquascape, tanaman...',
                                    'Search fish, filters, aquascape, plants...',
                                )}
                                value={searchQuery}
                                onFocus={() => setSearchFocused(true)}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setSearchFocused(true);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        setSearchFocused(false);
                                    }
                                }}
                                className="w-full h-10 rounded-full bg-[#f3f2ff] dark:bg-[#111a30] pl-10 pr-4 text-xs text-[#001454] dark:text-white placeholder:text-[#6d797a] dark:placeholder:text-neutral-400 border border-[#1E80A0]/10 dark:border-neutral-700 focus:ring-2 focus:ring-[#4AB8BD] focus:bg-white dark:focus:bg-[#152038] transition"
                            />
                            <Search className="w-4 h-4 text-[#1E80A0] dark:text-[#4AB8BD] absolute left-3.5 top-3 pointer-events-none" />
                        </form>

                        {searchFocused && (
                            <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-neutral-700 shadow-xl p-3.5 z-50">
                                {renderSearchDropdown()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Quick Action Icons (Mobile Search, Lang, Sun/Moon, Heart, Cart, Orders, User/Auth) */}
                <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
                    {/* Mobile Search Toggle */}
                    <button
                        type="button"
                        onClick={handleToggleMobileSearch}
                        className="sm:hidden p-2 text-[#1E80A0] dark:text-[#4AB8BD] hover:text-[#001454] dark:hover:text-white rounded-full hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 transition"
                        title={pick('Cari Produk', 'Search Products')}
                        aria-label={pick('Cari Produk', 'Search Products')}
                        aria-expanded={mobileSearchOpen}
                    >
                        {mobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                    </button>

                    {/* ID / EN Language Switcher */}
                    <LanguageSwitcher />

                    {/* Theme Toggle Icon (Sun / Moon) */}
                    <button
                        type="button"
                        onClick={handleToggleTheme}
                        className="p-2 text-[#1E80A0] dark:text-[#4AB8BD] hover:text-[#001454] dark:hover:text-white rounded-full hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 transition"
                        title={darkMode ? pick('Tema Terang', 'Light Theme') : pick('Tema Gelap', 'Dark Theme')}
                        aria-label={pick('Ubah Tema', 'Toggle Theme')}
                    >
                        {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </button>

                    {/* Wishlist Icon (Heart) - Hidden on extra small mobile */}
                    <Link
                        href="/products?sort=popular"
                        className="hidden sm:flex relative p-2 text-[#1E80A0] dark:text-neutral-300 hover:text-[#0684E5] dark:hover:text-[#4AB8BD] rounded-full hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 transition"
                        title={pick('Daftar Keinginan', 'Wishlist')}
                        aria-label={pick('Daftar Keinginan', 'Wishlist')}
                    >
                        <Heart className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#0684E5]" />
                    </Link>

                    {/* Shopping Cart Icon */}
                    <Link
                        href="/cart"
                        className="relative p-2 text-[#1E80A0] dark:text-neutral-300 hover:text-[#001454] dark:hover:text-white rounded-full hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 transition"
                        title={pick('Keranjang Belanja', 'Shopping Cart')}
                        aria-label={pick('Keranjang Belanja', 'Shopping Cart')}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {cartCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#0684E5] text-white text-[10px] font-bold px-1 shadow-xs">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Orders Icon - Visible on sm+; mobile accesses via Sidebar & User Menu */}
                    {user && (
                        <Link
                            href="/orders"
                            className="hidden sm:flex relative p-2 text-[#1E80A0] dark:text-neutral-300 hover:text-[#001454] dark:hover:text-white rounded-full hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 transition"
                            title={pick('Pesanan Saya', 'My Orders')}
                            aria-label={pick('Pesanan Saya', 'My Orders')}
                        >
                            <Package className="w-4 h-4" />
                        </Link>
                    )}

                    {/* User Profile / Auth Actions */}
                    {user ? (
                        <div className="relative ml-0.5 sm:ml-1">
                            <button
                                type="button"
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#4AB8BD]/40 transition"
                                aria-label={pick('Menu Pengguna', 'User Menu')}
                            >
                                <UserAvatar user={user} className="w-8 h-8 text-xs" />
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

                                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 text-[#001454] dark:text-neutral-200 transition">
                                        <User className="w-3.5 h-3.5 text-[#1E80A0] dark:text-[#4AB8BD]" />
                                        <span>{pick('Profil Saya', 'My Profile')}</span>
                                    </Link>
                                    <Link href="/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 text-[#001454] dark:text-neutral-200 transition font-medium">
                                        <Package className="w-3.5 h-3.5 text-[#0684E5] dark:text-[#4AB8BD]" />
                                        <span>{pick('Pesanan Saya', 'My Orders')}</span>
                                    </Link>
                                    <Link href="/addresses" className="flex items-center gap-2 px-4 py-2 hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 text-[#001454] dark:text-neutral-200 transition">
                                        <MapPin className="w-3.5 h-3.5 text-[#1E80A0] dark:text-[#4AB8BD]" />
                                        <span>{pick('Buku Alamat', 'Address Book')}</span>
                                    </Link>

                                    {user.role === 'seller' && (
                                        <div className="border-t border-[#1E80A0]/10 dark:border-neutral-800 my-1 pt-1">
                                            <span className="px-4 text-[10px] font-bold text-[#1E80A0] dark:text-[#4AB8BD] uppercase tracking-wider block mb-1">
                                                {pick('Toko Saya', 'My Store')}
                                            </span>
                                            <Link href="/seller/products" className="block px-4 py-1.5 hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 text-[#001454] dark:text-neutral-200 transition">
                                                {pick('Produk Toko', 'Store Products')}
                                            </Link>
                                            <Link href="/seller/orders" className="block px-4 py-1.5 hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 text-[#001454] dark:text-neutral-200 transition">
                                                {pick('Pesanan Masuk', 'Incoming Orders')}
                                            </Link>
                                            <Link href="/seller/store" className="block px-4 py-1.5 hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 text-[#001454] dark:text-neutral-200 transition">
                                                {pick('Profil Toko', 'Store Profile')}
                                            </Link>
                                        </div>
                                    )}

                                    {user.role === 'buyer' && (
                                        <div className="border-t border-[#1E80A0]/10 dark:border-neutral-800 my-1 pt-1">
                                            <Link href="/seller/register" className="flex items-center justify-between gap-2 px-4 py-2 hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 text-[#0684E5] dark:text-cyan-400 font-bold transition">
                                                <span>
                                                    {user.seller_status === 'pending'
                                                        ? pick('Status Penjual', 'Seller Status')
                                                        : user.seller_status === 'rejected'
                                                          ? pick('Ajukan Ulang Toko', 'Reapply Store')
                                                          : pick('Buka Toko Penangkar', 'Open Breeder Store')}
                                                </span>
                                                {user.seller_status === 'pending' && (
                                                    <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                                        {pick('Pending', 'Pending')}
                                                    </span>
                                                )}
                                                {user.seller_status === 'rejected' && (
                                                    <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                                                        {pick('Ditolak', 'Rejected')}
                                                    </span>
                                                )}
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
                                            {pick('Keluar', 'Sign Out')}
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 sm:gap-2 ml-0.5 sm:ml-1">
                            <Link
                                href="/login"
                                className="sm:hidden p-2 text-[#001454] dark:text-white hover:text-[#0684E5] dark:hover:text-[#4AB8BD] rounded-full hover:bg-[#f3f2ff] dark:hover:bg-neutral-800 transition"
                                title={pick('Masuk Akun', 'Sign In')}
                                aria-label={pick('Masuk Akun', 'Sign In')}
                            >
                                <User className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/login"
                                className="hidden sm:inline-block text-xs font-bold text-[#001454] dark:text-neutral-200 hover:text-[#0684E5] dark:hover:text-[#4AB8BD] px-2.5 py-1.5 transition"
                            >
                                {pick('Masuk', 'Sign In')}
                            </Link>
                            <Link
                                href="/register"
                                className="hidden sm:inline-block px-4 py-2 rounded-full bg-[#0684E5] text-white font-bold text-xs hover:bg-[#0060aa] hover:scale-[1.02] shadow-sm transition-all"
                            >
                                {pick('Daftar', 'Sign Up')}
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Full-Width Search Row */}
            {mobileSearchOpen && (
                <div className="sm:hidden px-3 pb-3 pt-0.5 border-t border-[#1E80A0]/10 dark:border-neutral-800/80 space-y-2.5">
                    <form onSubmit={handleSearchSubmit} className="relative w-full">
                        <input
                            ref={mobileSearchInputRef}
                            type="search"
                            placeholder={pick(
                                'Cari ikan, filter, aquascape, tanaman...',
                                'Search fish, filters, aquascape, plants...',
                            )}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    setMobileSearchOpen(false);
                                }
                            }}
                            className="w-full h-10 rounded-full bg-[#f3f2ff] dark:bg-[#111a30] pl-10 pr-4 text-xs text-[#001454] dark:text-white placeholder:text-[#6d797a] dark:placeholder:text-neutral-400 border border-[#1E80A0]/15 dark:border-neutral-700 focus:ring-2 focus:ring-[#4AB8BD] focus:bg-white dark:focus:bg-[#152038] transition"
                        />
                        <Search className="w-4 h-4 text-[#1E80A0] dark:text-[#4AB8BD] absolute left-3.5 top-3 pointer-events-none" />
                    </form>

                    <div className="rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-neutral-700 p-3 shadow-lg">
                        {renderSearchDropdown(() => setMobileSearchOpen(false))}
                    </div>
                </div>
            )}
        </header>
    );
}
