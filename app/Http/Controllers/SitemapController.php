<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\FishGuide;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SitemapController extends Controller
{
    /**
     * Serve the cached XML sitemap of public hubs, habitat filters, products, stores, and guides.
     */
    public function __invoke(): Response
    {
        $xml = Cache::remember('sitemap_xml_v2', now()->addHour(), function (): string {
            $urls = [
                ['loc' => url('/'), 'priority' => '1.0', 'changefreq' => 'daily'],
                ['loc' => url('/products'), 'priority' => '0.9', 'changefreq' => 'daily'],
                ['loc' => url('/products?water_type=freshwater'), 'priority' => '0.8', 'changefreq' => 'daily'],
                ['loc' => url('/products?water_type=saltwater'), 'priority' => '0.8', 'changefreq' => 'daily'],
                ['loc' => url('/products?water_type=brackish'), 'priority' => '0.8', 'changefreq' => 'weekly'],
                ['loc' => url('/guides'), 'priority' => '0.8', 'changefreq' => 'weekly'],
                ['loc' => url('/community'), 'priority' => '0.7', 'changefreq' => 'daily'],
            ];

            Category::select(['slug', 'updated_at'])
                ->orderBy('id')
                ->each(function (Category $category) use (&$urls): void {
                    $urls[] = [
                        'loc' => url('/products?category='.$category->slug),
                        'lastmod' => $category->updated_at?->toAtomString(),
                        'priority' => '0.8',
                        'changefreq' => 'weekly',
                    ];
                });

            Product::where('is_active', true)
                ->whereHas('store', fn ($q) => $q->where('is_active', true))
                ->select(['name', 'slug', 'image', 'updated_at'])
                ->orderByDesc('updated_at')
                ->limit(500)
                ->each(function (Product $product) use (&$urls): void {
                    $imageUrl = null;
                    if (is_string($product->image) && trim($product->image) !== '') {
                        $imageUrl = str_starts_with($product->image, 'http')
                            ? $product->image
                            : url(str_starts_with($product->image, '/') ? $product->image : '/'.$product->image);
                    }

                    $urls[] = [
                        'loc' => url('/products/'.$product->slug),
                        'lastmod' => $product->updated_at?->toAtomString(),
                        'priority' => '0.8',
                        'changefreq' => 'weekly',
                        'image' => $imageUrl,
                        'imageTitle' => $product->name,
                    ];
                });

            Store::where('is_active', true)
                ->select(['slug', 'updated_at'])
                ->orderByDesc('updated_at')
                ->limit(200)
                ->each(function (Store $store) use (&$urls): void {
                    $urls[] = [
                        'loc' => url('/stores/'.$store->slug),
                        'lastmod' => $store->updated_at?->toAtomString(),
                        'priority' => '0.7',
                        'changefreq' => 'weekly',
                    ];
                });

            FishGuide::where('is_active', true)
                ->select(['id', 'updated_at'])
                ->orderByDesc('updated_at')
                ->limit(200)
                ->each(function (FishGuide $guide) use (&$urls): void {
                    $urls[] = [
                        'loc' => url('/guides/'.$guide->id),
                        'lastmod' => $guide->updated_at?->toAtomString(),
                        'priority' => '0.7',
                        'changefreq' => 'monthly',
                    ];
                });

            $lines = [
                '<?xml version="1.0" encoding="UTF-8"?>',
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
            ];

            foreach ($urls as $item) {
                $lines[] = '  <url>';
                $lines[] = '    <loc>'.e($item['loc']).'</loc>';
                if (! empty($item['lastmod'])) {
                    $lines[] = '    <lastmod>'.e($item['lastmod']).'</lastmod>';
                }
                $lines[] = '    <changefreq>'.$item['changefreq'].'</changefreq>';
                $lines[] = '    <priority>'.$item['priority'].'</priority>';
                if (! empty($item['image'])) {
                    $lines[] = '    <image:image>';
                    $lines[] = '      <image:loc>'.e($item['image']).'</image:loc>';
                    if (! empty($item['imageTitle'])) {
                        $lines[] = '      <image:title>'.e($item['imageTitle']).'</image:title>';
                    }
                    $lines[] = '    </image:image>';
                }
                $lines[] = '  </url>';
            }

            $lines[] = '</urlset>';

            return implode("\n", $lines);
        });

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
            'Cache-Control' => 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400',
        ]);
    }

    /**
     * Serve dynamic crawler directives with an absolute sitemap URL.
     */
    public function robots(): Response
    {
        $lines = [
            'User-agent: *',
            'Allow: /',
            'Disallow: /admin',
            'Disallow: /admin-portal',
            'Disallow: /seller',
            'Disallow: /cart',
            'Disallow: /checkout',
            'Disallow: /orders',
            'Disallow: /profile',
            'Disallow: /addresses',
            'Disallow: /dashboard',
            'Disallow: /login',
            'Disallow: /register',
            'Disallow: /forgot-password',
            'Disallow: /reset-password',
            '',
            'Sitemap: '.url('/sitemap.xml'),
        ];

        return response(implode("\n", $lines)."\n", 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
            'Cache-Control' => 'public, max-age=3600, s-maxage=86400',
        ]);
    }
}
