<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteController extends Controller
{
    private const MIGRATION_PATH = 'database/migrations/2026_11_19_064948_create_favorites_table.php';

    /**
     * Render the user's favorited fish & product showcase page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        if (! $user || ! $this->ensureTableMigrated('favorites', self::MIGRATION_PATH)) {
            return Inertia::render('Favorites/Index', [
                'favorites' => [],
            ]);
        }

        $items = $user->favorites()
            ->with([
                'product:id,store_id,category_id,name,slug,description,price,stock,image,is_active',
                'product.store:id,name,slug,city,is_active',
                'product.category:id,name,slug',
            ])
            ->latest('id')
            ->get()
            ->filter(fn (Favorite $fav): bool => (bool) (
                $fav->product
                && $fav->product->is_active
                && $fav->product->store
                && $fav->product->store->is_active
            ))
            ->values()
            ->map(function (Favorite $fav): array {
                $product = $fav->product;

                return [
                    'id' => $fav->id,
                    'product_id' => $fav->product_id,
                    'product' => [
                        'id' => $product->id,
                        'name' => $product->name,
                        'slug' => $product->slug,
                        'description' => $product->description,
                        'price' => (float) $product->price,
                        'stock' => (int) $product->stock,
                        'image' => $product->image,
                        'category' => $product->category ? [
                            'id' => $product->category->id,
                            'name' => $product->category->name,
                            'slug' => $product->category->slug,
                        ] : null,
                        'store' => $product->store ? [
                            'id' => $product->store->id,
                            'name' => $product->store->name,
                            'slug' => $product->store->slug,
                            'city' => $product->store->city,
                        ] : null,
                    ],
                ];
            })
            ->all();

        return Inertia::render('Favorites/Index', [
            'favorites' => $items,
        ]);
    }

    /**
     * Toggle a product in the authenticated user's favorites list.
     */
    public function toggle(Request $request): RedirectResponse|JsonResponse
    {
        $this->ensureTableMigrated('favorites', self::MIGRATION_PATH);

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

            return $request->expectsJson()
                ? response()->json(['favorited' => false, 'product_id' => $product->id])
                : back();
        }

        if (! $product->is_active || ! $product->store || ! $product->store->is_active) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Produk atau toko sedang tidak aktif.',
                ], 422);
            }

            return back()->with('error', 'Produk atau toko sedang tidak aktif.');
        }

        Favorite::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);

        return $request->expectsJson()
            ? response()->json(['favorited' => true, 'product_id' => $product->id])
            : back();
    }
}
