<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::with(['store:id,name,slug,city,province,logo', 'category', 'fishDetail'])
            ->where('is_active', true);

        // Pencarian kata kunci (termasuk kategori dan padanan umum seperti alat/tumbuhan/hiasan)
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

            $query->where(function ($q) use ($terms) {
                foreach ($terms as $term) {
                    $q->orWhereLike('name', "%{$term}%")
                        ->orWhereLike('description', "%{$term}%")
                        ->orWhereHas('fishDetail', function ($fq) use ($term) {
                            $fq->whereLike('species_name', "%{$term}%")
                                ->orWhereLike('morph_trait', "%{$term}%");
                        })
                        ->orWhereHas('category', function ($cq) use ($term) {
                            $cq->whereLike('name', "%{$term}%")
                                ->orWhereLike('description', "%{$term}%");
                        });
                }
            });
        }

        // Filter Kategori
        if ($categorySlug = $request->input('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $categorySlug));
        }

        // Filter Parametrik Morfologi Ikan (MorphMarket inspired)
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

        // Filter Rentang Harga
        if ($minPrice = $request->input('min_price')) {
            $query->where('price', '>=', (float) $minPrice);
        }

        if ($maxPrice = $request->input('max_price')) {
            $query->where('price', '<=', (float) $maxPrice);
        }

        // Filter Kota Penjual
        if ($city = $request->input('city')) {
            $query->whereHas('store', fn ($q) => $q->whereLike('city', "%{$city}%"));
        }

        // Sorting
        $sort = $request->input('sort', 'newest');
        match ($sort) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'popular' => $query->orderBy('views', 'desc'),
            default => $query->latest(),
        };

        $products = $query->paginate(12)->withQueryString();

        $categories = Category::select('id', 'name', 'slug')->get();
        $cities = Store::where('is_active', true)->distinct()->pluck('city');

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'cities' => $cities,
            'filters' => [
                'q' => $request->input('q', ''),
                'category' => $request->input('category', ''),
                'water_type' => $request->input('water_type', ''),
                'sex' => $request->input('sex', ''),
                'care_level' => $request->input('care_level', ''),
                'temperament' => $request->input('temperament', ''),
                'min_price' => $request->input('min_price', ''),
                'max_price' => $request->input('max_price', ''),
                'city' => $request->input('city', ''),
                'sort' => $request->input('sort', 'newest'),
            ],
        ]);
    }

    public function show(Request $request, string $slug): Response
    {
        $product = Product::with(['store:id,user_id,name,slug,city,province,description,logo,doa_policy', 'category', 'fishDetail'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $product->increment('views');

        $relatedProducts = Product::with(['store:id,name,slug,city,province,logo', 'category', 'fishDetail'])
            ->where('id', '!=', $product->id)
            ->where('category_id', $product->category_id)
            ->where('is_active', true)
            ->take(4)
            ->get();

        return Inertia::render('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'storeRating' => $product->store?->ratingSummary($request->user()),
        ]);
    }
}
