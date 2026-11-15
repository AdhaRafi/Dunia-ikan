<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\User;
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
