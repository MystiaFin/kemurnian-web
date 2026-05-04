<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <title>Sekolah Kemurnian</title>
    <meta name="description" content="Sekolah Kemurnian, berdiri sejak 1978 di Jakarta Barat..." inertia>
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="Sekolah Kemurnian">
    <meta property="og:description" content="Sekolah Kemurnian, berdiri sejak 1978 di Jakarta Barat...">
    <meta property="og:image" content="{{ asset('og-banner.jpg') }}">
    @viteReactRefresh
    @vite(['resources/js/app.tsx', 'resources/css/app.css'])
    @inertiaHead
</head>

<body>
    @inertia
</body>

</html>
