<?php

namespace App\Http\Middleware;

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
            'turnstileSiteKey' => fn () => app(TurnstileVerifier::class)->isEnabled()
                ? app(TurnstileVerifier::class)->siteKey()
                : null,
            'pendingSellerCount' => fn () => $user?->isAdmin()
                ? User::where('seller_status', 'pending')->count()
                : 0,
            'cartCount' => $cartCount,
            'visitorStats' => fn () => $this->recordAndGetVisitorStats($request),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }

    /**
     * Record unique daily visits and return live visitor counters using batched cache reads.
     *
     * @return array{today: int, month: int, year: int}
     */
    private function recordAndGetVisitorStats(Request $request): array
    {
        $now = now()->timezone('Asia/Jakarta');
        $todayStamp = $now->format('Y-m-d');
        $keys = [
            'today' => ['visitors:day:'.$todayStamp, $now->copy()->addDays(2)],
            'month' => ['visitors:month:'.$now->format('Y-m'), $now->copy()->addDays(45)],
            'year' => ['visitors:year:'.$now->format('Y'), $now->copy()->addDays(400)],
        ];

        $userAgent = (string) $request->userAgent();
        $isBot = preg_match(
            '/bot|crawl|spider|slurp|bingpreview|lighthouse|curl|wget|python|httpie|postman|headless|axios|libwww|go-http-client/i',
            $userAgent
        ) === 1;
        $shouldCount = $request->isMethod('GET')
            && $request->hasSession()
            && ! $isBot
            && ! $request->headers->has('X-Inertia-Partial-Data')
            && ! $request->is('api/*', 'up', 'sitemap.xml', 'robots.txt', 'chatbot/*');

        $counterKeys = [
            $keys['today'][0],
            $keys['month'][0],
            $keys['year'][0],
        ];

        if (! $shouldCount || $request->session()->get('visitor_counted_date') === $todayStamp) {
            $cached = Cache::many($counterKeys);

            return [
                'today' => (int) ($cached[$keys['today'][0]] ?? 0),
                'month' => (int) ($cached[$keys['month'][0]] ?? 0),
                'year' => (int) ($cached[$keys['year'][0]] ?? 0),
            ];
        }

        $request->session()->put('visitor_counted_date', $todayStamp);

        $appKey = (string) config('app.key');
        $ip = (string) ($request->ip() ?: 'unknown');
        $ipHash = hash_hmac('sha256', $ip, $appKey);
        $deviceHash = hash_hmac('sha256', $ip.'|'.strtolower(substr($userAgent, 0, 120)), $appKey);
        $seenKey = "visitors:seen:{$todayStamp}:{$deviceHash}";
        $ipBucketKey = "visitors:ip:{$todayStamp}:{$ipHash}";

        $prefetched = Cache::many([...$counterKeys, $seenKey, $ipBucketKey]);
        $counts = [
            'today' => (int) ($prefetched[$keys['today'][0]] ?? 0),
            'month' => (int) ($prefetched[$keys['month'][0]] ?? 0),
            'year' => (int) ($prefetched[$keys['year'][0]] ?? 0),
        ];

        if ($prefetched[$seenKey] !== null) {
            return $counts;
        }

        $slotExpiresAt = $now->copy()->addDays(2);
        if (! Cache::add($seenKey, 1, $slotExpiresAt)) {
            return $counts;
        }

        if ($prefetched[$ipBucketKey] === null) {
            Cache::add($ipBucketKey, 0, $slotExpiresAt);
        }

        $ipVisits = Cache::increment($ipBucketKey);
        if ($ipVisits === false) {
            Cache::put($ipBucketKey, 1, $slotExpiresAt);
            $ipVisits = 1;
        }

        if ($ipVisits > 10) {
            return $counts;
        }

        foreach ($keys as $bucket => [$key, $expiresAt]) {
            if ($prefetched[$key] === null) {
                Cache::add($key, 0, $expiresAt);
            }

            $nextValue = Cache::increment($key);
            if ($nextValue === false) {
                Cache::put($key, 1, $expiresAt);
                $counts[$bucket] = 1;
            } else {
                $counts[$bucket] = (int) $nextValue;
            }
        }

        return $counts;
    }
}
