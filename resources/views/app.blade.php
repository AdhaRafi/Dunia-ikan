<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-white dark:bg-[#070b14]">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="theme-color" content="#0d2e92">

        @php
            $seoTitle = config('app.name', 'Dunia Ikan');
            $seoDescription = 'Marketplace ikan hias captive-bred, mutasi morph, perlengkapan akuarium terkurasi, dan asisten perawatan ikan Kiko di seluruh Indonesia.';
            $seoImage = asset('images/hero/aquarium-poster.webp');

            $props = $page['props'] ?? [];
            if (! empty($props['product']['name'])) {
                $seoTitle = $props['product']['name'].' — Dunia Ikan';
                $seoDescription = \Illuminate\Support\Str::limit(strip_tags((string) ($props['product']['description'] ?? $seoDescription)), 155);
                if (! empty($props['product']['image'])) {
                    $seoImage = str_starts_with($props['product']['image'], 'http')
                        ? $props['product']['image']
                        : url($props['product']['image']);
                }
            } elseif (! empty($props['store']['name'])) {
                $seoTitle = $props['store']['name'].' — Toko Penangkar Dunia Ikan';
                $seoDescription = \Illuminate\Support\Str::limit(strip_tags((string) ($props['store']['description'] ?? $seoDescription)), 155);
                if (! empty($props['store']['logo_url'])) {
                    $seoImage = str_starts_with($props['store']['logo_url'], 'http')
                        ? $props['store']['logo_url']
                        : url($props['store']['logo_url']);
                }
            } elseif (! empty($props['guide']['title'])) {
                $seoTitle = $props['guide']['title'].' — Panduan Dunia Ikan';
                $seoDescription = \Illuminate\Support\Str::limit(strip_tags((string) ($props['guide']['symptoms'] ?? $props['guide']['care_instructions'] ?? $seoDescription)), 155);
            }
        @endphp

        <title inertia>{{ $seoTitle }}</title>
        <meta inertia name="description" head-key="description" content="{{ $seoDescription }}">
        <meta name="robots" content="{{ request()->is('admin*', 'seller*', 'cart*', 'checkout*', 'orders*', 'profile*', 'addresses*', 'dashboard*') ? 'noindex, nofollow' : 'index, follow' }}">
        <link rel="canonical" href="{{ url()->current() }}">

        <meta property="og:site_name" content="{{ config('app.name', 'Dunia Ikan') }}">
        <meta property="og:type" content="website">
        <meta property="og:title" content="{{ $seoTitle }}">
        <meta property="og:description" content="{{ $seoDescription }}">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:image" content="{{ $seoImage }}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $seoTitle }}">
        <meta name="twitter:description" content="{{ $seoDescription }}">
        <meta name="twitter:image" content="{{ $seoImage }}">

        <!-- Favicon -->
        <link rel="icon" type="image/png" sizes="64x64" href="{{ asset('favicon.png') }}?v=2">
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}?v=2">
        <link rel="apple-touch-icon" href="{{ asset('favicon.png') }}?v=2">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

        <!-- Theme Detection Script -->
        <script>
            (function() {
                try {
                    var theme = localStorage.getItem('theme');
                    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                        document.documentElement.classList.add('dark');
                        document.documentElement.style.colorScheme = 'dark';
                    } else {
                        document.documentElement.classList.remove('dark');
                        document.documentElement.style.colorScheme = 'light';
                    }
                } catch (e) {}
            })();
        </script>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
