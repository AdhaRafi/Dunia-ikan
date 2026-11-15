<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StoreController extends Controller
{
    public function show(Request $request, string $slug): Response
    {
        $store = Store::select(['id', 'user_id', 'name', 'slug', 'city', 'province', 'phone', 'description', 'logo', 'doa_policy'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $products = $store->products()
            ->with(['category', 'fishDetail'])
            ->where('is_active', true)
            ->latest()
            ->paginate(12);

        return Inertia::render('Stores/Show', [
            'store' => $store,
            'products' => $products,
            'storeRating' => $store->ratingSummary($request->user()),
        ]);
    }
}
