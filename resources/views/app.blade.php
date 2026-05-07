<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
    <title>Sekolah Kemurnian</title>
    <meta name="description" content="Sekolah Kemurnian, berdiri sejak 1978 di Jakarta Barat..." inertia>
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="Sekolah Kemurnian">
    <meta property="og:description" content="Sekolah Kemurnian, berdiri sejak 1978 di Jakarta Barat...">
    <meta property="og:image" content="{{ asset('assets/og-banner.png') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&family=Raleway:wght@400;600;700;800&display=swap"
        rel="stylesheet">
    @viteReactRefresh
    @vite(['resources/js/app.tsx', 'resources/css/app.css'])
    @inertiaHead
</head>

<body>
    @inertia
</body>

</html>
