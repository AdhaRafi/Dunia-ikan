<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\StoreReview;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StoreReviewController extends Controller
{
    public function store(Request $request, string $slug): RedirectResponse
    {
        $store = Store::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        if ($store->user_id === $request->user()->id) {
            return back()->with('error', 'Anda tidak dapat memberi rating untuk toko sendiri.');
        }

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'between:1,5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        StoreReview::updateOrCreate(
            [
                'store_id' => $store->id,
                'user_id' => $request->user()->id,
            ],
            [
                'rating' => (int) $validated['rating'],
                'comment' => isset($validated['comment']) && trim($validated['comment']) !== ''
                    ? trim($validated['comment'])
                    : null,
            ],
        );

        return back()->with('success', 'Rating dan ulasan toko berhasil disimpan.');
    }
}
