<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Support\MediaStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = Order::with(['store', 'items.product'])
            ->where('buyer_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, string $orderNumber): Response
    {
        $order = Order::with(['store', 'items.product.fishDetail'])
            ->where('order_number', $orderNumber)
            ->where('buyer_id', $request->user()->id)
            ->firstOrFail();

        $order->store?->makeVisible([
            'bank_name',
            'bank_account_number',
            'bank_account_name',
            'qris_image',
        ]);

        return Inertia::render('Orders/Show', [
            'order' => $order,
            'midtransClientKey' => config('services.midtrans.client_key'),
            'isMidtransProduction' => (bool) config('services.midtrans.is_production'),
        ]);
    }

    public function uploadPaymentProof(Request $request, string $orderNumber): RedirectResponse
    {
        $order = Order::where('order_number', $orderNumber)
            ->where('buyer_id', $request->user()->id)
            ->firstOrFail();

        if ($order->payment_method === 'cod') {
            return back()->with('error', 'Pesanan COD tidak memerlukan unggah bukti pembayaran.');
        }

        if ($order->payment_status === 'verified' || in_array($order->status, ['processing', 'shipped', 'delivered', 'cancelled'], true)) {
            return back()->with('error', 'Status pesanan saat ini tidak memungkinkan unggah ulang bukti pembayaran.');
        }

        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg,webp|max:3072',
            'payment_notes' => 'nullable|string|max:500',
        ]);

        if ($request->hasFile('payment_proof')) {
            MediaStorage::delete($order->payment_proof);

            $path = MediaStorage::store($request->file('payment_proof'), 'payment_proofs');

            $order->update([
                'payment_proof' => $path,
                'payment_notes' => $request->payment_notes,
                'payment_status' => 'paid',
                'status' => 'awaiting_confirmation',
            ]);
        }

        return back()->with('success', 'Bukti pembayaran berhasil diunggah. Menunggu verifikasi dari toko.');
    }

    public function confirmDelivery(Request $request, string $orderNumber): RedirectResponse
    {
        $order = Order::where('order_number', $orderNumber)
            ->where('buyer_id', $request->user()->id)
            ->firstOrFail();

        if ($order->status !== 'shipped') {
            return back()->with('error', 'Pesanan belum dalam status dikirim.');
        }

        $updates = [
            'status' => 'delivered',
        ];

        if ($order->payment_method === 'cod') {
            $updates['payment_status'] = 'verified';
            $updates['payment_notes'] = $order->payment_notes ?: 'Pembayaran COD diterima saat pesanan tiba.';
        }

        $order->update($updates);

        return back()->with('success', 'Terima kasih! Pesanan telah dikonfirmasi selesai.');
    }
}
