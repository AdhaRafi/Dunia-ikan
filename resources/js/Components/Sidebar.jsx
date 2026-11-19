import { useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Heart,
    LogIn,
    LogOut,
    MessageSquare,
    Settings,
    UserPlus,
    X,
} from 'lucide-react';
import BrandWordmark from '@/Components/BrandWordmark';
import UserAvatar from '@/Components/UserAvatar';
import { LanguageSwitcher, useLanguage } from '@/lib/i18n';
import { buildPrimaryNavItems, buildStoreNavItem } from '@/lib/navigation';

function NavRow({ item, onNavigate }) {
    const Icon = item.icon;

    const baseClasses = `relative group/item w-full h-9 flex items-center gap-3 px-6 transition-colors hover:bg-slate-50/90 dark:hover:bg-slate-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0267C1] ${
        item.active
            ? 'text-[#0267C1] dark:text-white font-semibold'
            : 'text-slate-500 hover:text-[#001454] dark:text-slate-400 dark:hover:text-white font-medium'
    }`;

    const content = (
        <>
            {item.active && (
                <span
                    aria-hidden="true"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-l-full bg-[#0267C1] dark:bg-white"
                />
            )}

            <Icon
                strokeWidth={1.8}
                className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                    item.active
                        ? 'text-[#0267C1] dark:text-white'
                        : 'text-slate-400 group-hover/item:text-[#001454] dark:text-slate-400 dark:group-hover/item:text-white'
                }`}
            />

            <span className="text-[13px] truncate whitespace-nowrap">{item.label}</span>
        </>
    );

    if (item.onClick) {
        return (
            <button
                type="button"
                onClick={() => {
                    item.onClick();
                    onNavigate?.();
                }}
                className={baseClasses}
            >
                {content}
            </button>
        );
    }

    return (
        <Link
            href={item.href}
            method={item.method}
            as={item.as}
            onClick={onNavigate}
            aria-current={item.active ? 'page' : undefined}
            className={baseClasses}
        >
            {content}
        </Link>
    );
}

/**
 * Mobile sliding navigation drawer. Desktop storefronts render navigation inline in TopHeader.
 */
export default function Sidebar({
    isOpen,
    onClose,
    onOpenChat,
    darkMode = false,
    onToggleDarkMode,
}) {
    const { url, props } = usePage();
    const { pick } = useLanguage();
    const user = props?.auth?.user;

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose?.();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const [pathname] = url.split('?');
    const primaryItems = buildPrimaryNavItems(url, pick);
    const storeItem = buildStoreNavItem(url, user, pick);

    const utilityItems = [
        {
            label: pick('Produk Favorit', 'Favorites'),
            href: '/favorites',
            icon: Heart,
            active: pathname.startsWith('/favorites'),
        },
        {
            label: pick('Tanya Kiko', 'Ask Kiko'),
            icon: MessageSquare,
            onClick: () => onOpenChat?.(),
            active: false,
        },
        ...(storeItem ? [storeItem] : []),
        ...(user
            ? [
                  {
                      label: pick('Pengaturan', 'Settings'),
                      href: '/profile',
                      icon: Settings,
                      active: pathname.startsWith('/profile'),
                  },
                  {
                      label: pick('Keluar', 'Sign Out'),
                      href: '/logout',
                      method: 'post',
                      as: 'button',
                      icon: LogOut,
                      active: false,
                  },
              ]
            : [
                  {
                      label: pick('Masuk', 'Sign In'),
                      href: '/login',
                      icon: LogIn,
                      active: pathname.startsWith('/login'),
                  },
                  {
                      label: pick('Daftar', 'Sign Up'),
                      href: '/register',
                      icon: UserPlus,
                      active: pathname.startsWith('/register'),
                  },
              ]),
    ];

    return (
        <div
            className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-200 ${
                isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={!isOpen}
        >
            <div
                onClick={onClose}
                className="fixed inset-0 bg-[#001454]/40 backdrop-blur-xs"
            />

            <aside
                className={`fixed inset-y-0 left-0 w-64 max-w-[82vw] h-full bg-white dark:bg-[#0e1424] border-r border-slate-200/80 dark:border-slate-800/90 shadow-2xl z-[61] transform transition-transform duration-200 ease-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-col min-h-0 flex-1">
                        <div className="pt-5 pb-4 px-6 flex items-center justify-between gap-2 shrink-0">
                            <Link
                                href="/"
                                onClick={onClose}
                                className="flex items-center min-w-0 hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0267C1] rounded-lg"
                            >
                                <BrandWordmark className="h-7" />
                            </Link>

                            <button
                                type="button"
                                onClick={onClose}
                                className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700/80 text-slate-400 hover:text-[#001454] dark:hover:text-white flex items-center justify-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0267C1]"
                                aria-label={pick('Tutup menu', 'Close menu')}
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <nav
                            aria-label={pick('Navigasi seluler', 'Mobile navigation')}
                            className="mt-1 flex-1 overflow-y-auto"
                        >
                            <div className="space-y-0.5">
                                {primaryItems.map((item) => (
                                    <NavRow
                                        key={item.href}
                                        item={item}
                                        onNavigate={onClose}
                                    />
                                ))}
                            </div>

                            <div className="my-2.5 mx-6 border-t border-slate-100 dark:border-slate-800/80" />

                            <div className="space-y-0.5">
                                {utilityItems.map((item) => (
                                    <NavRow
                                        key={item.label}
                                        item={item}
                                        onNavigate={onClose}
                                    />
                                ))}
                            </div>
                        </nav>
                    </div>

                    <div className="pt-2.5 pb-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 shrink-0">
                        {user && (
                            <Link
                                href="/profile"
                                onClick={onClose}
                                className="flex items-center gap-3 px-6 py-1 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0267C1]"
                            >
                                <UserAvatar user={user} className="w-8 h-8 text-xs" />
                                <div className="min-w-0">
                                    <p className="text-[13px] font-semibold text-[#001454] dark:text-white truncate leading-tight">
                                        {user.name}
                                    </p>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                        {user.email}
                                    </p>
                                </div>
                            </Link>
                        )}

                        <div className="flex items-center justify-between px-6 py-1">
                            <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
                                {pick('Bahasa', 'Language')}
                            </span>
                            <LanguageSwitcher />
                        </div>

                        <button
                            type="button"
                            role="switch"
                            aria-checked={darkMode}
                            onClick={(event) => onToggleDarkMode?.(event)}
                            aria-label={
                                darkMode
                                    ? pick('Aktifkan mode terang', 'Enable light mode')
                                    : pick('Aktifkan mode gelap', 'Enable dark mode')
                            }
                            className="w-full flex items-center gap-3 px-6 py-1.5 text-[13px] font-medium text-slate-500 hover:text-[#001454] dark:text-slate-400 dark:hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0267C1]"
                        >
                            <span
                                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ${
                                    darkMode ? 'bg-[#0684E5]' : 'bg-slate-200 dark:bg-slate-700'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                                        darkMode ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                                />
                            </span>
                            <span className="truncate">
                                {darkMode
                                    ? pick('Mode Terang', 'Light Mode')
                                    : pick('Mode Gelap', 'Dark Mode')}
                            </span>
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
}
