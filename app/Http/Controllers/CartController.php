<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(Request $request): Response
    {
        $cartItems = CartItem::with(['product.store', 'product.category', 'product.fishDetail'])
            ->where('user_id', $request->user()->id)
            ->get();

        // Mengelompokkan item keranjang per toko (karena pesanan dicatat per toko)
        $grouped = $cartItems->groupBy(fn ($item) => $item->product->store_id)
            ->map(function ($items) {
                $store = $items->first()->product->store;
                $storeTotal = $items->sum(fn ($item) => $item->quantity * $item->product->price);

                return [
                    'store' => $store,
                    'items' => $items,
                    'storeTotal' => $storeTotal,
                ];
            })->values();

        $grandTotal = $cartItems->sum(fn ($item) => $item->quantity * $item->product->price);

        return Inertia::render('Cart/Index', [
            'groupedCart' => $grouped,
            'totalItems' => $cartItems->sum('quantity'),
            'grandTotal' => $grandTotal,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::with('store')->findOrFail($validated['product_id']);

        if (! $product->is_active || ! $product->store || ! $product->store->is_active) {
            return back()->with('error', 'Produk atau toko sedang tidak aktif.');
        }

        $existing = CartItem::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->first();

        $desiredQuantity = $existing
            ? $existing->quantity + $validated['quantity']
            : $validated['quantity'];

        if ($desiredQuantity > $product->stock) {
            return back()->with('error', "Stok tidak mencukupi. Sisa stok tersedia: {$product->stock}.");
        }

        if ($existing) {
            $existing->update(['quantity' => $desiredQuantity]);
        } else {
            CartItem::create([
                'user_id' => $request->user()->id,
                'product_id' => $product->id,
                'quantity' => $desiredQuantity,
            ]);
        }

        return back()->with('success', "{$product->name} berhasil ditambahkan ke keranjang.");
    }

    public function update(Request $request, CartItem $cartItem): RedirectResponse
    {
        if ($cartItem->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $product = $cartItem->product;

        if ($validated['quantity'] > $product->stock) {
            return back()->with('error', "Jumlah melebihi stok tersedia ({$product->stock}).");
        }

        $cartItem->update(['quantity' => $validated['quantity']]);

        return back()->with('success', 'Jumlah keranjang diperbarui.');
    }

    public function destroy(Request $request, CartItem $cartItem): RedirectResponse
    {
        if ($cartItem->user_id !== $request->user()->id) {
            abort(403);
        }

        $cartItem->delete();

        return back()->with('success', 'Produk dihapus dari keranjang.');
    }
}
