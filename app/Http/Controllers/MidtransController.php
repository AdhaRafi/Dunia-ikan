<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class MidtransController extends Controller
{
    /**
     * Dapatkan atau buat Snap Token dari Midtrans untuk pesanan.
     */
    public function getSnapToken(Request $request, string $orderNumber): JsonResponse
    {
        $order = Order::with(['buyer', 'items'])
            ->where('order_number', $orderNumber)
            ->where('buyer_id', $request->user()->id)
            ->firstOrFail();

        if ($order->payment_status === 'verified') {
            return response()->json([
                'message' => 'Pesanan ini sudah lunas diverifikasi.',
            ], 400);
        }

        $serverKey = config('services.midtrans.server_key');
        $clientKey = config('services.midtrans.client_key');
        $isProduction = (bool) config('services.midtrans.is_production');

        if (empty($serverKey)) {
            return response()->json([
                'message' => 'Kunci MIDTRANS_SERVER_KEY belum dikonfigurasi di server.',
            ], 500);
        }

        // Gunakan snap_token yang sudah ada jika masih valid
        if (! empty($order->snap_token)) {
            return response()->json([
                'snap_token' => $order->snap_token,
                'client_key' => $clientKey,
                'is_production' => $isProduction,
            ]);
        }

        $baseUrl = $isProduction
            ? 'https://app.midtrans.com/snap/v1/transactions'
            : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

        $payload = [
            'transaction_details' => [
                'order_id' => $order->order_number,
                'gross_amount' => (int) round((float) $order->grand_total),
            ],
            'customer_details' => [
                'first_name' => $order->shipping_recipient_name ?: $order->buyer->name,
                'email' => $order->buyer->email,
                'phone' => $order->shipping_phone ?: ($order->buyer->phone ?? '08123456789'),
            ],
            'item_details' => $order->items->map(function ($item) {
                return [
                    'id' => (string) $item->product_id,
                    'price' => (int) round((float) $item->price),
                    'quantity' => (int) $item->quantity,
                    'name' => Str::limit($item->product_name, 45),
                ];
            })->push([
                'id' => 'SHIPPING',
                'price' => (int) round((float) $order->shipping_cost),
                'quantity' => 1,
                'name' => 'Ongkir Box Oksigen',
            ])->values()->toArray(),
        ];

        try {
            $response = Http::withoutVerifying()
                ->withBasicAuth($serverKey, '')
                ->acceptJson()
                ->post($baseUrl, $payload);

            if ($response->successful()) {
                $token = $response->json('token');
                $order->update(['snap_token' => $token]);

                return response()->json([
                    'snap_token' => $token,
                    'client_key' => $clientKey,
                    'is_production' => $isProduction,
                ]);
            }

            return response()->json([
                'message' => 'Gagal membuat sesi transaksi Midtrans: '.($response->json('error_messages.0') ?? $response->body()),
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Koneksi ke Midtrans gagal: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Callback dari frontend saat Snap popup selesai bayar.
     */
    public function finish(Request $request, string $orderNumber): RedirectResponse
    {
        $order = Order::where('order_number', $orderNumber)
            ->where('buyer_id', $request->user()->id)
            ->firstOrFail();

        $result = $request->input('result');
        $transactionStatus = $result['transaction_status'] ?? null;
        $paymentType = $result['payment_type'] ?? 'midtrans';

        if (in_array($transactionStatus, ['settlement', 'capture', 'success'])) {
            $order->update([
                'payment_status' => 'verified',
                'status' => 'processing',
                'payment_notes' => 'Lunas via Midtrans ('.$paymentType.')',
            ]);

            return back()->with('success', 'Pembayaran berhasil dikonfirmasi! Pesanan Anda segera diproses oleh penangkar.');
        }

        if ($transactionStatus === 'pending') {
            $order->update([
                'payment_status' => 'paid',
                'status' => 'awaiting_confirmation',
                'payment_notes' => 'Menunggu verifikasi settlement Midtrans ('.$paymentType.')',
            ]);

            return back()->with('success', 'Transaksi diterima dan menunggu pembayaran/settlement.');
        }

        return back()->with('info', 'Status transaksi: '.($transactionStatus ?? 'Menunggu penyelesaian.'));
    }

    /**
     * Cek status pembayaran langsung ke Midtrans API (solusi praktis saat dev localhost tanpa ngrok).
     */
    public function checkStatus(Request $request, string $orderNumber): RedirectResponse
    {
        $order = Order::where('order_number', $orderNumber)
            ->where('buyer_id', $request->user()->id)
            ->firstOrFail();

        $serverKey = config('services.midtrans.server_key');
        $isProduction = (bool) config('services.midtrans.is_production');

        $baseUrl = $isProduction
            ? 'https://api.midtrans.com/v2/'
            : 'https://api.sandbox.midtrans.com/v2/';

        $response = Http::withoutVerifying()
            ->withBasicAuth($serverKey, '')
            ->acceptJson()
            ->get($baseUrl.$order->order_number.'/status');

        if ($response->successful()) {
            $status = $response->json('transaction_status');
            $fraud = $response->json('fraud_status');
            $paymentType = $response->json('payment_type');

            if ($status === 'settlement' || ($status === 'capture' && $fraud === 'accept')) {
                $order->update([
                    'payment_status' => 'verified',
                    'status' => 'processing',
                    'payment_notes' => 'Lunas via Midtrans ('.$paymentType.')',
                ]);

                return back()->with('success', 'Pembayaran berhasil terverifikasi LUNAS oleh Midtrans!');
            }

            if ($status === 'pending') {
                return back()->with('info', 'Status transaksi di Midtrans: PENDING (Menunggu Pembeli Menyelesaikan Pembayaran).');
            }

            if (in_array($status, ['cancel', 'deny', 'expire'])) {
                $order->update([
                    'payment_status' => 'unpaid',
                    'status' => 'cancelled',
                    'payment_notes' => 'Transaksi dibatalkan Midtrans: '.$status,
                ]);

                return back()->with('error', 'Transaksi telah kadaluarsa atau dibatalkan oleh Midtrans.');
            }
        }

        return back()->with('info', 'Status saat ini belum lunas di Midtrans. Silakan selesaikan pembayaran terlebih dahulu.');
    }

    /**
     * Webhook notifikasi real-time dari Midtrans.
     */
    public function notification(Request $request): JsonResponse
    {
        $serverKey = config('services.midtrans.server_key');
        $orderId = (string) $request->input('order_id');
        $statusCode = (string) $request->input('status_code');
        $grossAmount = (string) $request->input('gross_amount');
        $signature = (string) $request->input('signature_key');

        $expectedSignature = hash('sha512', $orderId.$statusCode.$grossAmount.$serverKey);

        if ($signature !== $expectedSignature) {
            return response()->json(['message' => 'Invalid signature key'], 403);
        }

        $order = Order::where('order_number', $orderId)->first();
        if (! $order) {
            return response()->json(['message' => 'Pesanan tidak ditemukan'], 404);
        }

        $transactionStatus = $request->input('transaction_status');
        $fraudStatus = $request->input('fraud_status');
        $paymentType = $request->input('payment_type') ?? 'midtrans';

        if ($transactionStatus === 'settlement' || ($transactionStatus === 'capture' && $fraudStatus === 'accept')) {
            $order->update([
                'payment_status' => 'verified',
                'status' => 'processing',
                'payment_notes' => 'Lunas via Midtrans Webhook ('.$paymentType.')',
            ]);
        } elseif (in_array($transactionStatus, ['cancel', 'deny', 'expire'])) {
            $order->update([
                'payment_status' => 'unpaid',
                'status' => 'cancelled',
                'payment_notes' => 'Dibatalkan Midtrans Webhook: '.$transactionStatus,
            ]);
        }

        return response()->json(['status' => 'OK']);
    }
}
