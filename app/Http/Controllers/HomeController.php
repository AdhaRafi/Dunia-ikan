<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\FishGuide;
use App\Models\Product;
use App\Models\Store;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
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

        return Inertia::render('Welcome', [
            'categories' => $categories,
            'featuredFish' => $featuredFish,
            'featuredSupplies' => $featuredSupplies,
            'careGuides' => $careGuides,
            'featuredStores' => $featuredStores,
            'stats' => [
                'totalFish' => Product::where('is_active', true)->sum('stock'),
                'totalStores' => Store::where('is_active', true)->count(),
                'totalGuides' => FishGuide::where('is_active', true)->count(),
            ],
        ]);
    }
}
