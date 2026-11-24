<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Favorite;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * List the authenticated user's favorited active products.
     */
    public function index(Request $request): JsonResponse
    {
        $products = $request->user()
            ->favorites()
            ->with([
                'product' => fn ($query) => $query->with([
                    'store:id,name,slug,city,province,logo,is_active',
                    'category:id,name,slug',
                    'fishDetail',
                ]),
            ])
            ->latest('id')
            ->get()
            ->map(fn (Favorite $favorite): ?Product => $favorite->product)
            ->filter(fn (?Product $product): bool => (bool) (
                $product
                && $product->is_active
                && $product->store
                && $product->store->is_active
            ))
            ->values();

        return response()->json([
            'data' => ProductResource::collection($products),
            'product_ids' => $products->pluck('id')->values(),
        ]);
    }

    /**
     * Toggle a product in the authenticated user's favorites list.
     */
    public function toggle(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
        ]);

        $user = $request->user();
        $product = Product::with('store')->findOrFail($validated['product_id']);

        $existing = Favorite::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        if ($existing) {
            $existing->delete();

            return response()->json([
                'favorited' => false,
                'product_id' => $product->id,
            ]);
        }

        if (! $product->is_active || ! $product->store || ! $product->store->is_active) {
            return response()->json([
                'message' => 'Produk atau toko sedang tidak aktif.',
            ], 422);
        }

        Favorite::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);

        return response()->json([
            'favorited' => true,
            'product_id' => $product->id,
        ]);
    }
}
