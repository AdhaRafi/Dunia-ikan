import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Fish,
    Home,
    LayoutGrid,
    LogIn,
    LogOut,
    MessageSquare,
    Settings,
    ShoppingBag,
    Store,
    UserPlus,
    Waves,
    X,
} from 'lucide-react';
import BrandWordmark from '@/Components/BrandWordmark';
import UserAvatar from '@/Components/UserAvatar';

function NavRow({ item, collapsed = false, onNavigate }) {
    const Icon = item.icon;

    const baseClasses = `relative group/item w-full h-8 flex items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0267C1] ${
        collapsed ? 'justify-center px-0' : 'gap-3 px-6 hover:bg-slate-50/90 dark:hover:bg-slate-800/40'
    } ${
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

            {!collapsed && <span className="text-[13px] truncate whitespace-nowrap">{item.label}</span>}

            {collapsed && (
                <span
                    role="tooltip"
                    className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-lg bg-[#1e2433] dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-white shadow-lg opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 group-focus-within/item:opacity-100 group-focus-within/item:translate-x-0 transition-all duration-150 before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-[#1e2433] dark:before:border-r-slate-800"
                >
                    {item.label}
                </span>
            )}
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
                aria-label={collapsed ? item.label : undefined}
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
            aria-label={collapsed ? item.label : undefined}
            aria-current={item.active ? 'page' : undefined}
            className={baseClasses}
        >
            {content}
        </Link>
    );
}

export default function Sidebar({
    isOpen,
    onClose,
    onOpenChat,
    darkMode = false,
    onToggleDarkMode,
}) {
    const { url, props } = usePage();
    const user = props?.auth?.user;

    const [isHovered, setIsHovered] = useState(false);

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

    const isDesktopExpanded = isHovered;
    const isDesktopCollapsed = !isHovered;

    const [pathname, queryString = ''] = url.split('?');
    const searchParams = new URLSearchParams(queryString);
    const waterType = searchParams.get('water_type');

    const primaryItems = [
        {
            label: 'Beranda',
            href: '/',
            icon: Home,
            active: pathname === '/',
        },
        {
            label: 'Katalog',
            href: '/products',
            icon: LayoutGrid,
            active: pathname.startsWith('/products') && !waterType,
        },
        {
            label: 'Air Tawar',
            href: '/products?water_type=freshwater',
            icon: Fish,
            active: pathname.startsWith('/products') && waterType === 'freshwater',
        },
        {
            label: 'Air Laut',
            href: '/products?water_type=saltwater',
            icon: Waves,
            active: pathname.startsWith('/products') && waterType === 'saltwater',
        },
        {
            label: 'Panduan',
            href: '/guides',
            icon: BookOpen,
            active: pathname.startsWith('/guides'),
        },
        {
            label: 'Pesanan',
            href: '/orders',
            icon: ShoppingBag,
            active: pathname.startsWith('/orders'),
        },
    ];

    const utilityItems = [
        {
            label: 'Tanya Kiko',
            icon: MessageSquare,
            onClick: () => onOpenChat?.(),
            active: false,
        },
        ...(user?.role === 'seller'
            ? [
                  {
                      label: 'Toko Saya',
                      href: '/seller/products',
                      icon: Store,
                      active: pathname.startsWith('/seller'),
                  },
              ]
            : []),
        ...(user?.role === 'buyer'
            ? [
                  {
                      label: 'Buka Toko',
                      href: '/seller/register',
                      icon: Store,
                      active: pathname.startsWith('/seller/register'),
                  },
              ]
            : []),
        ...(user
            ? [
                  {
                      label: 'Pengaturan',
                      href: '/profile',
                      icon: Settings,
                      active: pathname.startsWith('/profile'),
                  },
                  {
                      label: 'Keluar',
                      href: '/logout',
                      method: 'post',
                      as: 'button',
                      icon: LogOut,
                      active: false,
                  },
              ]
            : [
                  {
                      label: 'Masuk',
                      href: '/login',
                      icon: LogIn,
                      active: pathname.startsWith('/login'),
                  },
                  {
                      label: 'Daftar',
                      href: '/register',
                      icon: UserPlus,
                      active: pathname.startsWith('/register'),
                  },
              ]),
    ];

    const renderSidebarInner = ({ collapsed, isMobile = false }) => (
        <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col min-h-0 flex-1">
                {/* Mobile Drawer Header (Desktop logo sits above sidebar in TopHeader) */}
                {isMobile && (
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
                            aria-label="Tutup menu"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* Navigation Groups */}
                <nav
                    aria-label="Navigasi utama"
                    className={`${isMobile ? 'mt-1' : 'pt-4'} flex-1 ${isMobile || !collapsed ? 'overflow-y-auto' : 'overflow-visible'}`}
                >
                    <div className="space-y-0.5">
                        {primaryItems.map((item) => (
                            <NavRow
                                key={item.label}
                                item={item}
                                collapsed={collapsed}
                                onNavigate={isMobile ? onClose : undefined}
                            />
                        ))}
                    </div>

                    <div
                        className={`my-2.5 border-t border-slate-100 dark:border-slate-800/80 ${
                            collapsed ? 'mx-4' : 'mx-6'
                        }`}
                    />

                    <div className="space-y-0.5">
                        {utilityItems.map((item) => (
                            <NavRow
                                key={item.label}
                                item={item}
                                collapsed={collapsed}
                                onNavigate={isMobile ? onClose : undefined}
                            />
                        ))}
                    </div>
                </nav>
            </div>

            {/* Footer: Profile Summary + Theme Switch */}
            <div className="pt-2.5 pb-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 shrink-0">
                {user && (
                    <Link
                        href="/profile"
                        onClick={isMobile ? onClose : undefined}
                        className={`relative group/profile flex items-center transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0267C1] ${
                            collapsed ? 'justify-center py-1' : 'gap-3 px-6 py-1'
                        }`}
                        aria-label={collapsed ? user.name : undefined}
                    >
                        <UserAvatar user={user} className="w-8 h-8 text-xs" />
                        {!collapsed && (
                            <div className="min-w-0">
                                <p className="text-[13px] font-semibold text-[#001454] dark:text-white truncate leading-tight">
                                    {user.name}
                                </p>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                    {user.email}
                                </p>
                            </div>
                        )}
                        {collapsed && (
                            <span
                                role="tooltip"
                                className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-lg bg-[#1e2433] dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-white shadow-lg opacity-0 group-hover/profile:opacity-100 group-focus-within/profile:opacity-100 transition-opacity duration-150 before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-[#1e2433] dark:before:border-r-slate-800"
                            >
                                {user.name}
                            </span>
                        )}
                    </Link>
                )}

                <button
                    type="button"
                    role="switch"
                    aria-checked={darkMode}
                    onClick={() => onToggleDarkMode?.()}
                    aria-label={darkMode ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
                    className={`relative group/theme w-full flex items-center py-1.5 text-[13px] font-medium text-slate-500 hover:text-[#001454] dark:text-slate-400 dark:hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0267C1] ${
                        collapsed ? 'justify-center' : 'gap-3 px-6'
                    }`}
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

                    {!collapsed && (
                        <span className="truncate">
                            {darkMode ? 'Mode Terang' : 'Mode Gelap'}
                        </span>
                    )}

                    {collapsed && (
                        <span
                            role="tooltip"
                            className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-lg bg-[#1e2433] dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-white shadow-lg opacity-0 group-hover/theme:opacity-100 group-focus-within/theme:opacity-100 transition-opacity duration-150 before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-[#1e2433] dark:before:border-r-slate-800"
                        >
                            {darkMode ? 'Mode Terang' : 'Mode Gelap'}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sticky Rail: Sits below TopHeader logo and expands on hover */}
            <div className="hidden md:block sticky top-16 shrink-0 h-[calc(100vh-4rem)] w-[72px] z-30 select-none">
                <aside
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`absolute top-0 left-0 h-full bg-white dark:bg-[#0e1424] border-r border-slate-200/80 dark:border-slate-800/90 transition-all duration-200 ease-out overflow-visible ${
                        isDesktopExpanded ? 'w-60 shadow-2xl' : 'w-[72px]'
                    }`}
                >
                    {renderSidebarInner({ collapsed: isDesktopCollapsed, isMobile: false })}
                </aside>
            </div>

            {/* Mobile Sliding Drawer */}
            <div
                className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-200 ${
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
                    {renderSidebarInner({ collapsed: false, isMobile: true })}
                </aside>
            </div>
        </>
    );
}
