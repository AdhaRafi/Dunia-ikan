<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $store = $request->user()->store;
        if (! $store) {
            return redirect()->route('seller.store.create');
        }

        $orders = Order::with(['buyer:id,name,email,phone', 'items'])
            ->where('store_id', $store->id)
            ->latest()
            ->paginate(15);

        return Inertia::render('Seller/Orders/Index', [
            'store' => $store,
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, int $id): Response|RedirectResponse
    {
        $store = $request->user()->store;
        if (! $store) {
            return redirect()->route('seller.store.create');
        }

        $order = Order::with(['buyer:id,name,email,phone', 'items.product.fishDetail'])
            ->where('store_id', $store->id)
            ->where('id', $id)
            ->firstOrFail();

        return Inertia::render('Seller/Orders/Show', [
            'store' => $store,
            'order' => $order,
        ]);
    }

    public function verifyPayment(Request $request, int $id): RedirectResponse
    {
        $store = $request->user()->store;
        if (! $store) {
            abort(403);
        }

        $order = Order::where('store_id', $store->id)->where('id', $id)->firstOrFail();

        if ($order->payment_status === 'verified' || in_array($order->status, ['shipped', 'delivered', 'cancelled'], true)) {
            return back()->with('error', 'Status pesanan saat ini tidak dapat diubah melalui verifikasi pembayaran.');
        }

        $validated = $request->validate([
            'payment_status' => 'required|in:verified,rejected',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validated['payment_status'] === 'verified') {
            $order->update([
                'payment_status' => 'verified',
                'status' => 'processing',
                'payment_notes' => $validated['notes'],
            ]);
            $msg = 'Pembayaran berhasil diverifikasi. Pesanan kini dalam status diproses.';
        } else {
            $order->update([
                'payment_status' => 'rejected',
                'payment_notes' => $validated['notes'] ?? 'Bukti pembayaran ditolak oleh penjual.',
            ]);
            $msg = 'Pembayaran ditandai tidak valid / ditolak.';
        }

        return back()->with('success', $msg);
    }

    public function updateShipping(Request $request, int $id): RedirectResponse
    {
        $store = $request->user()->store;
        if (! $store) {
            abort(403);
        }

        $order = Order::where('store_id', $store->id)->where('id', $id)->firstOrFail();

        if (in_array($order->status, ['delivered', 'cancelled'], true)) {
            return back()->with('error', 'Pesanan yang sudah selesai atau dibatalkan tidak dapat diperbarui.');
        }

        if ($order->payment_method !== 'cod' && $order->payment_status !== 'verified') {
            return back()->with('error', 'Verifikasi pembayaran terlebih dahulu sebelum memasukkan nomor resi.');
        }

        $validated = $request->validate([
            'shipping_courier' => 'required|string|max:50',
            'shipping_tracking_number' => 'required|string|max:100',
        ]);

        $order->update([
            'shipping_courier' => $validated['shipping_courier'],
            'shipping_tracking_number' => $validated['shipping_tracking_number'],
            'status' => 'shipped',
        ]);

        return back()->with('success', 'Informasi pengiriman dan nomor resi berhasil disimpan. Status pesanan diubah ke Dikirim.');
    }
}
