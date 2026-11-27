import {
    BookOpen,
    Droplets,
    Fish,
    Home,
    LayoutGrid,
    MessagesSquare,
    Package,
    ShieldCheck,
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
 * Two-column CommandBar-style catalog dropdown groups for the desktop header menu.
 *
 * @param {string} url
 * @param {(idText: string, enText: string) => string} pick
 */
export function buildCatalogDropdownGroups(url, pick) {
    const [pathname, queryString = ''] = String(url ?? '/').split('?');
    const searchParams = new URLSearchParams(queryString);
    const waterType = searchParams.get('water_type');
    const category = searchParams.get('category');

    return [
        {
            heading: pick('Katalog Ikan', 'Fish Catalog'),
            items: [
                {
                    title: pick('Semua Katalog', 'All Catalog'),
                    description: pick('Seluruh ikan hias, pakan & alat', 'All fish, food & aquarium gear'),
                    href: '/products',
                    icon: LayoutGrid,
                    active: pathname.startsWith('/products') && !waterType && !category,
                },
                {
                    title: pick('Ikan Air Tawar', 'Freshwater Fish'),
                    description: pick('Cupang, Channa, Arwana & Koi', 'Betta, Channa, Arowana & Koi'),
                    href: '/products?water_type=freshwater',
                    icon: Fish,
                    active: pathname.startsWith('/products') && waterType === 'freshwater',
                },
                {
                    title: pick('Ikan Air Laut', 'Saltwater Fish'),
                    description: pick('Clownfish, Tang & ikan terumbu', 'Clownfish, Tang & reef fish'),
                    href: '/products?water_type=saltwater',
                    icon: Waves,
                    badge: pick('Populer', 'Popular'),
                    active: pathname.startsWith('/products') && waterType === 'saltwater',
                },
                {
                    title: pick('Ikan Air Payau', 'Brackish Fish'),
                    description: pick('Puffer, Archerfish & estuari', 'Puffer, Archerfish & estuary'),
                    href: '/products?water_type=brackish',
                    icon: Droplets,
                    active: pathname.startsWith('/products') && waterType === 'brackish',
                },
            ],
        },
        {
            heading: pick('Kebutuhan & Hobi', 'Supplies & Hobby'),
            items: [
                {
                    title: 'Aquascape',
                    description: pick('Anubias, Buce & tanaman air', 'Anubias, Buce & aquatic plants'),
                    href: '/products?category=aquascape',
                    icon: Sprout,
                    active: pathname.startsWith('/products') && category === 'aquascape',
                },
                {
                    title: pick('Perlengkapan', 'Equipment'),
                    description: pick('Tank rimless, filter & lampu', 'Rimless tanks, filters & lights'),
                    href: '/products?category=perlengkapan-aquarium',
                    icon: Package,
                    active: pathname.startsWith('/products') && category === 'perlengkapan-aquarium',
                },
                {
                    title: pick('Pakan & Pelet', 'Food & Pellets'),
                    description: pick('Pelet premium & nutrisi ikan', 'Premium pellets & fish nutrition'),
                    href: '/products?category=pakan-ikan',
                    icon: ShoppingBag,
                    active: pathname.startsWith('/products') && category === 'pakan-ikan',
                },
                {
                    title: pick('Perawatan Air', 'Water Care'),
                    description: pick('Obat ikan, bakteri & garam', 'Fish meds, bacteria & salt'),
                    href: '/products?category=perawatan-ikan',
                    icon: ShieldCheck,
                    active: pathname.startsWith('/products') && category === 'perawatan-ikan',
                },
            ],
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
