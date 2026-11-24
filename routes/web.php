<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\GlobalChatController;
use App\Http\Controllers\GuideController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\MidtransController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Seller\OrderController as SellerOrderController;
use App\Http\Controllers\Seller\ProductController as SellerProductController;
use App\Http\Controllers\Seller\StoreProfileController as SellerStoreProfileController;
use App\Http\Controllers\StoreChatController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\StoreReviewController;
use Illuminate\Support\Facades\Route;

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
Route::get('/community', [GlobalChatController::class, 'index'])->name('community.index');
Route::get('/community/messages', [GlobalChatController::class, 'messages'])
    ->middleware('throttle:120,1')
    ->name('community.messages');
Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites.index');
Route::get('/storage/{path}', [MediaController::class, 'show'])
    ->where('path', '^[a-zA-Z0-9_.\-/]+$')
    ->name('media.show');

// Chatbot Asisten Dunia Ikan
Route::get('/chatbot/sessions', [ChatbotController::class, 'listSessions'])
    ->middleware('throttle:60,1')
    ->name('chatbot.sessions');
Route::delete('/chatbot/sessions/{sessionToken}', [ChatbotController::class, 'deleteSession'])
    ->where('sessionToken', '[A-Za-z0-9_-]{16,100}')
    ->middleware('throttle:30,1')
    ->name('chatbot.sessions.destroy');
Route::get('/chatbot/history', [ChatbotController::class, 'getHistory'])
    ->middleware('throttle:60,1')
    ->name('chatbot.history');
Route::post('/chatbot/message', [ChatbotController::class, 'sendMessage'])
    ->middleware('throttle:20,1')
    ->name('chatbot.message');
Route::post('/chatbot/new', [ChatbotController::class, 'newSession'])
    ->middleware('throttle:20,1')
    ->name('chatbot.new');

// Midtrans Webhook Notification (Exempted from CSRF)
Route::post('/midtrans/notification', [MidtransController::class, 'notification'])->name('midtrans.notification');

/*
|--------------------------------------------------------------------------
| Authenticated User Routes (Buyer, Seller, Admin)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [HomeController::class, 'dashboard'])->name('dashboard');

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

    // Direct Store Chat (Buyer & Seller)
    Route::get('/chat', [StoreChatController::class, 'index'])->name('chat.index');
    Route::post('/stores/{slug}/chat', [StoreChatController::class, 'start'])
        ->middleware('throttle:30,1')
        ->name('stores.chat.start');
    Route::get('/chat/{conversation}/messages', [StoreChatController::class, 'messages'])
        ->middleware('throttle:120,1')
        ->name('chat.messages');
    Route::post('/chat/{conversation}/messages', [StoreChatController::class, 'storeMessage'])
        ->middleware('throttle:30,1')
        ->name('chat.messages.store');

    // Global Community Chat
    Route::post('/community/messages', [GlobalChatController::class, 'store'])
        ->middleware('throttle:20,1')
        ->name('community.store');
    Route::delete('/community/messages/{message}', [GlobalChatController::class, 'destroy'])
        ->name('community.destroy');

    // Favorites / Wishlist
    Route::post('/favorites/toggle', [FavoriteController::class, 'toggle'])
        ->middleware('throttle:60,1')
        ->name('favorites.toggle');

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
| Admin Routes (Unified into Filament /admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:admin,web', 'role:admin'])->group(function () {
    Route::get('/admin/transaction-reports/export', [AdminReportController::class, 'exportCsv'])
        ->name('filament.admin.reports.export');

    // Redirect legacy /admin-portal paths cleanly into the single Filament panel.
    Route::prefix('admin-portal')->name('admin.')->group(function () {
        Route::redirect('/', '/admin')->name('dashboard');
        Route::redirect('/categories', '/admin/categories')->name('categories.index');
        Route::redirect('/guides', '/admin/fish-guides')->name('guides.index');
        Route::redirect('/users', '/admin/users')->name('users.index');
        Route::redirect('/transactions', '/admin/orders')->name('transactions.index');
        Route::get('/reports', [AdminReportController::class, 'redirectToFilament'])->name('reports.index');
        Route::get('/reports/export', [AdminReportController::class, 'exportCsv'])->name('reports.export');
    });
});

require __DIR__.'/auth.php';
