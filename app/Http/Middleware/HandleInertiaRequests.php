<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\User;
use App\Services\TurnstileVerifier;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        if ($user) {
            $user->loadMissing('store');
            $user->store?->makeVisible([
                'bank_name',
                'bank_account_number',
                'bank_account_name',
                'qris_image',
                'address',
            ]);
        }

        $cartCount = 0;
        if ($user) {
            $cartCount = $user->cartItems()->sum('quantity');
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'canUseDemoAccounts' => ! app()->isProduction() || (bool) config('app.demo_mode', false),
            'turnstileSiteKey' => fn () => app(TurnstileVerifier::class)->isEnabled()
                ? app(TurnstileVerifier::class)->siteKey()
                : null,
            'pendingSellerCount' => fn () => $user?->isAdmin()
                ? User::where('seller_status', 'pending')->count()
                : 0,
            'cartCount' => $cartCount,
            'navCategories' => fn () => Category::select('id', 'name', 'slug')->get(),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
