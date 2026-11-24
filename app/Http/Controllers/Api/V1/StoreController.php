<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Http\Resources\StoreResource;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    /**
     * Show an active store profile, rating summary, and paginated catalog.
     */
    public function show(Request $request, string $slug): JsonResponse
    {
        $store = Store::select(['id', 'user_id', 'name', 'slug', 'city', 'province', 'phone', 'description', 'logo', 'doa_policy'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $perPage = max(1, min(30, $request->integer('per_page', 12)));
        $products = $store->products()
            ->with(['category', 'fishDetail', 'store:id,name,slug,city,province,logo'])
            ->where('is_active', true)
            ->latest()
            ->paginate($perPage);

        return response()->json([
            'store' => new StoreResource($store),
            'store_rating' => $store->ratingSummary($request->user('sanctum')),
            'products' => ProductResource::collection($products)->response()->getData(true),
        ]);
    }
}
