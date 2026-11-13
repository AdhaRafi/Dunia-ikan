<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Inertia\Inertia;
use Inertia\Response;

class StoreController extends Controller
{
    public function show(string $slug): Response
    {
        $store = Store::with(['user:id,name,avatar'])
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
        ]);
    }
}
