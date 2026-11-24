import {
    BookOpen,
    Fish,
    Home,
    LayoutGrid,
    MessagesSquare,
    ShoppingBag,
    Sprout,
    Store,
    Waves,
} from '@/Components/Icons';

/**
 * Shared storefront navigation links used by mobile drawer and desktop header matching.
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
            label: pick('Komunitas', 'Community'),
            href: '/community',
            icon: MessagesSquare,
            active: pathname.startsWith('/community'),
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
 * Rich catalog dropdown items for the Carbon-style desktop header menu.
 *
 * @param {string} url
 * @param {(idText: string, enText: string) => string} pick
 */
export function buildCatalogDropdownItems(url, pick) {
    const [pathname, queryString = ''] = String(url ?? '/').split('?');
    const searchParams = new URLSearchParams(queryString);
    const waterType = searchParams.get('water_type');
    const category = searchParams.get('category');

    return [
        {
            title: pick('Semua Katalog', 'All Catalog'),
            description: pick('Jelajahi ikan hias, pakan & perlengkapan', 'Browse ornamental fish, food & equipment'),
            href: '/products',
            icon: LayoutGrid,
            iconClass: 'bg-sky-50 text-[#005A9D] ring-1 ring-sky-200/70 dark:bg-sky-400/15 dark:text-sky-300 dark:ring-sky-400/25',
            active: pathname.startsWith('/products') && !waterType && !category,
        },
        {
            title: pick('Ikan Air Tawar', 'Freshwater Fish'),
            description: pick('Cupang, Channa, Arwana, Koi, Discus & Tetra', 'Betta, Channa, Arowana, Koi, Discus & Tetra'),
            href: '/products?water_type=freshwater',
            icon: Fish,
            iconClass: 'bg-amber-50 text-amber-600 ring-1 ring-amber-200/70 dark:bg-amber-400/15 dark:text-amber-300 dark:ring-amber-400/25',
            active: pathname.startsWith('/products') && waterType === 'freshwater',
        },
        {
            title: pick('Ikan Air Laut', 'Saltwater Fish'),
            description: pick('Clownfish, Tang & spesies terumbu karang', 'Clownfish, Tangs & vibrant reef species'),
            href: '/products?water_type=saltwater',
            icon: Waves,
            iconClass: 'bg-cyan-50 text-[#1E80A0] ring-1 ring-cyan-200/70 dark:bg-cyan-400/15 dark:text-[#60C2E6] dark:ring-cyan-400/25',
            badge: pick('Populer', 'Popular'),
            active: pathname.startsWith('/products') && waterType === 'saltwater',
        },
        {
            title: pick('Aquascape & Alat', 'Aquascape & Gear'),
            description: pick('Tanaman hias, filter & perawatan air', 'Aquatic plants, filtration & water care'),
            href: '/products?category=aquascape',
            icon: Sprout,
            iconClass: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/70 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/25',
            active: pathname.startsWith('/products') && category === 'aquascape',
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
                ? pick('Menunggu Acc', 'Pending')
                : user?.seller_status === 'rejected'
                  ? pick('Ajukan Ulang', 'Reapply')
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
