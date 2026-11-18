<?php

use App\Http\Controllers\SitemapController;
use App\Http\Middleware\EnsureUserHasRole;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SecurityHeaders;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

$app = Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function (): void {
            // Serve public crawler files statelessly so CDN edges can cache them without session cookies.
            Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');
            Route::get('/robots.txt', [SitemapController::class, 'robots'])->name('robots');
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');

        $middleware->statefulApi();

        // Apply SecurityHeaders globally so Filament (/admin/*, /admin/login) and API routes are also hardened
        $middleware->append(SecurityHeaders::class);

        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => EnsureUserHasRole::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'midtrans/notification',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
            $status = $response->getStatusCode();

            if (
                ! $request->is('api/*', 'sanctum/*', 'midtrans/*', 'storage/*', 'images/*')
                && ! $request->expectsJson()
                && in_array($status, [404, 403], true)
            ) {
                return Inertia::render('Errors/HttpError', [
                    'status' => $status,
                ])
                    ->toResponse($request)
                    ->setStatusCode($status);
            }

            return $response;
        });
    })->create();

if (isset($_ENV['VERCEL']) || isset($_SERVER['VERCEL']) || getenv('VERCEL')) {
    $vercelStoragePath = '/tmp/storage';
    foreach ([
        $vercelStoragePath.'/app/public',
        $vercelStoragePath.'/app/private',
        $vercelStoragePath.'/framework/cache/data',
        $vercelStoragePath.'/framework/sessions',
        $vercelStoragePath.'/framework/testing',
        $vercelStoragePath.'/framework/views',
        $vercelStoragePath.'/logs',
    ] as $directory) {
        if (! is_dir($directory)) {
            @mkdir($directory, 0755, true);
        }
    }

    $app->useStoragePath($vercelStoragePath);
}

return $app;
