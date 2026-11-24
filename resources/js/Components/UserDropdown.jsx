import { useEffect, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    ChevronDown,
    ChevronRight,
    ExternalLink,
    Fish,
    Heart,
    Home,
    LogOut,
    MapPin,
    MessageSquare,
    MessagesSquare,
    Moon,
    Package,
    ShieldCheck,
    ShoppingBag,
    SlidersHorizontal,
    Store,
    Sun,
    User,
    Users,
} from '@/Components/Icons';
import UserAvatar from '@/Components/UserAvatar';
import { useLanguage } from '@/lib/i18n';

function getRoleBadgeMeta(user, pick) {
    if (user?.role === 'admin') {
        return {
            label: 'Admin',
            className:
                'bg-sky-50 text-[#005A9D] border-sky-200 dark:bg-sky-500/15 dark:text-[#60C2E6] dark:border-sky-500/40',
        };
    }

    if (user?.role === 'seller') {
        return {
            label: pick('Penjual', 'Seller'),
            className:
                'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/40',
        };
    }

    if (user?.seller_status === 'pending') {
        return {
            label: 'Pending',
            className:
                'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/40',
        };
    }

    return {
        label: pick('Pembeli', 'Buyer'),
        className:
            'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/40',
    };
}

export default function UserDropdown({
    user,
    isDarkNav = false,
    darkMode = false,
    onToggleTheme,
    onOpenChat,
    unreadChatCount = 0,
    favoriteCount = 0,
    inSellerPortal = false,
    onOpenChange,
}) {
    const { url } = usePage();
    const { locale, setLocale, pick } = useLanguage();
    const [open, setOpen] = useState(false);
    const [prefsOpen, setPrefsOpen] = useState(false);
    const containerRef = useRef(null);
    const triggerRef = useRef(null);

    const setMenuOpen = (next) => {
        setOpen(next);
        if (!next) {
            setPrefsOpen(false);
        }
        onOpenChange?.(next);
    };

    useEffect(() => {
        setMenuOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const handleOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
                triggerRef.current?.focus();
            }
        };

        document.addEventListener('mousedown', handleOutside);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleOutside);
            window.removeEventListener('keydown', handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    if (!user) {
        return null;
    }

    const roleBadge = getRoleBadgeMeta(user, pick);
    const displayLabel = inSellerPortal ? user.store?.name || user.name : user.name;

    const itemClass =
        'group/item flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#14335D] dark:text-slate-100 hover:bg-slate-100/90 dark:hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9D] dark:focus-visible:ring-[#60C2E6] transition-colors';

    const iconClass =
        'w-[18px] h-[18px] shrink-0 text-slate-500 dark:text-slate-400 group-hover/item:text-[#005A9D] dark:group-hover/item:text-[#60C2E6] transition-colors';

    const handleTriggerChat = () => {
        setMenuOpen(false);
        if (typeof onOpenChat === 'function') {
            onOpenChat();
            return;
        }
        window.dispatchEvent(new CustomEvent('dunia-ikan:open-chat'));
    };

    const handleSelectTheme = (targetDark, event) => {
        if (targetDark === darkMode || typeof onToggleTheme !== 'function') {
            return;
        }
        onToggleTheme(event);
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setMenuOpen(!open)}
                aria-expanded={open}
                aria-haspopup="menu"
                aria-label={pick('Menu Pengguna', 'User Menu')}
                className={`btn-motion relative flex items-center gap-1.5 p-0.5 pr-2 rounded-full border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 ${
                    isDarkNav
                        ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white focus-visible:ring-[#60C2E6]'
                        : 'border-[#1E80A0]/20 bg-white/90 hover:bg-white text-[#14335D] dark:border-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:text-slate-100 focus-visible:ring-[#005A9D]'
                }`}
            >
                <span className="relative shrink-0">
                    <UserAvatar user={user} className="w-7 h-7 text-[11px]" />
                    {unreadChatCount > 0 && (
                        <span
                            aria-hidden="true"
                            className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#005A9D] dark:bg-[#60C2E6] ring-2 ring-white dark:ring-[#0e1424]"
                        />
                    )}
                </span>
                <span
                    className={`${
                        inSellerPortal ? 'hidden sm:inline max-w-[140px]' : 'hidden xl:inline max-w-[92px]'
                    } text-xs font-semibold truncate`}
                >
                    {displayLabel}
                </span>
                <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                    } ${isDarkNav ? 'text-white/75' : 'text-[#1E80A0] dark:text-slate-400'}`}
                />
            </button>

            {open && (
                <div
                    role="menu"
                    aria-label={pick('Menu akun pengguna', 'User account menu')}
                    className="dropdown-in absolute right-0 z-50 mt-2.5 w-[304px] max-w-[calc(100vw-1.5rem)] rounded-2xl bg-slate-50 dark:bg-[#070c18] border border-slate-200/90 dark:border-slate-800 shadow-[0_22px_50px_-12px_rgba(0,20,84,0.22)] dark:shadow-[0_24px_54px_-12px_rgba(2,6,23,0.88)] overflow-hidden text-[#14335D] dark:text-slate-100"
                >
                    {/* Elevated Inner Card (21st.dev Card-in-Tray architecture) */}
                    <section className="rounded-2xl bg-white dark:bg-[#111a2e] p-1.5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] border border-slate-200/80 dark:border-slate-700/60">
                        {/* Profile Header */}
                        <div className="flex items-center gap-2.5 px-2 py-2">
                            <UserAvatar
                                user={user}
                                className="w-10 h-10 text-sm border border-slate-200/80 dark:border-slate-700"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-[13.5px] font-semibold text-[#14335D] dark:text-white leading-tight truncate">
                                    {user.name}
                                </p>
                                <p className="mt-0.5 text-[11.5px] text-slate-500 dark:text-slate-400 leading-tight truncate">
                                    {user.email}
                                </p>
                            </div>
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-semibold shrink-0 ${roleBadge.className}`}
                            >
                                {roleBadge.label}
                            </span>
                        </div>

                        {/* Quick Preferences Row (Interactive inline panel, zero right-edge clip) */}
                        <div className="mt-0.5">
                            <button
                                type="button"
                                role="menuitem"
                                aria-expanded={prefsOpen}
                                onClick={() => setPrefsOpen((prev) => !prev)}
                                className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-slate-50/90 hover:bg-slate-100 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9D] dark:focus-visible:ring-[#60C2E6] transition-colors"
                            >
                                <span className="flex items-center gap-2 min-w-0">
                                    <SlidersHorizontal className="w-[18px] h-[18px] shrink-0 text-slate-500 dark:text-slate-400" />
                                    <span className="truncate">
                                        {pick('Tampilan & Bahasa', 'Appearance & Language')}
                                    </span>
                                </span>
                                <span className="flex items-center gap-1.5 shrink-0 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                    <span>
                                        {darkMode ? pick('Gelap', 'Dark') : pick('Terang', 'Light')}
                                        {' · '}
                                        {locale.toUpperCase()}
                                    </span>
                                    <ChevronRight
                                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                            prefsOpen ? 'rotate-90' : ''
                                        }`}
                                    />
                                </span>
                            </button>

                            {prefsOpen && (
                                <div className="mt-1.5 rounded-xl bg-slate-50 dark:bg-[#0b1325] border border-slate-200/80 dark:border-slate-800 p-2 space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[11.5px] font-semibold text-slate-600 dark:text-slate-300">
                                            {pick('Tema', 'Theme')}
                                        </span>
                                        <div className="inline-flex rounded-lg bg-white dark:bg-[#111a2e] p-0.5 border border-slate-200/80 dark:border-slate-700/80">
                                            <button
                                                type="button"
                                                aria-pressed={!darkMode}
                                                onClick={(e) => handleSelectTheme(false, e)}
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                                                    !darkMode
                                                        ? 'bg-[#005A9D] text-white'
                                                        : 'text-slate-600 dark:text-slate-300 hover:text-[#14335D] dark:hover:text-white'
                                                }`}
                                            >
                                                <Sun className="w-3.5 h-3.5" />
                                                {pick('Terang', 'Light')}
                                            </button>
                                            <button
                                                type="button"
                                                aria-pressed={darkMode}
                                                onClick={(e) => handleSelectTheme(true, e)}
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                                                    darkMode
                                                        ? 'bg-[#005A9D] text-white'
                                                        : 'text-slate-600 dark:text-slate-300 hover:text-[#14335D] dark:hover:text-white'
                                                }`}
                                            >
                                                <Moon className="w-3.5 h-3.5" />
                                                {pick('Gelap', 'Dark')}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[11.5px] font-semibold text-slate-600 dark:text-slate-300">
                                            {pick('Bahasa', 'Language')}
                                        </span>
                                        <div className="inline-flex rounded-lg bg-white dark:bg-[#111a2e] p-0.5 border border-slate-200/80 dark:border-slate-700/80">
                                            <button
                                                type="button"
                                                aria-pressed={locale === 'id'}
                                                onClick={() => setLocale('id')}
                                                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                                                    locale === 'id'
                                                        ? 'bg-[#005A9D] text-white'
                                                        : 'text-slate-600 dark:text-slate-300 hover:text-[#14335D] dark:hover:text-white'
                                                }`}
                                            >
                                                ID
                                            </button>
                                            <button
                                                type="button"
                                                aria-pressed={locale === 'en'}
                                                onClick={() => setLocale('en')}
                                                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                                                    locale === 'en'
                                                        ? 'bg-[#005A9D] text-white'
                                                        : 'text-slate-600 dark:text-slate-300 hover:text-[#14335D] dark:hover:text-white'
                                                }`}
                                            >
                                                EN
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="-mx-1.5 my-1.5 h-px bg-slate-100 dark:bg-slate-800" />

                        {/* Group 1: Akun & Aktivitas Belanja */}
                        <div role="group" aria-label={pick('Akun dan belanja', 'Account and shopping')} className="space-y-0.5">
                            <Link
                                href="/profile"
                                role="menuitem"
                                onClick={() => setMenuOpen(false)}
                                className={itemClass}
                            >
                                <span className="flex items-center gap-2.5 min-w-0">
                                    <User className={iconClass} />
                                    <span className="truncate">{pick('Profil Saya', 'My Profile')}</span>
                                </span>
                            </Link>

                            <Link
                                href="/orders"
                                role="menuitem"
                                onClick={() => setMenuOpen(false)}
                                className={itemClass}
                            >
                                <span className="flex items-center gap-2.5 min-w-0">
                                    <Package className={iconClass} />
                                    <span className="truncate">{pick('Pesanan Saya', 'My Orders')}</span>
                                </span>
                            </Link>

                            <Link
                                href="/chat"
                                role="menuitem"
                                onClick={() => setMenuOpen(false)}
                                className={itemClass}
                            >
                                <span className="flex items-center gap-2.5 min-w-0">
                                    <MessageSquare className={iconClass} />
                                    <span className="truncate">{pick('Chat Toko', 'Store Chat')}</span>
                                </span>
                                {unreadChatCount > 0 && (
                                    <span className="inline-flex items-center justify-center rounded-full bg-[#005A9D] text-white px-2 py-0.5 text-[10.5px] font-bold leading-none tabular-nums shrink-0">
                                        {unreadChatCount > 99 ? '99+' : unreadChatCount}
                                    </span>
                                )}
                            </Link>

                            <Link
                                href="/favorites"
                                role="menuitem"
                                onClick={() => setMenuOpen(false)}
                                className={itemClass}
                            >
                                <span className="flex items-center gap-2.5 min-w-0">
                                    <Heart className={iconClass} />
                                    <span className="truncate">{pick('Produk Favorit', 'Favorites')}</span>
                                </span>
                                {favoriteCount > 0 && (
                                    <span className="inline-flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 text-[10.5px] font-semibold leading-none tabular-nums shrink-0">
                                        {favoriteCount}
                                    </span>
                                )}
                            </Link>

                            <Link
                                href="/addresses"
                                role="menuitem"
                                onClick={() => setMenuOpen(false)}
                                className={itemClass}
                            >
                                <span className="flex items-center gap-2.5 min-w-0">
                                    <MapPin className={iconClass} />
                                    <span className="truncate">{pick('Buku Alamat', 'Address Book')}</span>
                                </span>
                            </Link>
                        </div>

                        <div className="-mx-1.5 my-1.5 h-px bg-slate-100 dark:bg-slate-800" />

                        {/* Group 2: Toko & Peran (Highlighted role action) */}
                        <div role="group" aria-label={pick('Toko dan peran', 'Store and role')} className="space-y-0.5">
                            {user.role === 'buyer' && (
                                <Link
                                    href="/seller/register"
                                    role="menuitem"
                                    onClick={() => setMenuOpen(false)}
                                    className={itemClass}
                                >
                                    <span className="flex items-center gap-2.5 min-w-0">
                                        <Store className="w-[18px] h-[18px] shrink-0 text-[#005A9D] dark:text-[#60C2E6]" />
                                        <span className="truncate font-semibold">
                                            {user.seller_status === 'pending'
                                                ? pick('Status Pengajuan Toko', 'Store Application')
                                                : user.seller_status === 'rejected'
                                                  ? pick('Ajukan Ulang Toko', 'Reapply Store')
                                                  : pick('Buka Toko Penangkar', 'Open Breeder Store')}
                                        </span>
                                    </span>
                                    {user.seller_status === 'pending' ? (
                                        <span className="inline-flex items-center rounded-full bg-amber-700 text-white px-2.5 py-0.5 text-[10.5px] font-semibold leading-none shrink-0">
                                            Pending
                                        </span>
                                    ) : user.seller_status === 'rejected' ? (
                                        <span className="inline-flex items-center rounded-full bg-rose-600 text-white px-2.5 py-0.5 text-[10.5px] font-semibold leading-none shrink-0">
                                            {pick('Ditolak', 'Rejected')}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-[#005A9D] text-white px-2.5 py-0.5 text-[10.5px] font-semibold leading-none shrink-0">
                                            {pick('Gratis', 'Free')}
                                        </span>
                                    )}
                                </Link>
                            )}

                            {user.role === 'seller' && (
                                <>
                                    <Link
                                        href="/seller/products"
                                        role="menuitem"
                                        onClick={() => setMenuOpen(false)}
                                        className={itemClass}
                                    >
                                        <span className="flex items-center gap-2.5 min-w-0">
                                            <Fish className="w-[18px] h-[18px] shrink-0 text-[#005A9D] dark:text-[#60C2E6]" />
                                            <span className="truncate font-semibold">
                                                {pick('Produk Toko', 'Store Products')}
                                            </span>
                                        </span>
                                        <span className="inline-flex items-center rounded-full bg-[#005A9D] text-white px-2.5 py-0.5 text-[10.5px] font-semibold leading-none shrink-0">
                                            {pick('Toko', 'Store')}
                                        </span>
                                    </Link>
                                    <Link
                                        href="/seller/orders"
                                        role="menuitem"
                                        onClick={() => setMenuOpen(false)}
                                        className={itemClass}
                                    >
                                        <span className="flex items-center gap-2.5 min-w-0">
                                            <ShoppingBag className={iconClass} />
                                            <span className="truncate">
                                                {pick('Pesanan Masuk', 'Incoming Orders')}
                                            </span>
                                        </span>
                                    </Link>
                                    <Link
                                        href="/seller/store"
                                        role="menuitem"
                                        onClick={() => setMenuOpen(false)}
                                        className={itemClass}
                                    >
                                        <span className="flex items-center gap-2.5 min-w-0">
                                            <ShieldCheck className={iconClass} />
                                            <span className="truncate">
                                                {pick('Profil & Garansi DOA', 'Store & DOA Policy')}
                                            </span>
                                        </span>
                                    </Link>
                                </>
                            )}

                            {user.role === 'admin' && (
                                <a
                                    href="/admin"
                                    role="menuitem"
                                    onClick={() => setMenuOpen(false)}
                                    className={itemClass}
                                >
                                    <span className="flex items-center gap-2.5 min-w-0">
                                        <ShieldCheck className="w-[18px] h-[18px] shrink-0 text-[#005A9D] dark:text-[#60C2E6]" />
                                        <span className="truncate font-semibold">
                                            {pick('Panel Admin', 'Admin Panel')}
                                        </span>
                                    </span>
                                    <span className="inline-flex items-center rounded-full bg-[#005A9D] text-white px-2.5 py-0.5 text-[10.5px] font-semibold leading-none shrink-0">
                                        Admin
                                    </span>
                                </a>
                            )}
                        </div>

                        <div className="-mx-1.5 my-1.5 h-px bg-slate-100 dark:bg-slate-800" />

                        {/* Group 3: Komunitas & Bantuan */}
                        <div role="group" aria-label={pick('Komunitas dan bantuan', 'Community and help')} className="space-y-0.5">
                            <Link
                                href="/community"
                                role="menuitem"
                                onClick={() => setMenuOpen(false)}
                                className={itemClass}
                            >
                                <span className="flex items-center gap-2.5 min-w-0">
                                    <Users className={iconClass} />
                                    <span className="truncate">
                                        {pick('Komunitas Aquarist', 'Aquarist Community')}
                                    </span>
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                            </Link>

                            <Link
                                href="/#faq"
                                role="menuitem"
                                onClick={() => setMenuOpen(false)}
                                className={itemClass}
                            >
                                <span className="flex items-center gap-2.5 min-w-0">
                                    <BookOpen className={iconClass} />
                                    <span className="truncate">{pick('Panduan & FAQ', 'Guides & FAQ')}</span>
                                </span>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                            </Link>

                            <button
                                type="button"
                                role="menuitem"
                                onClick={handleTriggerChat}
                                className={itemClass}
                            >
                                <span className="flex items-center gap-2.5 min-w-0">
                                    <MessagesSquare className={iconClass} />
                                    <span className="truncate">
                                        {pick('Tanya Asisten Kiko', 'Ask Kiko Assistant')}
                                    </span>
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                            </button>
                        </div>
                    </section>

                    {/* Bottom Tray Section (Sits directly on outer tinted tray) */}
                    <section className="p-1.5 space-y-0.5">
                        {inSellerPortal ? (
                            <Link
                                href="/"
                                role="menuitem"
                                onClick={() => setMenuOpen(false)}
                                className={itemClass}
                            >
                                <span className="flex items-center gap-2.5 min-w-0">
                                    <Home className={iconClass} />
                                    <span className="truncate">
                                        {pick('Kembali ke Toko Publik', 'Back to Storefront')}
                                    </span>
                                </span>
                            </Link>
                        ) : user.role === 'seller' && user.store?.slug ? (
                            <Link
                                href={`/stores/${user.store.slug}`}
                                role="menuitem"
                                onClick={() => setMenuOpen(false)}
                                className={itemClass}
                            >
                                <span className="flex items-center gap-2.5 min-w-0">
                                    <Store className={iconClass} />
                                    <span className="truncate">
                                        {pick('Lihat Halaman Toko', 'View Store Page')}
                                    </span>
                                </span>
                            </Link>
                        ) : null}

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            role="menuitem"
                            onClick={() => setMenuOpen(false)}
                            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 transition-colors"
                        >
                            <LogOut className="w-[18px] h-[18px] shrink-0" />
                            <span>{pick('Keluar', 'Sign Out')}</span>
                        </Link>
                    </section>
                </div>
            )}
        </div>
    );
}
