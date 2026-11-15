<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
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

        if ($order->status === 'cancelled') {
            return response()->json([
                'message' => 'Pesanan ini telah dibatalkan.',
            ], 400);
        }

        if ($order->payment_status === 'verified') {
            return response()->json([
                'message' => 'Pesanan ini sudah lunas diverifikasi.',
            ], 400);
        }

        $serverKey = config('services.midtrans.server_key');
        $clientKey = config('services.midtrans.client_key');
        $isProduction = (bool) config('services.midtrans.is_production');

        if (empty($serverKey) || empty($clientKey)) {
            return response()->json([
                'message' => 'Pembayaran otomatis Midtrans belum aktif: MIDTRANS_SERVER_KEY dan MIDTRANS_CLIENT_KEY belum dikonfigurasi di server.',
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
            // Force IPv4 in containerized runtimes to avoid IPv6 egress stalls.
            $response = Http::withOptions(['force_ip_resolve' => 'v4'])
                ->connectTimeout(5)
                ->timeout(15)
                ->withBasicAuth($serverKey, '')
                ->acceptJson()
                ->post($baseUrl, $payload);

            if ($response->successful()) {
                $token = $response->json('token');
                if (empty($token)) {
                    Log::warning('Midtrans Snap API returned empty token', [
                        'order_number' => $order->order_number,
                    ]);

                    return response()->json([
                        'message' => 'Token transaksi Midtrans tidak tersedia. Silakan coba lagi.',
                    ], 422);
                }

                $order->update(['snap_token' => $token]);

                return response()->json([
                    'snap_token' => $token,
                    'client_key' => $clientKey,
                    'is_production' => $isProduction,
                ]);
            }

            Log::warning('Midtrans Snap API error', [
                'order_number' => $order->order_number,
                'status' => $response->status(),
                'errors' => $response->json('error_messages'),
            ]);

            if ($response->status() === 401) {
                return response()->json([
                    'message' => 'Kunci Midtrans tidak valid atau tidak sesuai dengan mode Sandbox/Production.',
                ], 422);
            }

            return response()->json([
                'message' => 'Gagal membuat sesi transaksi Midtrans. Silakan coba lagi.',
            ], 422);
        } catch (\Throwable $e) {
            Log::error('Midtrans Snap API connection failed', [
                'order_number' => $order->order_number,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Koneksi ke layanan pembayaran gagal. Silakan coba lagi.',
            ], 500);
        }
    }

    /**
     * Callback dari frontend saat Snap popup selesai bayar.
     * Status pembayaran tetap diverifikasi ulang ke API Midtrans di sisi server.
     */
    public function finish(Request $request, string $orderNumber): RedirectResponse
    {
        $order = Order::where('order_number', $orderNumber)
            ->where('buyer_id', $request->user()->id)
            ->firstOrFail();

        $sync = $this->syncOrderStatusFromMidtrans($order);

        return back()->with($sync['flash'], $sync['message']);
    }

    /**
     * Cek status pembayaran langsung ke Midtrans API.
     */
    public function checkStatus(Request $request, string $orderNumber): RedirectResponse
    {
        $order = Order::where('order_number', $orderNumber)
            ->where('buyer_id', $request->user()->id)
            ->firstOrFail();

        $sync = $this->syncOrderStatusFromMidtrans($order);

        return back()->with($sync['flash'], $sync['message']);
    }

    /**
     * Webhook notifikasi real-time dari Midtrans.
     */
    public function notification(Request $request): JsonResponse
    {
        $serverKey = (string) config('services.midtrans.server_key');
        $orderId = (string) $request->input('order_id');
        $statusCode = (string) $request->input('status_code');
        $grossAmount = (string) $request->input('gross_amount');
        $signature = (string) $request->input('signature_key');

        $expectedSignature = hash('sha512', $orderId.$statusCode.$grossAmount.$serverKey);

        if ($serverKey === '' || ! hash_equals($expectedSignature, $signature)) {
            return response()->json(['message' => 'Invalid signature key'], 403);
        }

        $order = Order::where('order_number', $orderId)->first();
        if (! $order) {
            return response()->json(['message' => 'Pesanan tidak ditemukan'], 404);
        }

        $transactionStatus = $request->input('transaction_status');
        $fraudStatus = $request->input('fraud_status');
        $paymentType = (string) ($request->input('payment_type') ?? 'midtrans');

        if ($transactionStatus === 'settlement' || ($transactionStatus === 'capture' && $fraudStatus === 'accept')) {
            $order->update([
                'payment_status' => 'verified',
                'status' => in_array($order->status, ['shipped', 'delivered'], true) ? $order->status : 'processing',
                'payment_notes' => 'Lunas via Midtrans Webhook ('.$paymentType.')',
            ]);
        } elseif (in_array($transactionStatus, ['cancel', 'deny', 'expire'], true) && $order->payment_status !== 'verified') {
            $order->update([
                'payment_status' => 'unpaid',
                'status' => 'cancelled',
                'payment_notes' => 'Dibatalkan Midtrans Webhook: '.$transactionStatus,
            ]);
        }

        return response()->json(['status' => 'OK']);
    }

    /**
     * @return array{flash: string, message: string}
     */
    private function syncOrderStatusFromMidtrans(Order $order): array
    {
        if ($order->payment_status === 'verified') {
            return [
                'flash' => 'success',
                'message' => 'Pembayaran pesanan ini sudah terverifikasi lunas.',
            ];
        }

        $serverKey = (string) config('services.midtrans.server_key');
        if ($serverKey === '') {
            return [
                'flash' => 'info',
                'message' => 'Transaksi dicatat. Menunggu konfirmasi pembayaran dari server Midtrans.',
            ];
        }

        $isProduction = (bool) config('services.midtrans.is_production');
        $baseUrl = $isProduction
            ? 'https://api.midtrans.com/v2/'
            : 'https://api.sandbox.midtrans.com/v2/';

        try {
            $response = Http::withOptions(['force_ip_resolve' => 'v4'])
                ->connectTimeout(5)
                ->timeout(15)
                ->withBasicAuth($serverKey, '')
                ->acceptJson()
                ->get($baseUrl.$order->order_number.'/status');
        } catch (\Throwable $e) {
            Log::warning('Midtrans status check failed', [
                'order_number' => $order->order_number,
                'error' => $e->getMessage(),
            ]);

            return [
                'flash' => 'info',
                'message' => 'Status pembayaran sedang diperiksa. Silakan muat ulang sebentar lagi.',
            ];
        }

        if ($response->successful()) {
            $status = $response->json('transaction_status');
            $fraud = $response->json('fraud_status');
            $paymentType = (string) ($response->json('payment_type') ?? 'midtrans');

            if ($status === 'settlement' || ($status === 'capture' && $fraud === 'accept')) {
                $order->update([
                    'payment_status' => 'verified',
                    'status' => in_array($order->status, ['shipped', 'delivered'], true) ? $order->status : 'processing',
                    'payment_notes' => 'Lunas via Midtrans ('.$paymentType.')',
                ]);

                return [
                    'flash' => 'success',
                    'message' => 'Pembayaran berhasil terverifikasi lunas oleh Midtrans!',
                ];
            }

            if ($status === 'pending') {
                return [
                    'flash' => 'info',
                    'message' => 'Transaksi diterima dan menunggu penyelesaian pembayaran di Midtrans.',
                ];
            }

            if (in_array($status, ['cancel', 'deny', 'expire'], true) && $order->payment_status !== 'verified') {
                $order->update([
                    'payment_status' => 'unpaid',
                    'status' => 'cancelled',
                    'payment_notes' => 'Transaksi dibatalkan Midtrans: '.$status,
                ]);

                return [
                    'flash' => 'error',
                    'message' => 'Transaksi telah kadaluarsa atau dibatalkan oleh Midtrans.',
                ];
            }
        }

        return [
            'flash' => 'info',
            'message' => 'Status saat ini belum lunas di Midtrans. Silakan selesaikan pembayaran terlebih dahulu.',
        ];
    }
}
