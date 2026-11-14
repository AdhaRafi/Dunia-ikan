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

        $featuredFish = Product::with(['store', 'category', 'fishDetail'])
            ->where('is_active', true)
            ->where('stock', '>', 0)
            ->whereHas('category', fn ($query) => $query->where('slug', 'ikan-hias'))
            ->latest()
            ->take(8)
            ->get();

        $featuredSupplies = Product::with(['store', 'category'])
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
            ->withCount('products')
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
