<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        $cartItems = CartItem::with(['product.store', 'product.category', 'product.fishDetail'])
            ->where('user_id', $user->id)
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Keranjang belanja Anda kosong.');
        }

        $addresses = Address::where('user_id', $user->id)
            ->orderBy('is_primary', 'desc')
            ->get();

        // Kelompokkan per toko
        $groupedCart = $cartItems->groupBy(fn ($item) => $item->product->store_id)
            ->map(function ($items) {
                $store = $items->first()->product->store;
                $storeTotal = $items->sum(fn ($item) => $item->quantity * $item->product->price);
                // Biaya pengiriman ikan hias standar antar kota (bisa flat per toko)
                $shippingCost = 20000;

                return [
                    'store' => $store,
                    'items' => $items,
                    'storeTotal' => $storeTotal,
                    'shippingCost' => $shippingCost,
                    'subtotalWithShipping' => $storeTotal + $shippingCost,
                ];
            })->values();

        $totalProducts = $cartItems->sum(fn ($item) => $item->quantity * $item->product->price);
        $totalShipping = $groupedCart->sum('shippingCost');
        $grandTotal = $totalProducts + $totalShipping;

        return Inertia::render('Checkout/Index', [
            'groupedCart' => $groupedCart,
            'addresses' => $addresses,
            'totalProducts' => $totalProducts,
            'totalShipping' => $totalShipping,
            'grandTotal' => $grandTotal,
        ]);
    }

    public function process(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'payment_method' => 'required|in:bank_transfer,qris,cod,midtrans',
            'shipping_notes' => 'nullable|string|max:500',
        ]);

        $address = Address::where('id', $validated['address_id'])
            ->where('user_id', $user->id)
            ->firstOrFail();

        $cartItems = CartItem::with('product.store')
            ->where('user_id', $user->id)
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Keranjang belanja Anda kosong.');
        }

        $createdOrders = [];
        $isCod = $validated['payment_method'] === 'cod';

        try {
            DB::transaction(function () use ($cartItems, $user, $address, $validated, $isCod, &$createdOrders) {
                // Kelompokkan item per toko (karena setiap toko adalah pesanan terpisah)
                $grouped = $cartItems->groupBy(fn ($item) => $item->product->store_id);

                foreach ($grouped as $storeId => $items) {
                    $store = $items->first()->product->store;
                    if (! $store || ! $store->is_active) {
                        throw new \DomainException('Salah satu toko dalam keranjang Anda sedang tidak aktif.');
                    }

                    $storeTotal = 0;

                    // Validasi dan kurangi stok untuk setiap item dengan locking
                    foreach ($items as $item) {
                        $product = Product::where('id', $item->product_id)
                            ->lockForUpdate()
                            ->first();

                        if (! $product || ! $product->is_active) {
                            throw new \DomainException("Produk '{$item->product->name}' sudah tidak aktif atau tidak ditemukan.");
                        }

                        if ($product->stock < $item->quantity) {
                            throw new \DomainException("Stok untuk '{$product->name}' tidak mencukupi. Tersedia: {$product->stock}, diminta: {$item->quantity}.");
                        }

                        $storeTotal += ($item->quantity * $product->price);
                    }

                    $shippingCost = 20000; // Flat standar ongkir ikan aman beroksigen per toko
                    $grandTotal = $storeTotal + $shippingCost;

                    $orderNumber = 'DI-'.date('Ymd').'-'.strtoupper(Str::random(5));

                    $order = Order::create([
                        'order_number' => $orderNumber,
                        'buyer_id' => $user->id,
                        'store_id' => $storeId,
                        'status' => $isCod ? 'processing' : 'pending_payment',
                        'payment_method' => $validated['payment_method'],
                        'payment_status' => 'unpaid',
                        'total_product_amount' => $storeTotal,
                        'shipping_cost' => $shippingCost,
                        'grand_total' => $grandTotal,
                        'shipping_recipient_name' => $address->recipient_name,
                        'shipping_phone' => $address->phone,
                        'shipping_city' => $address->city,
                        'shipping_address' => $address->full_address.', '.$address->city.', '.$address->province.' '.$address->postal_code,
                        'shipping_notes' => $validated['shipping_notes'] ?? null,
                    ]);

                    foreach ($items as $item) {
                        $product = Product::find($item->product_id);
                        $product->decrement('stock', $item->quantity);

                        OrderItem::create([
                            'order_id' => $order->id,
                            'product_id' => $product->id,
                            'product_name' => $product->name,
                            'price' => $product->price,
                            'quantity' => $item->quantity,
                            'subtotal' => $product->price * $item->quantity,
                        ]);
                    }

                    $createdOrders[] = $order;
                }

                // Hapus keranjang setelah checkout sukses
                CartItem::where('user_id', $user->id)->delete();
            });
        } catch (\DomainException $e) {
            return back()->with('error', 'Checkout gagal: '.$e->getMessage());
        } catch (\Throwable $e) {
            report($e);

            return back()->with('error', 'Checkout gagal diproses. Silakan coba beberapa saat lagi.');
        }

        if (count($createdOrders) === 1) {
            return redirect()->route('orders.show', $createdOrders[0]->order_number)
                ->with(
                    'success',
                    $isCod
                        ? 'Pesanan COD berhasil dibuat! Toko akan segera memproses dan mengirimkan pesanan Anda.'
                        : 'Pesanan berhasil dibuat! Silakan selesaikan pembayaran.'
                );
        }

        return redirect()->route('orders.index')
            ->with(
                'success',
                $isCod
                    ? count($createdOrders).' pesanan COD berhasil dibuat dan langsung diproses masing-masing toko.'
                    : count($createdOrders).' pesanan berhasil dibuat untuk masing-masing toko.'
            );
    }
}
