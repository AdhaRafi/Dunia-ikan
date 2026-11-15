<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\GuideController as AdminGuideController;
use App\Http\Controllers\Admin\TransactionController as AdminTransactionController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Auth\AdminLogoutController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\GuideController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MidtransController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Seller\OrderController as SellerOrderController;
use App\Http\Controllers\Seller\ProductController as SellerProductController;
use App\Http\Controllers\Seller\StoreProfileController as SellerStoreProfileController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\StoreReviewController;
use App\Models\FishGuide;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{slug}', [ProductController::class, 'show'])->name('products.show');
Route::get('/stores/{slug}', [StoreController::class, 'show'])->name('stores.show');
Route::get('/guides', [GuideController::class, 'index'])->name('guides.index');
Route::get('/guides/{id}', [GuideController::class, 'show'])->name('guides.show');
Route::get('/sitemap.xml', function (): HttpResponse {
    $xml = Cache::remember('sitemap.xml', now()->addHour(), function (): string {
        $urls = [
            ['loc' => url('/'), 'priority' => '1.0', 'changefreq' => 'daily'],
            ['loc' => url('/products'), 'priority' => '0.9', 'changefreq' => 'daily'],
            ['loc' => url('/guides'), 'priority' => '0.8', 'changefreq' => 'weekly'],
        ];

        Product::where('is_active', true)
            ->whereHas('store', fn ($q) => $q->where('is_active', true))
            ->select(['slug', 'updated_at'])
            ->orderByDesc('updated_at')
            ->limit(500)
            ->each(function (Product $product) use (&$urls): void {
                $urls[] = [
                    'loc' => url('/products/'.$product->slug),
                    'lastmod' => $product->updated_at?->toAtomString(),
                    'priority' => '0.8',
                    'changefreq' => 'weekly',
                ];
            });

        Store::where('is_active', true)
            ->select(['slug', 'updated_at'])
            ->orderByDesc('updated_at')
            ->limit(200)
            ->each(function (Store $store) use (&$urls): void {
                $urls[] = [
                    'loc' => url('/stores/'.$store->slug),
                    'lastmod' => $store->updated_at?->toAtomString(),
                    'priority' => '0.7',
                    'changefreq' => 'weekly',
                ];
            });

        FishGuide::where('is_active', true)
            ->select(['id', 'updated_at'])
            ->orderByDesc('updated_at')
            ->limit(200)
            ->each(function (FishGuide $guide) use (&$urls): void {
                $urls[] = [
                    'loc' => url('/guides/'.$guide->id),
                    'lastmod' => $guide->updated_at?->toAtomString(),
                    'priority' => '0.7',
                    'changefreq' => 'monthly',
                ];
            });

        $lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
        foreach ($urls as $item) {
            $lines[] = '  <url>';
            $lines[] = '    <loc>'.e($item['loc']).'</loc>';
            if (! empty($item['lastmod'])) {
                $lines[] = '    <lastmod>'.e($item['lastmod']).'</lastmod>';
            }
            $lines[] = '    <changefreq>'.$item['changefreq'].'</changefreq>';
            $lines[] = '    <priority>'.$item['priority'].'</priority>';
            $lines[] = '  </url>';
        }
        $lines[] = '</urlset>';

        return implode("\n", $lines);
    });

    return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
})->name('sitemap');

// Chatbot Asisten Dunia Ikan
Route::get('/chatbot/history', [ChatbotController::class, 'getHistory'])
    ->middleware('throttle:60,1')
    ->name('chatbot.history');
Route::post('/chatbot/message', [ChatbotController::class, 'sendMessage'])
    ->middleware('throttle:20,1')
    ->name('chatbot.message');

// Midtrans Webhook Notification (Exempted from CSRF)
Route::post('/midtrans/notification', [MidtransController::class, 'notification'])->name('midtrans.notification');

