<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-white dark:bg-[#070b14]">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="theme-color" content="#0d2e92">

        @php
            $seo = \App\Support\SeoMetadata::fromInertiaPage($page ?? [], request());
        @endphp

        <title inertia>{{ $seo['title'] }}</title>
        <meta inertia name="description" head-key="description" content="{{ $seo['description'] }}">
        <meta name="robots" content="{{ $seo['robots'] }}">
        @if ($seo['googleSiteVerification'] !== null)
            <meta name="google-site-verification" content="{{ $seo['googleSiteVerification'] }}">
        @endif
        <link rel="canonical" href="{{ $seo['canonical'] }}">

        <meta property="og:site_name" content="{{ config('app.name', 'Dunia Ikan') }}">
        <meta property="og:locale" content="id_ID">
        <meta property="og:type" content="{{ $seo['ogType'] }}">
        <meta property="og:title" content="{{ $seo['title'] }}">
        <meta property="og:description" content="{{ $seo['description'] }}">
        <meta property="og:url" content="{{ $seo['canonical'] }}">
        <meta property="og:image" content="{{ $seo['image'] }}">
        <meta property="og:image:alt" content="{{ $seo['title'] }}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $seo['title'] }}">
        <meta name="twitter:description" content="{{ $seo['description'] }}">
        <meta name="twitter:image" content="{{ $seo['image'] }}">

        @foreach ($seo['schemas'] as $schema)
            <script type="application/ld+json">{!! json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP) !!}</script>
        @endforeach

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
        @if(auth('admin')->user()?->isAdmin() || auth('web')->user()?->isAdmin())
            @routes(['public', 'admin'])
        @else
            @routes('public')
        @endif
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
        <noscript>
            <main style="max-width: 720px; margin: 2rem auto; padding: 1rem; font-family: sans-serif;">
                <h1>{{ $seo['title'] }}</h1>
                <p>{{ $seo['description'] }}</p>
                <nav aria-label="Navigasi utama">
                    <a href="{{ url('/') }}">Beranda</a> ·
                    <a href="{{ url('/products') }}">Katalog Ikan</a> ·
                    <a href="{{ url('/guides') }}">Panduan Ikan</a>
                </nav>
            </main>
        </noscript>
    </body>
</html>
