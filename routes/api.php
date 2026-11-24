<?php

use App\Http\Controllers\Api\SystemController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\FavoriteController;
use App\Http\Controllers\Api\V1\GuideController;
use App\Http\Controllers\Api\V1\HomeController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\StoreController;
use App\Http\Controllers\ChatbotController;
use Illuminate\Support\Facades\Route;

Route::get('/health', [SystemController::class, 'health']);

Route::middleware('auth:sanctum')->get('/user', [SystemController::class, 'user']);

Route::prefix('v1')->name('api.v1.')->group(function (): void {
    // Authentication (Sanctum Personal Access Tokens)
    Route::prefix('auth')->name('auth.')->group(function (): void {
        Route::post('/register', [AuthController::class, 'register'])
            ->middleware('throttle:10,1')
            ->name('register');
        Route::post('/login', [AuthController::class, 'login'])
            ->middleware('throttle:10,1')
            ->name('login');

        Route::middleware('auth:sanctum')->group(function (): void {
            Route::get('/me', [AuthController::class, 'me'])->name('me');
            Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
        });
    });

    // Public Storefront & Guides
    Route::get('/home', [HomeController::class, 'index'])->name('home');
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/{slug}', [ProductController::class, 'show'])->name('products.show');
    Route::get('/stores/{slug}', [StoreController::class, 'show'])->name('stores.show');
    Route::get('/guides', [GuideController::class, 'index'])->name('guides.index');
    Route::get('/guides/{id}', [GuideController::class, 'show'])
        ->whereNumber('id')
        ->name('guides.show');

    // Chatbot Asisten Kiko (guest token or Sanctum bearer user)
    Route::prefix('chatbot')->name('chatbot.')->group(function (): void {
        Route::get('/sessions', [ChatbotController::class, 'listSessions'])
            ->middleware('throttle:60,1')
            ->name('sessions');
        Route::delete('/sessions/{sessionToken}', [ChatbotController::class, 'deleteSession'])
            ->where('sessionToken', '[A-Za-z0-9_-]{16,100}')
            ->middleware('throttle:30,1')
            ->name('sessions.destroy');
        Route::get('/history', [ChatbotController::class, 'getHistory'])
            ->middleware('throttle:60,1')
            ->name('history');
        Route::post('/message', [ChatbotController::class, 'sendMessage'])
            ->middleware('throttle:20,1')
            ->name('message');
        Route::post('/new', [ChatbotController::class, 'newSession'])
            ->middleware('throttle:20,1')
            ->name('new');
    });

    // Authenticated Buyer Favorites
    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites.index');
        Route::post('/favorites/toggle', [FavoriteController::class, 'toggle'])
            ->middleware('throttle:60,1')
            ->name('favorites.toggle');
    });
});
