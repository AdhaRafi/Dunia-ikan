import { useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Search,
    Sun,
    Moon,
    Heart,
    ShoppingCart,
    User,
    ChevronDown,
    Package,
    MapPin,
    X,
} from 'lucide-react';
import BrandWordmark from '@/Components/BrandWordmark';
import UserAvatar from '@/Components/UserAvatar';
import { LanguageSwitcher, useLanguage } from '@/lib/i18n';
import { buildCatalogDropdownItems, buildStoreNavItem } from '@/lib/navigation';

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

function NavDotIndicator() {
    return (
        <span
            aria-hidden="true"
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-amber-400 dark:bg-[#4AB8BD]"
        />
    );
}

export default function TopHeader({
    onOpenMobileSidebar,
    onOpenChat,
    darkMode: controlledDarkMode,
    onToggleDarkMode,
}) {
    const { url, props } = usePage();
    const { auth, cartCount } = props;
    const { pick, isEn } = useLanguage();
    const user = auth?.user;
    const [pathname = '/'] = String(url ?? '/').split('?');

    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [catalogOpen, setCatalogOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const headerRef = useRef(null);
    const searchInputRef = useRef(null);
    const catalogCloseTimerRef = useRef(null);

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

    const catalogItems = buildCatalogDropdownItems(url, pick);
    const storeNavItem = buildStoreNavItem(url, user, pick);
    const isCatalogActive = pathname.startsWith('/products');

    useEffect(() => {
        const handleOutside = (event) => {
            if (headerRef.current && !headerRef.current.contains(event.target)) {
                setSearchOpen(false);
                setCatalogOpen(false);
                setUserDropdownOpen(false);
            }
        };
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setSearchOpen(false);
                setCatalogOpen(false);
                setUserDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutside);
        window.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleOutside);
            window.removeEventListener('keydown', handleEscape);
        };
    }, []);

    useEffect(() => {
        setSearchOpen(false);
        setCatalogOpen(false);
        setUserDropdownOpen(false);
    }, [url]);

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

    const handleToggleSearch = () => {
        setCatalogOpen(false);
        setUserDropdownOpen(false);
        setSearchOpen((prev) => {
            const next = !prev;
            if (next) {
                setTimeout(() => searchInputRef.current?.focus(), 30);
            }
            return next;
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearchOpen(false);
            router.get('/products', { q: searchQuery.trim() });
        }
    };

    const openCatalogHover = () => {
        if (catalogCloseTimerRef.current) {
            clearTimeout(catalogCloseTimerRef.current);
            catalogCloseTimerRef.current = null;
        }
        setCatalogOpen(true);
    };

    const closeCatalogHover = () => {
        catalogCloseTimerRef.current = setTimeout(() => {
            setCatalogOpen(false);
        }, 120);
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

    return (
        <header
            ref={headerRef}
            className="sticky top-0 z-40 transform-gpu bg-white/95 dark:bg-[#070b14]/95 backdrop-blur-md border-b border-slate-200/70 dark:border-neutral-800/90 transition-colors"
        >
            <div className="max-w-7xl mx-auto h-16 px-3 sm:px-6 lg:px-8 w-full flex items-center justify-between gap-3">
                {/* Left: Clean Brand Wordmark */}
                <Link
                    href="/"
                    className="flex items-center shrink-0 hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0267C1] rounded-lg"
                >
                    <BrandWordmark className="h-7 sm:h-8" />
                </Link>

                {/* Center: Airy Single-Row Desktop Links + Dropdown Card */}
                <nav
                    aria-label={pick('Navigasi utama', 'Main navigation')}
                    className="hidden md:flex items-center gap-6 lg:gap-7"
                >
                    <Link
                        href="/"
                        aria-current={pathname === '/' ? 'page' : undefined}
                        className={`relative text-[13.5px] tracking-[-0.01em] transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0267C1] rounded-md ${
                            pathname === '/'
                                ? 'text-slate-950 dark:text-white font-semibold'
                                : 'text-slate-600 dark:text-slate-300 font-medium hover:text-slate-950 dark:hover:text-white'
                        }`}
                    >
                        {pick('Beranda', 'Home')}
                        {pathname === '/' && <NavDotIndicator />}
                    </Link>

                    {/* Katalog Dropdown (Carbon-style floating menu card) */}
                    <div
                        className="relative"
                        onMouseEnter={openCatalogHover}
                        onMouseLeave={closeCatalogHover}
                    >
                        <button
                            type="button"
                            onClick={() => setCatalogOpen((prev) => !prev)}
                            aria-expanded={catalogOpen}
                            aria-haspopup="true"
                            className={`relative inline-flex items-center gap-1 text-[13.5px] tracking-[-0.01em] transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0267C1] rounded-md ${
                                isCatalogActive || catalogOpen
                                    ? 'text-slate-950 dark:text-white font-semibold'
                                    : 'text-slate-600 dark:text-slate-300 font-medium hover:text-slate-950 dark:hover:text-white'
                            }`}
                        >
                            <span>{pick('Katalog', 'Catalog')}</span>
                            <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                    catalogOpen ? 'rotate-180' : ''
                                }`}
                            />
                            {isCatalogActive && <NavDotIndicator />}
                        </button>

                        {catalogOpen && (
                            <div className="swap-in absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 w-[330px]">
                                <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-neutral-800 shadow-[0_22px_50px_-12px_rgba(15,23,42,0.18)] p-2 space-y-0.5">
                                    {catalogItems.map((item) => {
                                        const ItemIcon = item.icon;

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setCatalogOpen(false)}
                                                className={`group/drop flex items-start gap-3.5 rounded-2xl p-3 transition-colors ${
                                                    item.active
                                                        ? 'bg-slate-50 dark:bg-slate-800/70'
                                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                                }`}
                                            >
                                                <span
                                                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover/drop:scale-105 ${item.iconClass}`}
                                                >
                                                    <ItemIcon className="h-4 w-4" strokeWidth={1.9} />
                                                </span>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[13.5px] font-semibold text-slate-900 dark:text-white leading-tight">
                                                            {item.title}
                                                        </span>
                                                        {item.badge && (
                                                            <span className="rounded-full bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="mt-0.5 text-xs leading-snug text-slate-500 dark:text-slate-400">
                                                        {item.description}
                                                    </p>
                                                    {item.active && (
                                                        <span className="mt-1 inline-block h-1 w-1 rounded-full bg-amber-400 dark:bg-[#4AB8BD]" />
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <Link
                        href="/guides"
                        aria-current={pathname.startsWith('/guides') ? 'page' : undefined}
                        className={`relative text-[13.5px] tracking-[-0.01em] transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0267C1] rounded-md ${
                            pathname.startsWith('/guides')
                                ? 'text-slate-950 dark:text-white font-semibold'
                                : 'text-slate-600 dark:text-slate-300 font-medium hover:text-slate-950 dark:hover:text-white'
                        }`}
                    >
                        {pick('Panduan', 'Guides')}
                        {pathname.startsWith('/guides') && <NavDotIndicator />}
                    </Link>

                    <button
                        type="button"
                        onClick={() => onOpenChat?.()}
                        className="btn-motion relative inline-flex items-center gap-1.5 text-[13.5px] font-medium tracking-[-0.01em] text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0267C1] rounded-md"
                    >
                        <span>{pick('Tanya Kiko', 'Ask Kiko')}</span>
                        <span className="rounded-full bg-emerald-100 dark:bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 leading-none">
                            AI
                        </span>
                    </button>

                    <Link
                        href="/orders"
                        aria-current={pathname.startsWith('/orders') ? 'page' : undefined}
                        className={`relative text-[13.5px] tracking-[-0.01em] transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0267C1] rounded-md ${
                            pathname.startsWith('/orders')
                                ? 'text-slate-950 dark:text-white font-semibold'
                                : 'text-slate-600 dark:text-slate-300 font-medium hover:text-slate-950 dark:hover:text-white'
                        }`}
                    >
                        {pick('Pesanan', 'Orders')}
                        {pathname.startsWith('/orders') && <NavDotIndicator />}
                    </Link>
                </nav>

                {/* Right: Search Toggle, Utilities, Dark Pill CTA & Minimal Two-Line Mobile Menu */}
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    {/* Search Trigger Button (opens clean popover search bar) */}
                    <button
                        type="button"
                        onClick={handleToggleSearch}
                        aria-expanded={searchOpen}
                        aria-label={pick('Cari Produk', 'Search Products')}
                        title={pick('Cari Produk', 'Search Products')}
                        className={`btn-motion h-9 w-9 inline-flex items-center justify-center rounded-full transition-colors ${
                            searchOpen
                                ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800'
                        }`}
                    >
                        {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                    </button>

                    <div className="hidden sm:block">
                        <LanguageSwitcher />
                    </div>

                    <button
                        type="button"
                        onClick={handleToggleTheme}
                        className="btn-motion h-9 w-9 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-neutral-800 hover:rotate-12"
                        title={darkMode ? pick('Tema Terang', 'Light Theme') : pick('Tema Gelap', 'Dark Theme')}
                        aria-label={pick('Ubah Tema', 'Toggle Theme')}
                    >
                        {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </button>

                    <Link
                        href="/products?sort=popular"
                        className="btn-motion hidden lg:inline-flex relative h-9 w-9 items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#0684E5] dark:hover:text-[#4AB8BD] rounded-full hover:bg-slate-100 dark:hover:bg-neutral-800"
                        title={pick('Daftar Keinginan', 'Wishlist')}
                        aria-label={pick('Daftar Keinginan', 'Wishlist')}
                    >
                        <Heart className="w-4 h-4" />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#0684E5]" />
                    </Link>

                    <Link
                        href="/cart"
                        className="btn-motion relative h-9 w-9 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-neutral-800"
                        title={pick('Keranjang Belanja', 'Shopping Cart')}
                        aria-label={pick('Keranjang Belanja', 'Shopping Cart')}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {cartCount > 0 && (
                            <span
                                key={cartCount}
                                className="micro-pop absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#0684E5] text-white text-[10px] font-bold px-1 shadow-xs"
                            >
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-1.5 ml-0.5">
                            {storeNavItem && (
                                <Link
                                    href={storeNavItem.href}
                                    className="btn-motion btn-sheen hidden sm:inline-flex items-center px-3.5 py-2 rounded-full bg-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 text-white text-xs font-semibold shadow-2xs"
                                >
                                    {storeNavItem.label}
                                </Link>
                            )}

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setUserDropdownOpen((prev) => !prev)}
                                    className="btn-motion flex items-center gap-1.5 p-1 pr-2 rounded-full border border-slate-200/80 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800 transition"
                                    aria-label={pick('Menu Pengguna', 'User Menu')}
                                >
                                    <UserAvatar user={user} className="w-7 h-7 text-[11px]" />
                                    <span className="hidden xl:inline text-xs font-semibold text-slate-900 dark:text-white max-w-[96px] truncate">
                                        {user.name}
                                    </span>
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                </button>

                                {userDropdownOpen && (
                                    <div
                                        className="swap-in absolute right-0 z-50 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-neutral-700 shadow-xl py-2 text-xs"
                                        onClick={() => setUserDropdownOpen(false)}
                                    >
                                        <div className="px-4 py-2 border-b border-slate-100 dark:border-neutral-800">
                                            <p className="font-extrabold text-[#001454] dark:text-white truncate">{user.name}</p>
                                            <p className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">{user.email}</p>
                                        </div>

                                        <Link href="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-neutral-800 text-slate-800 dark:text-neutral-200 transition">
                                            <User className="w-3.5 h-3.5 text-[#1E80A0] dark:text-[#4AB8BD]" />
                                            <span>{pick('Profil Saya', 'My Profile')}</span>
                                        </Link>
                                        <Link href="/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-neutral-800 text-slate-800 dark:text-neutral-200 transition font-medium">
                                            <Package className="w-3.5 h-3.5 text-[#0684E5] dark:text-[#4AB8BD]" />
                                            <span>{pick('Pesanan Saya', 'My Orders')}</span>
                                        </Link>
                                        <Link href="/addresses" className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-neutral-800 text-slate-800 dark:text-neutral-200 transition">
                                            <MapPin className="w-3.5 h-3.5 text-[#1E80A0] dark:text-[#4AB8BD]" />
                                            <span>{pick('Buku Alamat', 'Address Book')}</span>
                                        </Link>

                                        {user.role === 'seller' && (
                                            <div className="border-t border-slate-100 dark:border-neutral-800 my-1 pt-1">
                                                <span className="px-4 text-[10px] font-bold text-[#1E80A0] dark:text-[#4AB8BD] uppercase tracking-wider block mb-1">
                                                    {pick('Toko Saya', 'My Store')}
                                                </span>
                                                <Link href="/seller/products" className="block px-4 py-1.5 hover:bg-slate-50 dark:hover:bg-neutral-800 text-slate-800 dark:text-neutral-200 transition">
                                                    {pick('Produk Toko', 'Store Products')}
                                                </Link>
                                                <Link href="/seller/orders" className="block px-4 py-1.5 hover:bg-slate-50 dark:hover:bg-neutral-800 text-slate-800 dark:text-neutral-200 transition">
                                                    {pick('Pesanan Masuk', 'Incoming Orders')}
                                                </Link>
                                                <Link href="/seller/store" className="block px-4 py-1.5 hover:bg-slate-50 dark:hover:bg-neutral-800 text-slate-800 dark:text-neutral-200 transition">
                                                    {pick('Profil Toko', 'Store Profile')}
                                                </Link>
                                            </div>
                                        )}

                                        {user.role === 'buyer' && (
                                            <div className="border-t border-slate-100 dark:border-neutral-800 my-1 pt-1">
                                                <Link href="/seller/register" className="flex items-center justify-between gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-neutral-800 text-[#0684E5] dark:text-cyan-400 font-bold transition">
                                                    <span>
                                                        {user.seller_status === 'pending'
                                                            ? pick('Status Penjual', 'Seller Status')
                                                            : user.seller_status === 'rejected'
                                                              ? pick('Ajukan Ulang Toko', 'Reapply Store')
                                                              : pick('Buka Toko Penangkar', 'Open Breeder Store')}
                                                    </span>
                                                    {user.seller_status === 'pending' && (
                                                        <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                                            Pending
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

                                        <div className="border-t border-slate-100 dark:border-neutral-800 mt-1 pt-1">
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
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 ml-0.5">
                            <Link
                                href="/login"
                                className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-neutral-200 hover:text-slate-950 dark:hover:text-white transition"
                            >
                                {pick('Masuk', 'Log In')}
                            </Link>
                            <Link
                                href="/register"
                                className="btn-motion btn-sheen inline-flex items-center px-4 py-2 rounded-full bg-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 text-white font-semibold text-xs shadow-2xs"
                            >
                                {pick('Daftar', 'Sign Up')}
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Pill (Carbon two-line button) */}
                    <button
                        type="button"
                        onClick={onOpenMobileSidebar}
                        className="btn-motion md:hidden inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold shrink-0"
                        aria-label={pick('Buka Menu Navigasi', 'Open Navigation Menu')}
                    >
                        <svg viewBox="0 0 16 10" className="w-3.5 h-2.5 fill-none stroke-current" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                            <line x1="1" y1="2.5" x2="15" y2="2.5" />
                            <line x1="1" y1="7.5" x2="15" y2="7.5" />
                        </svg>
                        <span className="hidden sm:inline">{pick('Menu', 'Menu')}</span>
                    </button>
                </div>
            </div>

            {/* Expandable Centered Search Bar Popover */}
            {searchOpen && (
                <div className="swap-in border-t border-slate-100 dark:border-neutral-800/90 bg-white/95 dark:bg-[#070b14]/95 px-3 sm:px-6 py-3.5 shadow-lg">
                    <div className="max-w-2xl mx-auto space-y-3">
                        <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 text-[#1E80A0] dark:text-[#4AB8BD] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    ref={searchInputRef}
                                    type="search"
                                    placeholder={pick(
                                        'Cari ikan, filter, aquascape, tanaman...',
                                        'Search fish, filters, aquascape, plants...',
                                    )}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-10 rounded-full bg-slate-100 dark:bg-[#111a30] pl-11 pr-4 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 border border-transparent focus:border-[#4AB8BD] focus:bg-white dark:focus:bg-[#152038] focus:ring-2 focus:ring-[#4AB8BD]/30 transition"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn-motion btn-sheen h-10 px-5 rounded-full bg-slate-950 hover:bg-slate-800 dark:bg-[#4AB8BD] text-white dark:text-[#001454] text-xs font-semibold shrink-0"
                            >
                                {pick('Cari', 'Search')}
                            </button>
                        </form>

                        <div className="space-y-2.5 pt-1">
                            {searchQuery.trim() && (
                                <button
                                    type="button"
                                    onClick={handleSearchSubmit}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#152038] text-xs font-semibold text-slate-900 dark:text-white hover:bg-[#4AB8BD]/15 transition text-left"
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
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                                        {group.label}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {group.items.map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                onClick={() => setSearchOpen(false)}
                                                className="btn-motion px-2.5 py-1 rounded-full bg-slate-100 dark:bg-neutral-800 hover:bg-slate-950 hover:text-white dark:hover:bg-[#4AB8BD] dark:hover:text-[#001454] text-[11px] font-semibold text-slate-700 dark:text-neutral-200 transition"
                                            >
                                                {item.title}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
