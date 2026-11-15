<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\User;
use App\Services\TurnstileVerifier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
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
            'visitorStats' => fn () => $this->recordAndGetVisitorStats($request),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }

    /**
     * Record unique daily session visits and return live visitor counters.
     *
     * @return array{today: int, month: int, year: int}
     */
    private function recordAndGetVisitorStats(Request $request): array
    {
        $now = now()->timezone('Asia/Jakarta');
        $keys = [
            'today' => ['visitors:day:'.$now->format('Y-m-d'), $now->copy()->addDays(2)],
            'month' => ['visitors:month:'.$now->format('Y-m'), $now->copy()->addDays(45)],
            'year' => ['visitors:year:'.$now->format('Y'), $now->copy()->addDays(400)],
        ];

        $todayStamp = $now->format('Y-m-d');
        $isBot = preg_match('/bot|crawl|spider|slurp|bingpreview|lighthouse/i', (string) $request->userAgent()) === 1;
        $shouldCount = $request->isMethod('GET')
            && $request->hasSession()
            && ! $isBot
            && ! $request->headers->has('X-Inertia-Partial-Data')
            && ! $request->is('api/*', 'up', 'sitemap.xml', 'robots.txt', 'chatbot/*');

        if ($shouldCount && $request->session()->get('visitor_counted_date') !== $todayStamp) {
            foreach ($keys as [$key, $expiresAt]) {
                Cache::add($key, 0, $expiresAt);
                if (Cache::increment($key) === false) {
                    Cache::put($key, 1, $expiresAt);
                }
            }

            $request->session()->put('visitor_counted_date', $todayStamp);
        }

        return [
            'today' => (int) Cache::get($keys['today'][0], 0),
            'month' => (int) Cache::get($keys['month'][0], 0),
            'year' => (int) Cache::get($keys['year'][0], 0),
        ];
    }
}
