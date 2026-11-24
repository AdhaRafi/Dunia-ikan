import { useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Search,
    Heart,
    ShoppingCart,
    ChevronDown,
    Menu,
    MessageSquare,
    X,
} from '@/Components/Icons';
import AnimatedThemeToggler, { toggleThemeWithTransition } from '@/Components/AnimatedThemeToggler';
import BrandWordmark from '@/Components/BrandWordmark';
import UserDropdown from '@/Components/UserDropdown';
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
    const { auth, cartCount, favoriteIds, unreadChatCount = 0 } = props;
    const [liveFavoriteIds, setLiveFavoriteIds] = useState(() =>
        Array.isArray(favoriteIds) ? favoriteIds : [],
    );
    const favoriteCount = liveFavoriteIds.length;
    const { pick, isEn } = useLanguage();
    const user = auth?.user;
    const [pathname = '/'] = String(url ?? '/').split('?');

    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [catalogOpen, setCatalogOpen] = useState(false);
    const [overDarkSection, setOverDarkSection] = useState(
        () =>
            pathname === '/' ||
            pathname === '/guides' ||
            pathname === '/community' ||
            pathname === '/products' ||
            pathname.startsWith('/stores/'),
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
        let observer = null;
        const intersectingDark = new Set();

        if (typeof window.IntersectionObserver === 'function') {
            const darkSections = document.querySelectorAll('[data-nav-theme="dark"]');
            if (darkSections.length === 0) {
                setOverDarkSection(false);
            } else {
                // Probe only the top header band (~32px down) asynchronously so mount never triggers forced layout reflow.
                observer = new window.IntersectionObserver(
                    (entries) => {
                        for (const entry of entries) {
                            if (entry.isIntersecting) {
                                intersectingDark.add(entry.target);
                            } else {
                                intersectingDark.delete(entry.target);
                            }
                        }
                        setOverDarkSection(intersectingDark.size > 0);
                    },
                    { rootMargin: '-32px 0px -92% 0px', threshold: 0 },
                );

                for (const el of darkSections) {
                    observer.observe(el);
                }
            }
        }

        const handleScroll = () => {
            if (rafId === null) {
                rafId = window.requestAnimationFrame(() => {
                    rafId = null;
                    setIsScrolled(window.scrollY > 24);
                });
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            observer?.disconnect();
            window.removeEventListener('scroll', handleScroll);
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
            }
        };
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setSearchOpen(false);
                setCatalogOpen(false);
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
        setLiveFavoriteIds(Array.isArray(favoriteIds) ? favoriteIds : []);
    }, [favoriteIds]);

    useEffect(() => {
        const onFavoriteToggled = (event) => {
            const productId = event?.detail?.productId;
            if (!productId) {
                return;
            }
            const favorited = Boolean(event.detail.favorited);
            setLiveFavoriteIds((prev) => {
                if (favorited) {
                    return prev.includes(productId) ? prev : [...prev, productId];
                }
                return prev.filter((id) => id !== productId);
            });
        };
        window.addEventListener('dunia-ikan:favorite-toggled', onFavoriteToggled);
        return () => window.removeEventListener('dunia-ikan:favorite-toggled', onFavoriteToggled);
    }, []);

    useEffect(() => {
        setSearchOpen(false);
        setCatalogOpen(false);
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

    const handleToggleTheme = (event) => {
        if (isControlledTheme) {
            onToggleDarkMode(event);
        } else {
            toggleThemeWithTransition(event, !internalDarkMode, setInternalDarkMode);
        }
    };

    const handleToggleSearch = () => {
        setCatalogOpen(false);
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
        : 'text-[#1E80A0] hover:text-[#14335D] hover:bg-[#eef6ff]';

    const getNavLinkClass = (active) =>
        `glass-nav-link whitespace-nowrap shrink-0 px-1 py-1.5 text-[13px] tracking-[-0.01em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 rounded-md ${
            isDarkNav
                ? `focus-visible:ring-[#60C2E6] ${active ? 'text-white font-semibold' : 'text-white/80 hover:text-white font-medium'}`
                : `focus-visible:ring-[#005A9D] ${active ? 'text-[#14335D] font-semibold' : 'text-slate-600 hover:text-[#14335D] font-medium'}`
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
                        : 'glass-nav-light text-[#14335D]'
                } ${isScrolled ? 'glass-nav-scrolled' : ''}`}
            >
                <div className="max-w-[1440px] mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-5">
                {/* Left: Smoothly Crossfading Adaptive Brand Wordmark */}
                <Link
                    href="/"
                    className={`flex items-center shrink-0 hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 rounded-lg ${
                        isDarkNav ? 'focus-visible:ring-[#60C2E6]' : 'focus-visible:ring-[#005A9D]'
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
                    className="hidden lg:flex items-center gap-4 xl:gap-7"
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
                                <div className="dropdown-in rounded-2xl bg-white dark:bg-[#0b152d] border border-[#1E80A0]/15 dark:border-[#60C2E6]/20 shadow-[0_22px_50px_-12px_rgba(0,20,84,0.22)] dark:shadow-[0_24px_54px_-12px_rgba(2,6,23,0.82)] p-2 space-y-0.5">
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
                                                        <span className="text-[13px] font-semibold text-[#14335D] dark:text-white leading-tight">
                                                            {item.title}
                                                        </span>
                                                        {item.badge && (
                                                            <span className="rounded-full bg-[#60C2E6]/15 border border-[#1E80A0]/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#00696D] dark:bg-[#60C2E6]/20 dark:border-[#60C2E6]/30 dark:text-[#60C2E6]">
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

                    <Link
                        href="/community"
                        data-active={pathname.startsWith('/community') ? 'true' : 'false'}
                        aria-current={pathname.startsWith('/community') ? 'page' : undefined}
                        className={getNavLinkClass(pathname.startsWith('/community'))}
                    >
                        {pick('Komunitas', 'Community')}
                    </Link>

                    <button
                        type="button"
                        onClick={() => onOpenChat?.()}
                        className={`${getNavLinkClass(false)} btn-motion inline-flex items-center gap-1.5`}
                    >
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        <span>{pick('Tanya Kiko', 'Ask Kiko')}</span>
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
                                    ? 'bg-[#60C2E6] text-[#14335D] shadow-sm'
                                    : 'bg-[#14335D] text-white shadow-sm'
                                : iconButtonClass
                        }`}
                    >
                        {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                    </button>

                    <div className="hidden sm:block">
                        <LanguageSwitcher variant={isDarkNav ? 'overlay' : 'default'} />
                    </div>

                    <AnimatedThemeToggler
                        darkMode={darkMode}
                        onToggle={handleToggleTheme}
                        className={`h-8 w-8 sm:h-9 sm:w-9 transition-colors duration-300 ${iconButtonClass}`}
                        title={darkMode ? pick('Tema Terang', 'Light Theme') : pick('Tema Gelap', 'Dark Theme')}
                        label={pick('Ubah Tema', 'Toggle Theme')}
                    />

                    <Link
                        href="/favorites"
                        className={`btn-motion hidden sm:inline-flex relative h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-colors duration-300 ${iconButtonClass}`}
                        title={pick('Produk Favorit', 'Favorites')}
                        aria-label={pick('Produk Favorit', 'Favorites')}
                    >
                        <Heart className={`w-4 h-4 ${favoriteCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                        {favoriteCount > 0 && (
                            <span
                                key={favoriteCount}
                                className="micro-pop absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold leading-none px-1 shadow-xs"
                            >
                                {favoriteCount}
                            </span>
                        )}
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
                                className="micro-pop absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#005A9D] text-white text-[10px] font-bold leading-none px-1 shadow-xs"
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
                                            ? 'bg-white/15 hover:bg-[#60C2E6] border border-white/20 text-white hover:text-[#14335D]'
                                            : 'bg-[#14335D] hover:bg-[#005A9D] text-white'
                                    }`}
                                >
                                    {storeNavItem.label}
                                </Link>
                            )}

                            <UserDropdown
                                user={user}
                                isDarkNav={isDarkNav}
                                darkMode={darkMode}
                                onToggleTheme={handleToggleTheme}
                                onOpenChat={onOpenChat}
                                unreadChatCount={unreadChatCount}
                                favoriteCount={favoriteCount}
                                onOpenChange={(nextOpen) => {
                                    if (nextOpen) {
                                        setSearchOpen(false);
                                        setCatalogOpen(false);
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 ml-0.5">
                            <Link
                                href="/login"
                                className={`hidden sm:inline-flex items-center px-2.5 py-1.5 text-xs font-semibold transition-colors duration-300 ${
                                    isDarkNav
                                        ? 'text-white/80 hover:text-white'
                                        : 'text-slate-600 hover:text-[#14335D]'
                                }`}
                            >
                                {pick('Masuk', 'Log in')}
                            </Link>
                            <Link
                                href="/register"
                                className={`btn-motion btn-sheen inline-flex items-center px-3.5 py-1.5 rounded-xl font-semibold text-xs shadow-2xs transition-colors duration-300 ${
                                    isDarkNav
                                        ? 'bg-white/15 hover:bg-[#60C2E6] border border-white/20 text-white hover:text-[#14335D]'
                                        : 'bg-[#14335D] hover:bg-[#005A9D] text-white'
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
                        className={`btn-motion lg:hidden inline-flex items-center gap-1.5 h-8 px-2.5 rounded-xl border text-xs font-semibold shrink-0 transition-colors duration-300 ${
                            isDarkNav
                                ? 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                                : 'bg-[#f3f2ff] hover:bg-[#e5e9fb] border-[#1E80A0]/15 text-[#14335D]'
                        }`}
                        aria-label={pick('Buka Menu Navigasi', 'Open Navigation Menu')}
                    >
                        <Menu className="w-4 h-4" />
                    </button>
                </div>
                </div>
            </div>

            {/* Frosted Aquatic Centered Search Popover */}
            {searchOpen && (
                <div className="dropdown-in absolute inset-x-0 top-full pt-2.5 px-3 sm:px-6 z-50">
                    <div className="max-w-2xl mx-auto rounded-2xl bg-white dark:bg-[#0b152d] border border-[#1E80A0]/15 dark:border-[#60C2E6]/20 p-3.5 shadow-[0_22px_50px_-12px_rgba(0,20,84,0.22)] dark:shadow-[0_24px_54px_-12px_rgba(2,6,23,0.82)] text-[#14335D] dark:text-white">
                    <div className="space-y-3">
                        <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 text-[#1E80A0] dark:text-[#60C2E6] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    ref={searchInputRef}
                                    type="search"
                                    placeholder={pick(
                                        'Cari ikan, filter, aquascape, tanaman...',
                                        'Search fish, filters, aquascape, plants...',
                                    )}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-10 rounded-xl bg-[#f3f2ff] dark:bg-white/10 pl-10 pr-4 text-xs sm:text-sm text-[#14335D] dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/50 border border-[#1E80A0]/15 dark:border-white/15 focus:border-[#60C2E6] focus:bg-white dark:focus:bg-white/15 focus:ring-2 focus:ring-[#60C2E6]/30 transition"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn-motion btn-sheen h-10 px-4 rounded-xl bg-[#14335D] hover:bg-[#005A9D] dark:bg-[#60C2E6] dark:hover:bg-[#3aa4a9] text-white dark:text-[#14335D] text-xs font-bold shrink-0"
                            >
                                {pick('Cari', 'Search')}
                            </button>
                        </form>

                        <div className="space-y-2.5 pt-0.5 max-h-[55vh] overflow-y-auto pr-1">
                            {searchQuery.trim() && (
                                <button
                                    type="button"
                                    onClick={handleSearchSubmit}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[#f3f2ff] dark:bg-white/10 text-xs font-semibold text-[#14335D] dark:text-white hover:bg-[#60C2E6]/15 transition text-left"
                                >
                                    <Search className="w-3.5 h-3.5 text-[#1E80A0] dark:text-[#60C2E6]" />
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
                                                className="btn-motion px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-[#005A9D] hover:text-white dark:hover:bg-[#60C2E6] dark:hover:text-[#14335D] text-[11px] font-semibold text-[#14335D] dark:text-white/85 transition"
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
