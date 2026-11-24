<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    /**
     * List active marketplace products with search, fish morphology filters, and pagination.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Product::with(['store:id,name,slug,city,province,logo', 'category', 'fishDetail'])
            ->where('is_active', true);

        if ($search = trim((string) $request->input('q'))) {
            $normalized = mb_strtolower($search);
            $aliases = [
                'tumbuhan' => 'tanaman',
                'hiasan' => 'hias',
                'alat' => 'perlengkapan',
                'peralatan' => 'perlengkapan',
                'makanan' => 'pakan',
                'obat' => 'perawatan',
            ];
            $terms = array_unique(array_filter([$search, $aliases[$normalized] ?? null]));

            $query->where(function ($q) use ($terms): void {
                foreach ($terms as $term) {
                    $q->orWhereLike('name', "%{$term}%")
                        ->orWhereLike('description', "%{$term}%")
                        ->orWhereHas('fishDetail', function ($fq) use ($term): void {
                            $fq->whereLike('species_name', "%{$term}%")
                                ->orWhereLike('morph_trait', "%{$term}%");
                        })
                        ->orWhereHas('category', function ($cq) use ($term): void {
                            $cq->whereLike('name', "%{$term}%")
                                ->orWhereLike('description', "%{$term}%");
                        });
                }
            });
        }

        if ($categorySlug = $request->input('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $categorySlug));
        }

        if ($waterType = $request->input('water_type')) {
            $query->whereHas('fishDetail', fn ($q) => $q->where('water_type', $waterType));
        }

        if ($sex = $request->input('sex')) {
            $query->whereHas('fishDetail', fn ($q) => $q->where('sex', $sex));
        }

        if ($careLevel = $request->input('care_level')) {
            $query->whereHas('fishDetail', fn ($q) => $q->where('care_level', $careLevel));
        }

        if ($temperament = $request->input('temperament')) {
            $query->whereHas('fishDetail', fn ($q) => $q->where('temperament', $temperament));
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float) $request->input('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float) $request->input('max_price'));
        }

        if ($city = $request->input('city')) {
            $query->whereHas('store', fn ($q) => $q->whereLike('city', "%{$city}%"));
        }

        $sort = (string) $request->input('sort', 'newest');
        match ($sort) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'popular' => $query->orderBy('views', 'desc'),
            default => $query->latest(),
        };

        $perPage = max(1, min(30, $request->integer('per_page', 12)));
        $products = $query->paginate($perPage)->withQueryString();

        $categories = Category::select(['id', 'name', 'slug', 'description', 'icon'])->get();
        $cities = Store::where('is_active', true)->distinct()->orderBy('city')->pluck('city')->values()->all();

        return ProductResource::collection($products)->additional([
            'filters' => [
                'categories' => CategoryResource::collection($categories),
                'cities' => $cities,
            ],
        ]);
    }

    /**
     * Show a single active product with morphology details, related products, and store ratings.
     */
    public function show(Request $request, string $slug): JsonResponse
    {
        $product = Product::with([
            'store:id,user_id,name,slug,city,province,phone,description,logo,doa_policy',
            'category',
            'fishDetail',
        ])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $product->increment('views');
        $product->refresh();

        $relatedProducts = Product::with(['store:id,name,slug,city,province,logo', 'category', 'fishDetail'])
            ->where('id', '!=', $product->id)
            ->where('category_id', $product->category_id)
            ->where('is_active', true)
            ->take(4)
            ->get();

        return response()->json([
            'product' => new ProductResource($product),
            'related_products' => ProductResource::collection($relatedProducts),
            'store_rating' => $product->store?->ratingSummary($request->user('sanctum')),
        ]);
    }
}
