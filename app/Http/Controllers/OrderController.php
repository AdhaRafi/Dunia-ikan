<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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

        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg,webp|max:3072',
            'payment_notes' => 'nullable|string|max:500',
        ]);

        if ($request->hasFile('payment_proof')) {
            // Hapus file lama jika ada
            if ($order->payment_proof && Storage::disk('public')->exists($order->payment_proof)) {
                Storage::disk('public')->delete($order->payment_proof);
            }

            $path = $request->file('payment_proof')->store('payment_proofs', 'public');

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

        $order->update([
            'status' => 'delivered',
        ]);

        return back()->with('success', 'Terima kasih! Pesanan telah dikonfirmasi selesai.');
    }
}
