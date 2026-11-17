<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\FishGuide;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class HomeController extends Controller
{
    private const HOME_CACHE_KEY = 'home_page_payload_v2';

    private const FILTERS_CACHE_KEY = 'product_filters_v2';

    /**
     * Render the public homepage using a short-lived plain-array catalog snapshot.
     */
    public function index(): Response
    {
        $payload = Cache::remember(self::HOME_CACHE_KEY, now()->addSeconds(60), function (): array {
            $categories = Category::withCount('products')->get();

            $allFeaturedFish = Product::with(['store:id,name,slug,city,logo', 'category', 'fishDetail'])
                ->where('is_active', true)
                ->where('stock', '>', 0)
                ->whereHas('category', fn ($query) => $query->where('slug', 'ikan-hias'))
                ->orderByDesc('id')
                ->take(48)
                ->get();

            // Interleave freshwater, saltwater, and brackish so "All" showcases every habitat
            $buckets = [
                $allFeaturedFish->filter(fn ($p) => ($p->fishDetail?->water_type ?? 'freshwater') === 'freshwater')->values(),
                $allFeaturedFish->filter(fn ($p) => $p->fishDetail?->water_type === 'saltwater')->values(),
                $allFeaturedFish->filter(fn ($p) => $p->fishDetail?->water_type === 'brackish')->values(),
            ];
            $featuredFish = collect();
            while (collect($buckets)->contains(fn ($b) => $b->isNotEmpty())) {
                foreach ($buckets as $bucket) {
                    if ($bucket->isNotEmpty()) {
                        $featuredFish->push($bucket->shift());
                    }
                }
            }

            $featuredSupplies = Product::with(['store:id,name,slug,city,logo', 'category'])
                ->where('is_active', true)
                ->where('stock', '>', 0)
                ->whereHas('category', fn ($query) => $query->where('slug', '!=', 'ikan-hias'))
                ->latest()
                ->take(2)
                ->get();

            $careGuides = FishGuide::where('is_active', true)
                ->latest()
                ->take(3)
                ->get();

            $featuredStores = Store::where('is_active', true)
                ->select(['id', 'name', 'slug', 'city', 'province', 'description', 'logo', 'doa_policy'])
                ->withCount('products')
                ->orderBy('id')
                ->take(6)
                ->get();

            // Convert collections/models to plain arrays because cache.serializable_classes is disabled.
            return [
                'categories' => $categories->values()->toArray(),
                'featuredFish' => $featuredFish->values()->toArray(),
                'featuredSupplies' => $featuredSupplies->values()->toArray(),
                'careGuides' => $careGuides->values()->toArray(),
                'featuredStores' => $featuredStores->values()->toArray(),
                'stats' => [
                    'totalFish' => (int) Product::where('is_active', true)->sum('stock'),
                    'totalStores' => (int) Store::where('is_active', true)->count(),
                    'totalGuides' => (int) FishGuide::where('is_active', true)->count(),
                ],
            ];
        });

        return Inertia::render('Welcome', $payload);
    }

    /**
     * Route authenticated users to their role-specific workspace.
     */
    public function dashboard(Request $request): RedirectResponse|HttpResponse
    {
        $user = $request->user();
        if ($user->isAdmin()) {
            return Inertia::location(url('/admin'));
        }
        if ($user->isSeller()) {
            return $user->store
                ? redirect()->route('seller.products.index')
                : redirect()->route('seller.store.create');
        }
        if ($user->isPendingSeller()) {
            return redirect()->route('seller.store.create');
        }

        return redirect()->route('orders.index');
    }

    /**
     * Invalidate cached homepage and filter snapshots after catalog or store mutations.
     */
    public static function flushCatalogCache(): void
    {
        Cache::forget(self::HOME_CACHE_KEY);
        Cache::forget(self::FILTERS_CACHE_KEY);
    }
}
