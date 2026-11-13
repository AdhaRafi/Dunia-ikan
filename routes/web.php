<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\GuideController as AdminGuideController;
use App\Http\Controllers\Admin\TransactionController as AdminTransactionController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\GuideController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Seller\OrderController as SellerOrderController;
use App\Http\Controllers\Seller\ProductController as SellerProductController;
use App\Http\Controllers\Seller\StoreProfileController as SellerStoreProfileController;
use App\Http\Controllers\StoreController;
use Illuminate\Http\Request;
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

// Chatbot Asisten Dunia Ikan
Route::get('/chatbot/history', [ChatbotController::class, 'getHistory'])->name('chatbot.history');
Route::post('/chatbot/message', [ChatbotController::class, 'sendMessage'])->name('chatbot.message');

/*
|--------------------------------------------------------------------------
| Authenticated User Routes (Buyer, Seller, Admin)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function (Request $request) {
        $user = $request->user();
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }
        if ($user->isSeller()) {
            return redirect()->route('seller.products.index');
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

    // Addresses
    Route::get('/addresses', [AddressController::class, 'index'])->name('addresses.index');
    Route::post('/addresses', [AddressController::class, 'store'])->name('addresses.store');
    Route::put('/addresses/{address}', [AddressController::class, 'update'])->name('addresses.update');
    Route::delete('/addresses/{address}', [AddressController::class, 'destroy'])->name('addresses.destroy');
    Route::post('/addresses/{address}/primary', [AddressController::class, 'setPrimary'])->name('addresses.set-primary');

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
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

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

    Route::get('/transactions', [AdminTransactionController::class, 'index'])->name('transactions.index');
});

require __DIR__.'/auth.php';
