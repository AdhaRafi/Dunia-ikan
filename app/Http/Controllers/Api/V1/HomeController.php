<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\StoreResource;
use App\Models\Category;
use App\Models\FishGuide;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    /**
     * Return homepage highlights for the mobile storefront.
     */
    public function index(): JsonResponse
    {
        $categories = Category::select(['id', 'name', 'slug', 'description', 'icon'])
            ->withCount(['products' => fn ($query) => $query->where('is_active', true)])
            ->get();

        $allFeaturedFish = Product::select([
            'id',
            'store_id',
            'category_id',
            'name',
            'slug',
            'price',
            'stock',
            'views',
            'image',
        ])
            ->with([
                'store:id,name,slug,city,province,logo',
                'category:id,name,slug',
                'fishDetail:product_id,water_type,sex,morph_trait,species_name,care_level,size_stage',
            ])
            ->where('is_active', true)
            ->where('stock', '>', 0)
            ->whereHas('category', fn ($query) => $query->where('slug', 'ikan-hias'))
            ->orderByDesc('id')
            ->take(24)
            ->get();

        $buckets = [
            $allFeaturedFish->filter(fn ($p) => ($p->fishDetail?->water_type ?? 'freshwater') === 'freshwater')->values(),
            $allFeaturedFish->filter(fn ($p) => $p->fishDetail?->water_type === 'saltwater')->values(),
            $allFeaturedFish->filter(fn ($p) => $p->fishDetail?->water_type === 'brackish')->values(),
        ];

        $featuredFish = collect();
        while (collect($buckets)->contains(fn ($bucket) => $bucket->isNotEmpty()) && $featuredFish->count() < 16) {
            foreach ($buckets as $bucket) {
                if ($bucket->isNotEmpty()) {
                    $featuredFish->push($bucket->shift());
                }
            }
        }

        $featuredStores = Store::where('is_active', true)
            ->select(['id', 'name', 'slug', 'city', 'province', 'logo'])
            ->orderBy('id')
            ->take(6)
            ->get();

        return response()->json([
            'categories' => CategoryResource::collection($categories),
            'featured_fish' => ProductResource::collection($featuredFish),
            'featured_stores' => StoreResource::collection($featuredStores),
            'stats' => [
                'total_fish' => (int) Product::where('is_active', true)->sum('stock'),
                'total_stores' => (int) Store::where('is_active', true)->count(),
                'total_guides' => (int) FishGuide::where('is_active', true)->count(),
            ],
        ]);
    }
}
