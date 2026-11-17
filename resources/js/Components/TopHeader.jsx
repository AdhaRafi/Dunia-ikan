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
    const [overDarkSection, setOverDarkSection] = useState(
        () => pathname === '/' || pathname === '/products' || pathname.startsWith('/stores/'),
    );
    const [isScrolled, setIsScrolled] = useState(false);

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

    // Navbar adopts dark glass when over a dark hero section or when site-wide Dark Mode is active.
    const isDarkNav = darkMode || overDarkSection;

    const catalogItems = buildCatalogDropdownItems(url, pick);
    const storeNavItem = buildStoreNavItem(url, user, pick);
    const isCatalogActive = pathname.startsWith('/products');

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        let rafId = null;
        const probeY = 32;

        const syncNavSurface = () => {
            rafId = null;
            const darkSections = document.querySelectorAll('[data-nav-theme="dark"]');
            let touchingDark = false;

            for (const el of darkSections) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= probeY && rect.bottom >= probeY) {
                    touchingDark = true;
                    break;
                }
            }

            setOverDarkSection(touchingDark);
            setIsScrolled(window.scrollY > 24);
        };

        const scheduleSync = () => {
            if (rafId === null) {
                rafId = window.requestAnimationFrame(syncNavSurface);
            }
        };

        syncNavSurface();
        const postNavRaf = window.requestAnimationFrame(syncNavSurface);

        window.addEventListener('scroll', scheduleSync, { passive: true });
        window.addEventListener('resize', scheduleSync, { passive: true });

        return () => {
            window.removeEventListener('scroll', scheduleSync);
            window.removeEventListener('resize', scheduleSync);
            window.cancelAnimationFrame(postNavRaf);
            if (rafId !== null) {
                window.cancelAnimationFrame(rafId);
            }
        };
    }, [url]);

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

    const iconButtonClass = isDarkNav
        ? 'text-white/80 hover:text-white hover:bg-white/15'
        : 'text-[#1E80A0] hover:text-[#001454] hover:bg-[#eef6ff]';

    const getNavLinkClass = (active) =>
        `glass-nav-link px-1 py-1.5 text-[13px] tracking-[-0.01em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 rounded-md ${
            isDarkNav
                ? `focus-visible:ring-[#4AB8BD] ${active ? 'text-white font-semibold' : 'text-white/80 hover:text-white font-medium'}`
                : `focus-visible:ring-[#0684E5] ${active ? 'text-[#001454] font-semibold' : 'text-slate-600 hover:text-[#001454] font-medium'}`
        }`;

    return (
        <header
            ref={headerRef}
            className="sticky top-0 z-40 w-full"
        >
            <div
                className={`glass-nav-bar w-full ${
                    isDarkNav
                        ? 'glass-nav-dark text-white'
                        : 'glass-nav-light text-[#001454]'
                } ${isScrolled ? 'glass-nav-scrolled' : ''}`}
            >
                <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-5">
                {/* Left: Smoothly Crossfading Adaptive Brand Wordmark */}
                <Link
                    href="/"
                    className={`flex items-center shrink-0 hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 rounded-lg ${
                        isDarkNav ? 'focus-visible:ring-[#4AB8BD]' : 'focus-visible:ring-[#0684E5]'
                    }`}
                >
                    <BrandWordmark
                        variant="adaptive"
                        isDarkSurface={isDarkNav}
                        className="h-6 sm:h-7"
                    />
                </Link>

                {/* Center: Floating Glass Links + Glowing Aquatic Hover Underline */}
                <nav
                    aria-label={pick('Navigasi utama', 'Main navigation')}
                    className="hidden md:flex items-center gap-5 lg:gap-7"
                >
                    <Link
                        href="/"
                        data-active={pathname === '/' ? 'true' : 'false'}
                        aria-current={pathname === '/' ? 'page' : undefined}
                        className={getNavLinkClass(pathname === '/')}
                    >
                        {pick('Beranda', 'Home')}
                    </Link>

                    {/* Katalog Dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={openCatalogHover}
                        onMouseLeave={closeCatalogHover}
                    >
                        <button
                            type="button"
                            onClick={() => setCatalogOpen((prev) => !prev)}
                            data-active={isCatalogActive || catalogOpen ? 'true' : 'false'}
                            aria-expanded={catalogOpen}
                            aria-haspopup="true"
                            className={`${getNavLinkClass(isCatalogActive || catalogOpen)} inline-flex items-center gap-1`}
                        >
                            <span>{pick('Katalog', 'Catalog')}</span>
                            <ChevronDown
                                className={`w-3.5 h-3.5 opacity-80 transition-transform duration-200 ${
                                    catalogOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {catalogOpen && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 w-[330px]">
                                <div className="dropdown-in rounded-2xl bg-white dark:bg-[#0b152d] border border-[#1E80A0]/15 dark:border-[#4AB8BD]/20 shadow-[0_22px_50px_-12px_rgba(0,20,84,0.22)] dark:shadow-[0_24px_54px_-12px_rgba(2,6,23,0.82)] p-2 space-y-0.5">
                                    {catalogItems.map((item) => {
                                        const ItemIcon = item.icon;

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setCatalogOpen(false)}
                                                className={`group/drop flex items-start gap-3.5 rounded-xl p-2.5 transition-colors ${
                                                    item.active
                                                        ? 'bg-[#eef6ff] dark:bg-white/15'
                                                        : 'hover:bg-slate-50 dark:hover:bg-white/10'
                                                }`}
                                            >
                                                <span
                                                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover/drop:scale-105 ${item.iconClass}`}
                                                >
                                                    <ItemIcon className="h-4 w-4" strokeWidth={1.9} />
                                                </span>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[13px] font-semibold text-[#001454] dark:text-white leading-tight">
                                                            {item.title}
                                                        </span>
                                                        {item.badge && (
                                                            <span className="rounded-full bg-[#4AB8BD]/15 border border-[#1E80A0]/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#00696D] dark:bg-[#4AB8BD]/20 dark:border-[#4AB8BD]/30 dark:text-[#4AB8BD]">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="mt-0.5 text-[11.5px] leading-snug text-slate-500 dark:text-white/60">
                                                        {item.description}
                                                    </p>
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
                        data-active={pathname.startsWith('/guides') ? 'true' : 'false'}
                        aria-current={pathname.startsWith('/guides') ? 'page' : undefined}
                        className={getNavLinkClass(pathname.startsWith('/guides'))}
                    >
                        {pick('Panduan', 'Guides')}
                    </Link>

                    <button
                        type="button"
                        onClick={() => onOpenChat?.()}
                        className={`${getNavLinkClass(false)} btn-motion inline-flex items-center gap-1.5`}
                    >
                        <span>{pick('Tanya Kiko', 'Ask Kiko')}</span>
                        <span
                            className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider leading-none transition-colors duration-300 ${
                                isDarkNav
                                    ? 'bg-[#4AB8BD]/20 border border-[#4AB8BD]/35 text-[#8BE8EC]'
                                    : 'bg-[#4AB8BD]/15 border border-[#1E80A0]/25 text-[#00696D]'
                            }`}
                        >
                            AI
                        </span>
                    </button>

                    <Link
                        href="/orders"
                        data-active={pathname.startsWith('/orders') ? 'true' : 'false'}
                        aria-current={pathname.startsWith('/orders') ? 'page' : undefined}
                        className={getNavLinkClass(pathname.startsWith('/orders'))}
                    >
                        {pick('Pesanan', 'Orders')}
                    </Link>
                </nav>

                {/* Right: Search Orb, Language/Theme Utilities, Cart, Adaptive CTA & Mobile Trigger */}
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    {/* Search Orb Trigger */}
                    <button
                        type="button"
                        onClick={handleToggleSearch}
                        aria-expanded={searchOpen}
                        aria-label={pick('Cari Produk', 'Search Products')}
                        title={pick('Cari Produk', 'Search Products')}
                        className={`btn-motion h-8 w-8 sm:h-9 sm:w-9 inline-flex items-center justify-center rounded-full transition-all duration-300 ${
                            searchOpen
                                ? isDarkNav
                                    ? 'bg-[#4AB8BD] text-[#001454] shadow-sm'
                                    : 'bg-[#001454] text-white shadow-sm'
                                : iconButtonClass
                        }`}
                    >
                        {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                    </button>

                    <div className="hidden sm:block">
                        <LanguageSwitcher variant={isDarkNav ? 'overlay' : 'default'} />
                    </div>

                    <button
                        type="button"
                        onClick={handleToggleTheme}
                        className={`btn-motion h-8 w-8 sm:h-9 sm:w-9 inline-flex items-center justify-center rounded-full hover:rotate-12 transition-colors duration-300 ${iconButtonClass}`}
                        title={darkMode ? pick('Tema Terang', 'Light Theme') : pick('Tema Gelap', 'Dark Theme')}
                        aria-label={pick('Ubah Tema', 'Toggle Theme')}
                    >
                        {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </button>

                    <Link
                        href="/products?sort=popular"
                        className={`btn-motion hidden lg:inline-flex relative h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 ${iconButtonClass}`}
                        title={pick('Daftar Keinginan', 'Wishlist')}
                        aria-label={pick('Daftar Keinginan', 'Wishlist')}
                    >
                        <Heart className="w-4 h-4" />
                        <span
                            className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                                isDarkNav ? 'bg-[#4AB8BD]' : 'bg-[#0684E5]'
                            }`}
                        />
                    </Link>

                    <Link
                        href="/cart"
                        className={`btn-motion relative h-8 w-8 sm:h-9 sm:w-9 inline-flex items-center justify-center rounded-full transition-colors duration-300 ${iconButtonClass}`}
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
                                    className={`btn-motion btn-sheen hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-2xs transition-colors duration-300 ${
                                        isDarkNav
                                            ? 'bg-white/15 hover:bg-[#4AB8BD] border border-white/20 text-white hover:text-[#001454]'
                                            : 'bg-[#001454] hover:bg-[#0684E5] text-white'
                                    }`}
                                >
                                    {storeNavItem.label}
                                </Link>
                            )}

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setUserDropdownOpen((prev) => !prev)}
                                    className={`btn-motion flex items-center gap-1.5 p-0.5 pr-2 rounded-full border transition-colors duration-300 ${
                                        isDarkNav
                                            ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                                            : 'border-[#1E80A0]/20 bg-white/80 hover:bg-white text-[#001454]'
                                    }`}
                                    aria-label={pick('Menu Pengguna', 'User Menu')}
                                >
                                    <UserAvatar user={user} className="w-7 h-7 text-[11px]" />
                                    <span className="hidden xl:inline text-xs font-semibold max-w-[92px] truncate">
                                        {user.name}
                                    </span>
                                    <ChevronDown
                                        className={`w-3.5 h-3.5 transition-colors duration-300 ${
                                            isDarkNav ? 'text-white/75' : 'text-[#1E80A0]'
                                        }`}
                                    />
                                </button>

                                {userDropdownOpen && (
                                    <div
                                        className="dropdown-in absolute right-0 z-50 mt-3 w-56 rounded-2xl bg-white dark:bg-[#0b152d] border border-[#1E80A0]/15 dark:border-[#4AB8BD]/20 shadow-[0_22px_50px_-12px_rgba(0,20,84,0.22)] dark:shadow-[0_24px_54px_-12px_rgba(2,6,23,0.82)] py-2 text-xs text-[#001454] dark:text-white"
                                        onClick={() => setUserDropdownOpen(false)}
                                    >
                                        <div className="px-4 py-2 border-b border-slate-100 dark:border-white/10">
                                            <p className="font-extrabold text-[#001454] dark:text-white truncate">{user.name}</p>
                                            <p className="text-[11px] text-slate-500 dark:text-white/60 truncate">{user.email}</p>
                                        </div>

                                        <Link href="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-[#f3f2ff] dark:hover:bg-white/10 text-[#001454] dark:text-white/90 transition">
                                            <User className="w-3.5 h-3.5 text-[#1E80A0] dark:text-[#4AB8BD]" />
                                            <span>{pick('Profil Saya', 'My Profile')}</span>
                                        </Link>
                                        <Link href="/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-[#f3f2ff] dark:hover:bg-white/10 text-[#001454] dark:text-white/90 transition font-medium">
                                            <Package className="w-3.5 h-3.5 text-[#0684E5] dark:text-sky-400" />
                                            <span>{pick('Pesanan Saya', 'My Orders')}</span>
                                        </Link>
                                        <Link href="/addresses" className="flex items-center gap-2 px-4 py-2 hover:bg-[#f3f2ff] dark:hover:bg-white/10 text-[#001454] dark:text-white/90 transition">
                                            <MapPin className="w-3.5 h-3.5 text-[#1E80A0] dark:text-[#4AB8BD]" />
                                            <span>{pick('Buku Alamat', 'Address Book')}</span>
                                        </Link>

                                        {user.role === 'seller' && (
                                            <div className="border-t border-slate-100 dark:border-white/10 my-1 pt-1">
                                                <span className="px-4 text-[10px] font-bold text-[#1E80A0] dark:text-[#4AB8BD] uppercase tracking-wider block mb-1">
                                                    {pick('Toko Saya', 'My Store')}
                                                </span>
                                                <Link href="/seller/products" className="block px-4 py-1.5 hover:bg-[#f3f2ff] dark:hover:bg-white/10 text-[#001454] dark:text-white/90 transition">
                                                    {pick('Produk Toko', 'Store Products')}
                                                </Link>
                                                <Link href="/seller/orders" className="block px-4 py-1.5 hover:bg-[#f3f2ff] dark:hover:bg-white/10 text-[#001454] dark:text-white/90 transition">
                                                    {pick('Pesanan Masuk', 'Incoming Orders')}
                                                </Link>
                                                <Link href="/seller/store" className="block px-4 py-1.5 hover:bg-[#f3f2ff] dark:hover:bg-white/10 text-[#001454] dark:text-white/90 transition">
                                                    {pick('Profil Toko', 'Store Profile')}
                                                </Link>
                                            </div>
                                        )}

                                        {user.role === 'buyer' && (
                                            <div className="border-t border-slate-100 dark:border-white/10 my-1 pt-1">
                                                <Link href="/seller/register" className="flex items-center justify-between gap-2 px-4 py-2 hover:bg-[#f3f2ff] dark:hover:bg-white/10 text-[#0684E5] dark:text-cyan-300 font-bold transition">
                                                    <span>
                                                        {user.seller_status === 'pending'
                                                            ? pick('Status Penjual', 'Seller Status')
                                                            : user.seller_status === 'rejected'
                                                              ? pick('Ajukan Ulang Toko', 'Reapply Store')
                                                              : pick('Buka Toko Penangkar', 'Open Breeder Store')}
                                                    </span>
                                                    {user.seller_status === 'pending' && (
                                                        <span className="px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-400/20 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                                                            Pending
                                                        </span>
                                                    )}
                                                    {user.seller_status === 'rejected' && (
                                                        <span className="px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-400/20 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
                                                            {pick('Ditolak', 'Rejected')}
                                                        </span>
                                                    )}
                                                </Link>
                                            </div>
                                        )}

                                        <div className="border-t border-slate-100 dark:border-white/10 mt-1 pt-1">
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="block w-full text-left px-4 py-2 text-[#ba1a1a] dark:text-rose-300 hover:bg-[#ffdad6]/40 dark:hover:bg-rose-500/20 transition font-medium"
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
                                className={`hidden sm:inline-flex items-center px-2.5 py-1.5 text-xs font-semibold transition-colors duration-300 ${
                                    isDarkNav
                                        ? 'text-white/80 hover:text-white'
                                        : 'text-slate-600 hover:text-[#001454]'
                                }`}
                            >
                                {pick('Masuk', 'Log in')}
                            </Link>
                            <Link
                                href="/register"
                                className={`btn-motion btn-sheen inline-flex items-center px-3.5 py-1.5 rounded-xl font-semibold text-xs shadow-2xs transition-colors duration-300 ${
                                    isDarkNav
                                        ? 'bg-white/15 hover:bg-[#4AB8BD] border border-white/20 text-white hover:text-[#001454]'
                                        : 'bg-[#001454] hover:bg-[#0684E5] text-white'
                                }`}
                            >
                                {pick('Daftar', 'Sign up')}
                            </Link>
                        </div>
                    )}

                    {/* Mobile Glass Menu Trigger */}
                    <button
                        type="button"
                        onClick={onOpenMobileSidebar}
                        className={`btn-motion md:hidden inline-flex items-center gap-1.5 h-8 px-2.5 rounded-xl border text-xs font-semibold shrink-0 transition-colors duration-300 ${
                            isDarkNav
                                ? 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                                : 'bg-[#f3f2ff] hover:bg-[#e5e9fb] border-[#1E80A0]/15 text-[#001454]'
                        }`}
                        aria-label={pick('Buka Menu Navigasi', 'Open Navigation Menu')}
                    >
                        <svg viewBox="0 0 16 10" className="w-3.5 h-2.5 fill-none stroke-current" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                            <line x1="1" y1="2.5" x2="15" y2="2.5" />
                            <line x1="1" y1="7.5" x2="15" y2="7.5" />
                        </svg>
                    </button>
                </div>
                </div>
            </div>

            {/* Frosted Aquatic Centered Search Popover */}
            {searchOpen && (
                <div className="dropdown-in absolute inset-x-0 top-full pt-2.5 px-3 sm:px-6 z-50">
                    <div className="max-w-2xl mx-auto rounded-2xl bg-white dark:bg-[#0b152d] border border-[#1E80A0]/15 dark:border-[#4AB8BD]/20 p-3.5 shadow-[0_22px_50px_-12px_rgba(0,20,84,0.22)] dark:shadow-[0_24px_54px_-12px_rgba(2,6,23,0.82)] text-[#001454] dark:text-white">
                    <div className="space-y-3">
                        <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 text-[#1E80A0] dark:text-[#4AB8BD] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    ref={searchInputRef}
                                    type="search"
                                    placeholder={pick(
                                        'Cari ikan, filter, aquascape, tanaman...',
                                        'Search fish, filters, aquascape, plants...',
                                    )}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-10 rounded-xl bg-[#f3f2ff] dark:bg-white/10 pl-10 pr-4 text-xs sm:text-sm text-[#001454] dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/50 border border-[#1E80A0]/15 dark:border-white/15 focus:border-[#4AB8BD] focus:bg-white dark:focus:bg-white/15 focus:ring-2 focus:ring-[#4AB8BD]/30 transition"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn-motion btn-sheen h-10 px-4 rounded-xl bg-[#001454] hover:bg-[#0684E5] dark:bg-[#4AB8BD] dark:hover:bg-[#3aa4a9] text-white dark:text-[#001454] text-xs font-bold shrink-0"
                            >
                                {pick('Cari', 'Search')}
                            </button>
                        </form>

                        <div className="space-y-2.5 pt-0.5 max-h-[55vh] overflow-y-auto pr-1">
                            {searchQuery.trim() && (
                                <button
                                    type="button"
                                    onClick={handleSearchSubmit}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[#f3f2ff] dark:bg-white/10 text-xs font-semibold text-[#001454] dark:text-white hover:bg-[#4AB8BD]/15 transition text-left"
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
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/45 px-1">
                                        {group.label}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {group.items.map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                onClick={() => setSearchOpen(false)}
                                                className="btn-motion px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-[#0684E5] hover:text-white dark:hover:bg-[#4AB8BD] dark:hover:text-[#001454] text-[11px] font-semibold text-[#001454] dark:text-white/85 transition"
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
                </div>
            )}
        </header>
    );
}
