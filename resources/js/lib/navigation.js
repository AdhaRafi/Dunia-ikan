import {
    BookOpen,
    Fish,
    Home,
    LayoutGrid,
    ShoppingBag,
    Store,
    Waves,
} from 'lucide-react';

/**
 * Shared storefront navigation links used by both the desktop header bar and mobile drawer.
 *
 * @param {string} url
 * @param {(idText: string, enText: string) => string} pick
 */
export function buildPrimaryNavItems(url, pick) {
    const [pathname, queryString = ''] = String(url ?? '/').split('?');
    const searchParams = new URLSearchParams(queryString);
    const waterType = searchParams.get('water_type');

    return [
        {
            label: pick('Beranda', 'Home'),
            href: '/',
            icon: Home,
            active: pathname === '/',
        },
        {
            label: pick('Katalog', 'Catalog'),
            href: '/products',
            icon: LayoutGrid,
            active: pathname.startsWith('/products') && !waterType,
        },
        {
            label: pick('Air Tawar', 'Freshwater'),
            href: '/products?water_type=freshwater',
            icon: Fish,
            active: pathname.startsWith('/products') && waterType === 'freshwater',
        },
        {
            label: pick('Air Laut', 'Saltwater'),
            href: '/products?water_type=saltwater',
            icon: Waves,
            active: pathname.startsWith('/products') && waterType === 'saltwater',
        },
        {
            label: pick('Panduan', 'Care Guides'),
            href: '/guides',
            icon: BookOpen,
            active: pathname.startsWith('/guides'),
        },
        {
            label: pick('Pesanan', 'Orders'),
            href: '/orders',
            icon: ShoppingBag,
            active: pathname.startsWith('/orders'),
        },
    ];
}

/**
 * Seller/buyer storefront quick link shown when signed in as buyer or seller.
 *
 * @param {string} url
 * @param {Record<string, any> | null | undefined} user
 * @param {(idText: string, enText: string) => string} pick
 */
export function buildStoreNavItem(url, user, pick) {
    const [pathname] = String(url ?? '/').split('?');

    if (user?.role === 'seller') {
        return {
            label: pick('Toko Saya', 'My Store'),
            href: '/seller/products',
            icon: Store,
            active: pathname.startsWith('/seller'),
        };
    }

    if (user?.role === 'buyer') {
        const label =
            user?.seller_status === 'pending'
                ? pick('Menunggu Acc Toko', 'Store Pending')
                : user?.seller_status === 'rejected'
                  ? pick('Pengajuan Ditolak', 'Application Rejected')
                  : pick('Buka Toko', 'Open Store');

        return {
            label,
            href: '/seller/register',
            icon: Store,
            active: pathname.startsWith('/seller/register'),
        };
    }

    return null;
}
