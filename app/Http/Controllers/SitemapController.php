<?php

namespace App\Http\Controllers;

use App\Models\FishGuide;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SitemapController extends Controller
{
    /**
     * Serve the cached XML sitemap of active products, stores, and guides.
     */
    public function __invoke(): Response
    {
        $xml = Cache::remember('sitemap.xml', now()->addHour(), function (): string {
            $urls = [
                ['loc' => url('/'), 'priority' => '1.0', 'changefreq' => 'daily'],
                ['loc' => url('/products'), 'priority' => '0.9', 'changefreq' => 'daily'],
                ['loc' => url('/guides'), 'priority' => '0.8', 'changefreq' => 'weekly'],
            ];

            Product::where('is_active', true)
                ->whereHas('store', fn ($q) => $q->where('is_active', true))
                ->select(['slug', 'updated_at'])
                ->orderByDesc('updated_at')
                ->limit(500)
                ->each(function (Product $product) use (&$urls): void {
                    $urls[] = [
                        'loc' => url('/products/'.$product->slug),
                        'lastmod' => $product->updated_at?->toAtomString(),
                        'priority' => '0.8',
                        'changefreq' => 'weekly',
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

            $lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
            foreach ($urls as $item) {
                $lines[] = '  <url>';
                $lines[] = '    <loc>'.e($item['loc']).'</loc>';
                if (! empty($item['lastmod'])) {
                    $lines[] = '    <lastmod>'.e($item['lastmod']).'</lastmod>';
                }
                $lines[] = '    <changefreq>'.$item['changefreq'].'</changefreq>';
                $lines[] = '    <priority>'.$item['priority'].'</priority>';
                $lines[] = '  </url>';
            }
            $lines[] = '</urlset>';

            return implode("\n", $lines);
        });

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }
}
