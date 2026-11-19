<?php

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SeoMetadata
{
    private const DEFAULT_DESCRIPTION = 'Marketplace ikan hias captive-bred, mutasi morph langka, tanaman aquascape, perlengkapan akuarium terkurasi, dan panduan perawatan ikan terpercaya di Indonesia.';

    private const GUIDE_CATEGORY_IMAGES = [
        'Penyakit Parasit' => '/images/products/cupang-halfmoon.jpg',
        'Infeksi Bakteri / Jamur' => '/images/products/cupang-plakat.jpg',
        'Gangguan Pencernaan & Organ' => '/images/products/mas-koki-oranda.jpg',
        'Kualitas Air & Filter' => '/images/banners/air-tawar.jpg',
        'Air Laut & Salinitas' => '/images/products/clownfish-ocellaris.jpg',
        'Air Payau & Estuari' => '/images/products/ikan-kiper.jpg',
        'Ikan Predator & Tank Besar' => '/images/products/arwana-super-red.jpg',
    ];

    /**
     * Resolve per-route metadata, canonical URL, Open Graph values, and JSON-LD schemas
     * from an Inertia page payload and current HTTP request.
     *
     * @param  array<string, mixed>  $page
     * @return array{
     *     title: string,
     *     description: string,
     *     canonical: string,
     *     robots: string,
     *     ogType: string,
     *     image: string,
     *     googleSiteVerification: ?string,
     *     schemas: list<array<string, mixed>>
     * }
     */
    public static function fromInertiaPage(array $page, Request $request): array
    {
        $component = (string) ($page['component'] ?? '');
        $props = is_array($page['props'] ?? null) ? $page['props'] : [];

        $siteName = config('app.name', 'Dunia Ikan');
        $siteUrl = rtrim(url('/'), '/');
        $logoUrl = url('/images/brand/logo-dunia-ikan.png');

        $title = $siteName.' — Marketplace Ikan Hias & Aquascape Indonesia';
        $description = self::DEFAULT_DESCRIPTION;
        $ogType = 'website';
        $image = url('/images/hero/aquarium-poster.webp');
        $canonical = self::resolveCanonical($component, $request);

        $isPrivateRoute = $request->is(
            'admin*',
            'admin-portal*',
            'seller*',
            'cart*',
            'favorites*',
            'checkout*',
            'orders*',
            'profile*',
            'addresses*',
            'dashboard*',
            'login',
            'register',
            'forgot-password*',
            'reset-password*',
            'verify-email*',
            'confirm-password*',
        );
        $robots = $isPrivateRoute
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large, max-snippet:-1';

        $organizationSchema = [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            '@id' => $siteUrl.'/#organization',
            'name' => $siteName,
            'alternateName' => ['DuniaIkan', 'Dunia Ikan Aquatic'],
            'url' => $siteUrl,
            'logo' => $logoUrl,
            'description' => self::DEFAULT_DESCRIPTION,
        ];

        $schemas = [$organizationSchema];

        if ($component === 'Welcome') {
            $title = 'Dunia Ikan : Marketplace Ikan Hias & Mutasi Genetik (Morph) Captive-Bred';
            $description = 'Belanja ikan hias captive-bred, mutasi morph langka, tanaman aquascape, dan perlengkapan akuarium langsung dari penangkar terverifikasi di Indonesia dengan garansi hidup 100%.';
            $schemas[] = [
                '@context' => 'https://schema.org',
                '@type' => 'WebSite',
                '@id' => $siteUrl.'/#website',
                'url' => $siteUrl,
                'name' => $siteName,
                'alternateName' => ['DuniaIkan', 'Dunia Ikan Aquatic'],
                'inLanguage' => 'id-ID',
                'publisher' => ['@id' => $siteUrl.'/#organization'],
                'potentialAction' => [
                    '@type' => 'SearchAction',
                    'target' => $siteUrl.'/products?q={search_term_string}',
                    'query-input' => 'required name=search_term_string',
                ],
            ];
        } elseif ($component === 'Products/Show' && ! empty(data_get($props, 'product.name'))) {
            $product = $props['product'];
            $productName = (string) data_get($product, 'name');
            $title = $productName.' — '.$siteName;
            $description = self::cleanLimit((string) data_get($product, 'description', ''), self::DEFAULT_DESCRIPTION);
            $ogType = 'product';
            $image = self::absoluteUrl(data_get($product, 'image'), '/images/hero/aquarium-poster.webp');

            $stock = (int) data_get($product, 'stock', 0);
            $price = number_format((float) data_get($product, 'price', 0), 2, '.', '');
            $storeName = (string) data_get($product, 'store.name', $siteName);
            $storeSlug = (string) data_get($product, 'store.slug', '');
            $categoryName = (string) data_get($product, 'category.name', 'Ikan Hias');
            $categorySlug = (string) data_get($product, 'category.slug', '');

            $productSchema = [
                '@context' => 'https://schema.org',
                '@type' => 'Product',
                'name' => $productName,
                'description' => $description,
                'image' => [$image],
                'sku' => (string) data_get($product, 'id', ''),
                'category' => $categoryName,
                'offers' => [
                    '@type' => 'Offer',
                    'url' => $canonical,
                    'priceCurrency' => 'IDR',
                    'price' => $price,
                    'availability' => $stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                    'itemCondition' => 'https://schema.org/NewCondition',
                    'seller' => array_filter([
                        '@type' => 'Organization',
                        'name' => $storeName,
                        'url' => $storeSlug !== '' ? url('/stores/'.$storeSlug) : null,
                    ]),
                ],
            ];

            $species = data_get($product, 'fish_detail.species_name') ?? data_get($product, 'fishDetail.species_name');
            if (is_string($species) && $species !== '') {
                $productSchema['brand'] = [
                    '@type' => 'Brand',
                    'name' => $species,
                ];
            }

            $breadcrumbs = [
                ['name' => 'Beranda', 'url' => $siteUrl],
                ['name' => 'Katalog', 'url' => url('/products')],
            ];
            if ($categorySlug !== '') {
                $breadcrumbs[] = [
                    'name' => $categoryName,
                    'url' => url('/products?category='.$categorySlug),
                ];
            }
            $breadcrumbs[] = ['name' => $productName, 'url' => $canonical];

            $schemas[] = $productSchema;
            $schemas[] = self::breadcrumbSchema($breadcrumbs);
        } elseif ($component === 'Products/Index') {
            $filters = is_array($props['filters'] ?? null) ? $props['filters'] : [];
            $title = self::resolveCatalogTitle($filters, $siteName);
            $description = 'Jelajahi katalog ikan hias air tawar, air laut, air payau, tanaman aquascape, dan perlengkapan akuarium dari penangkar terverifikasi di seluruh Indonesia.';

            $schemas[] = [
                '@context' => 'https://schema.org',
                '@type' => 'CollectionPage',
                'name' => $title,
                'description' => $description,
                'url' => $canonical,
                'isPartOf' => ['@id' => $siteUrl.'/#website'],
            ];
            $schemas[] = self::breadcrumbSchema([
                ['name' => 'Beranda', 'url' => $siteUrl],
                ['name' => 'Katalog Ikan & Perlengkapan', 'url' => url('/products')],
            ]);
        } elseif ($component === 'Stores/Show' && ! empty(data_get($props, 'store.name'))) {
            $store = $props['store'];
            $storeName = (string) data_get($store, 'name');
            $city = (string) data_get($store, 'city', 'Indonesia');
            $province = (string) data_get($store, 'province', '');
            $title = $storeName.' ('.$city.') — Toko Penangkar '.$siteName;
            $description = self::cleanLimit((string) data_get($store, 'description', ''), self::DEFAULT_DESCRIPTION);
            $ogType = 'profile';
            $image = self::absoluteUrl(
                data_get($store, 'logo_url') ?? data_get($store, 'logo'),
                '/images/hero/aquarium-poster.webp',
            );

            $storeSchema = [
                '@context' => 'https://schema.org',
                '@type' => ['LocalBusiness', 'Store'],
                'name' => $storeName,
                'description' => $description,
                'url' => $canonical,
                'image' => $image,
                'address' => array_filter([
                    '@type' => 'PostalAddress',
                    'addressLocality' => $city,
                    'addressRegion' => $province !== '' ? $province : null,
                    'addressCountry' => 'ID',
                ]),
            ];

            $phone = (string) data_get($store, 'phone', '');
            if ($phone !== '') {
                $storeSchema['telephone'] = $phone;
            }

            $reviewCount = (int) data_get($props, 'storeRating.count', 0);
            $reviewAvg = (float) data_get($props, 'storeRating.average', 0);
            if ($reviewCount > 0 && $reviewAvg > 0) {
                $storeSchema['aggregateRating'] = [
                    '@type' => 'AggregateRating',
                    'ratingValue' => round($reviewAvg, 2),
                    'reviewCount' => $reviewCount,
                    'bestRating' => 5,
                    'worstRating' => 1,
                ];
            }

            $schemas[] = $storeSchema;
            $schemas[] = self::breadcrumbSchema([
                ['name' => 'Beranda', 'url' => $siteUrl],
                ['name' => 'Katalog', 'url' => url('/products')],
                ['name' => $storeName, 'url' => $canonical],
            ]);
        } elseif ($component === 'Guides/Show' && ! empty(data_get($props, 'guide.title'))) {
            $guide = $props['guide'];
            $guideTitle = (string) data_get($guide, 'title');
            $category = (string) data_get($guide, 'category', 'Panduan Ikan');
            $title = $guideTitle.' — Panduan '.$siteName;
            $description = self::cleanLimit(
                (string) (data_get($guide, 'symptoms') ?? data_get($guide, 'care_instructions') ?? ''),
                'Panduan diagnosa gejala, kualitas air, dan langkah karantina ikan hias di Dunia Ikan.',
            );
            $ogType = 'article';
            $image = self::resolveGuideImage($guide);

            $articleSchema = [
                '@context' => 'https://schema.org',
                '@type' => 'Article',
                'headline' => $guideTitle,
                'description' => $description,
                'image' => [$image],
                'articleSection' => $category,
                'inLanguage' => 'id-ID',
                'author' => [
                    '@type' => 'Organization',
                    'name' => $siteName,
                ],
                'publisher' => [
                    '@type' => 'Organization',
                    'name' => $siteName,
                    'logo' => [
                        '@type' => 'ImageObject',
                        'url' => $logoUrl,
                    ],
                ],
                'mainEntityOfPage' => [
                    '@type' => 'WebPage',
                    '@id' => $canonical,
                ],
            ];

            if ($publishedAt = data_get($guide, 'created_at')) {
                $articleSchema['datePublished'] = (string) $publishedAt;
            }
            if ($updatedAt = data_get($guide, 'updated_at')) {
                $articleSchema['dateModified'] = (string) $updatedAt;
            }

            $schemas[] = $articleSchema;
            $schemas[] = self::breadcrumbSchema([
                ['name' => 'Beranda', 'url' => $siteUrl],
                ['name' => 'Panduan Ikan', 'url' => url('/guides')],
                ['name' => $guideTitle, 'url' => $canonical],
            ]);
        } elseif ($component === 'Guides/Index') {
            $category = (string) data_get($props, 'filters.category', '');
            $title = $category !== ''
                ? 'Panduan '.$category.' — '.$siteName
                : 'Panduan Perawatan & Diagnosa Kesehatan Ikan — '.$siteName;
            $description = 'Kumpulan panduan diagnosa penyakit ikan hias, parameter kualitas air, karantina, dan perawatan spesies dari aquarist Dunia Ikan.';
            $image = url('/images/banners/air-tawar.jpg');

            $schemas[] = [
                '@context' => 'https://schema.org',
                '@type' => 'CollectionPage',
                'name' => $title,
                'description' => $description,
                'url' => $canonical,
                'isPartOf' => ['@id' => $siteUrl.'/#website'],
            ];
            $schemas[] = self::breadcrumbSchema([
                ['name' => 'Beranda', 'url' => $siteUrl],
                ['name' => 'Panduan Ikan', 'url' => url('/guides')],
            ]);
        } elseif ($component === 'Community/Index') {
            $title = 'Komunitas & Chat Global Aquarist — '.$siteName;
            $description = 'Ruang diskusi terbuka sesama penghobi, pembeli, dan penangkar ikan hias Dunia Ikan untuk berbagi tips perawatan, kualitas air, dan koleksi morph.';
            $image = url('/images/banners/aquascape.jpg');

            $schemas[] = [
                '@context' => 'https://schema.org',
                '@type' => 'CollectionPage',
                'name' => $title,
                'description' => $description,
                'url' => $canonical,
                'isPartOf' => ['@id' => $siteUrl.'/#website'],
            ];
            $schemas[] = self::breadcrumbSchema([
                ['name' => 'Beranda', 'url' => $siteUrl],
                ['name' => 'Komunitas', 'url' => url('/community')],
            ]);
        } elseif ($component === 'Favorites/Index') {
            $title = 'Produk Favorit — '.$siteName;
            $description = 'Daftar ikan hias, aquascape, dan perlengkapan akuarium favorit yang kamu simpan di Dunia Ikan.';
        }

        $verification = config('services.google.site_verification');

        return [
            'title' => $title,
            'description' => $description,
            'canonical' => $canonical,
            'robots' => $robots,
            'ogType' => $ogType,
            'image' => $image,
            'googleSiteVerification' => is_string($verification) && trim($verification) !== ''
                ? trim($verification)
                : null,
            'schemas' => $schemas,
        ];
    }

    /**
     * Build clean canonical URLs keeping meaningful landing filters and stripping tracking/sort noise.
     */
    private static function resolveCanonical(string $component, Request $request): string
    {
        if ($component === 'Products/Index') {
            $kept = array_filter([
                'category' => $request->query('category'),
                'water_type' => $request->query('water_type'),
            ], fn ($value): bool => is_string($value) && trim($value) !== '');

            $base = url('/products');

            return $kept !== [] ? $base.'?'.http_build_query($kept) : $base;
        }

        if ($component === 'Guides/Index') {
            $category = $request->query('category');
            $base = url('/guides');

            return is_string($category) && trim($category) !== ''
                ? $base.'?'.http_build_query(['category' => trim($category)])
                : $base;
        }

        return url()->current();
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private static function resolveCatalogTitle(array $filters, string $siteName): string
    {
        $query = trim((string) ($filters['q'] ?? ''));
        if ($query !== '') {
            return 'Jual '.$query.' & Ikan Hias — Katalog '.$siteName;
        }

        return match ($filters['water_type'] ?? '') {
            'freshwater' => 'Katalog Ikan Hias Air Tawar & Aquascape — '.$siteName,
            'saltwater' => 'Katalog Ikan Hias Air Laut & Reef — '.$siteName,
            'brackish' => 'Katalog Ikan Hias Air Payau & Estuari — '.$siteName,
            default => 'Katalog Ikan Hias, Tanaman Aquascape & Perlengkapan Aquarium — '.$siteName,
        };
    }

    private static function resolveGuideImage(mixed $guide): string
    {
        $category = (string) data_get($guide, 'category', '');
        if (isset(self::GUIDE_CATEGORY_IMAGES[$category])) {
            return url(self::GUIDE_CATEGORY_IMAGES[$category]);
        }

        $fishType = Str::lower((string) data_get($guide, 'fish_type', ''));
        if (Str::contains($fishType, ['arwana', 'predator'])) {
            return url('/images/products/arwana-super-red.jpg');
        }
        if (Str::contains($fishType, ['clownfish', 'tang', 'laut'])) {
            return url('/images/products/clownfish-ocellaris.jpg');
        }
        if (Str::contains($fishType, ['payau', 'kiper', 'sumpit'])) {
            return url('/images/products/ikan-kiper.jpg');
        }
        if (Str::contains($fishType, ['koki', 'oranda'])) {
            return url('/images/products/mas-koki-oranda.jpg');
        }
        if (Str::contains($fishType, 'channa')) {
            return url('/images/products/channa-auranti.jpg');
        }
        if (Str::contains($fishType, ['cupang', 'betta'])) {
            return url('/images/products/cupang-halfmoon.jpg');
        }

        return url('/images/banners/air-tawar.jpg');
    }

    /**
     * @param  list<array{name: string, url: string}>  $items
     * @return array<string, mixed>
     */
    private static function breadcrumbSchema(array $items): array
    {
        $itemListElement = [];
        foreach (array_values($items) as $index => $item) {
            $itemListElement[] = [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'name' => $item['name'],
                'item' => $item['url'],
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => $itemListElement,
        ];
    }

    private static function cleanLimit(string $raw, string $fallback): string
    {
        $text = trim((string) preg_replace('/\s+/', ' ', strip_tags($raw)));

        return $text !== '' ? Str::limit($text, 155) : $fallback;
    }

    private static function absoluteUrl(?string $path, string $fallback): string
    {
        if (! is_string($path) || trim($path) === '') {
            return url($fallback);
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return url(str_starts_with($path, '/') ? $path : '/'.$path);
    }
}