/*
|--------------------------------------------------------------------------
| Authenticated User Routes (Buyer, Seller, Admin)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function (Request $request) {
        $user = $request->user();
        if ($user->isAdmin()) {
            return Inertia::location(url('/admin'));
        }
        if ($user->isSeller()) {
            return $user->store
                ? redirect()->route('seller.products.index')
                : redirect()->route('seller.store.create');
        }
        if ($user->isPendingSeller()) {
            return redirect()->route('seller.store.create');
        }

        return redirect()->route('orders.index');
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Cart
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::patch('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');

    // Checkout
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'process'])->name('checkout.process');

    // Orders (Buyer)
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{orderNumber}', [OrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{orderNumber}/proof', [OrderController::class, 'uploadPaymentProof'])->name('orders.upload-proof');
    Route::post('/orders/{orderNumber}/confirm', [OrderController::class, 'confirmDelivery'])->name('orders.confirm-delivery');

    // Midtrans Snap Actions (Buyer)
    Route::post('/orders/{orderNumber}/snap-token', [MidtransController::class, 'getSnapToken'])->name('orders.midtrans.token');
    Route::post('/orders/{orderNumber}/midtrans-finish', [MidtransController::class, 'finish'])->name('orders.midtrans.finish');
    Route::post('/orders/{orderNumber}/midtrans-status', [MidtransController::class, 'checkStatus'])->name('orders.midtrans.status');

    // Addresses
    Route::get('/addresses', [AddressController::class, 'index'])->name('addresses.index');
    Route::post('/addresses', [AddressController::class, 'store'])->name('addresses.store');
    Route::put('/addresses/{address}', [AddressController::class, 'update'])->name('addresses.update');
    Route::delete('/addresses/{address}', [AddressController::class, 'destroy'])->name('addresses.destroy');
    Route::post('/addresses/{address}/primary', [AddressController::class, 'setPrimary'])->name('addresses.set-primary');

    // Store Rating & Reviews
    Route::post('/stores/{slug}/reviews', [StoreReviewController::class, 'store'])->name('stores.reviews.store');

    // Seller Registration (Buka Toko)
    Route::get('/seller/register', [SellerStoreProfileController::class, 'create'])->name('seller.store.create');
    Route::post('/seller/register', [SellerStoreProfileController::class, 'registerStore'])->name('seller.store.register');
});

/*
|--------------------------------------------------------------------------
| Seller Routes (Isolated to Seller's Store)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:seller,admin'])->prefix('seller')->name('seller.')->group(function () {
    Route::get('/store', [SellerStoreProfileController::class, 'edit'])->name('store.edit');
    Route::post('/store', [SellerStoreProfileController::class, 'update'])->name('store.update');

    Route::resource('products', SellerProductController::class)->except(['show']);

    Route::get('/orders', [SellerOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{id}', [SellerOrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{id}/verify-payment', [SellerOrderController::class, 'verifyPayment'])->name('orders.verify-payment');
    Route::post('/orders/{id}/shipping', [SellerOrderController::class, 'updateShipping'])->name('orders.update-shipping');
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:admin,web', 'role:admin'])->prefix('admin-portal')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::post('/logout', AdminLogoutController::class)->name('logout');

    Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}', [AdminCategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');

    Route::get('/guides', [AdminGuideController::class, 'index'])->name('guides.index');
    Route::post('/guides', [AdminGuideController::class, 'store'])->name('guides.store');
    Route::put('/guides/{guide}', [AdminGuideController::class, 'update'])->name('guides.update');
    Route::post('/guides/{guide}/toggle', [AdminGuideController::class, 'toggleActive'])->name('guides.toggle');
    Route::delete('/guides/{guide}', [AdminGuideController::class, 'destroy'])->name('guides.destroy');

    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::post('/users/{user}/role', [AdminUserController::class, 'updateRole'])->name('users.update-role');
    Route::post('/users/{user}/approve-seller', [AdminUserController::class, 'approveSeller'])->name('users.approve-seller');
    Route::post('/users/{user}/reject-seller', [AdminUserController::class, 'rejectSeller'])->name('users.reject-seller');

    Route::get('/transactions', [AdminTransactionController::class, 'index'])->name('transactions.index');
});

require __DIR__.'/auth.php';
