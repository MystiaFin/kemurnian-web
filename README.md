# Kemurnian Web

Kemurnian Web is a Laravel 13 + Inertia React application for Sekolah Kemurnian. It includes a public site (guest pages) and an admin dashboard for managing content.

## Available Pages

Public:
- `/` Home (hero slider, schools info, about, curriculum, news, enrollment, contact)
- `/about`
- `/news`
- `/news/category/{slug}`
- `/news-detail/{id}`
- `/enrollment`
- `/kurikulum/{id}`
- `/unit/{detail}`
- `/{sekolah}` (sekolah-kemurnian-1/2/3)

Admin (requires login):
- `/admin` Dashboard
- `/admin/hero`
- `/admin/kurikulum`
- `/admin/news`
- `/admin/enrollment`
- `/admin/fasilitas`

Auth:
- `/login` (admin login)

## Project Structure

Key folders:
- `app/Http/Controllers/Admin` Admin CRUD controllers
- `app/Http/Controllers/Guest` Public site controller
- `app/Http/Controllers/Auth` Login controller
- `app/Http/Middleware` Admin guard
- `database/migrations` Schema and content tables
- `resources/js/Pages` Inertia pages
- `resources/js/Components` Shared UI components
- `resources/js/Layouts` Layout wrappers
- `resources/js/data` JSON data (schools)
- `resources/css` Tailwind and theme variables
- `routes/web.php` Public + admin routes
- `routes/auth.php` Login/logout routes

## How The App Works

High-level flow:
- `routes/web.php` maps URLs to controllers.
- Public routes use `Guest/SiteController` and render Inertia pages in `resources/js/Pages/Guest`.
- Admin routes are protected by `auth` + `admin` middleware and render pages in `resources/js/Pages/Admin`.
- Image uploads are stored in `public/uploads` and mapped to public URLs.
- Schools info for `/unit/{detail}` and `/{sekolah}` comes from `resources/js/data/schools.json`.

Data flow:
- Controllers fetch Eloquent models and normalize data (image URLs, dates).
- Inertia passes props to React pages.
- Pages render with `GuestLayout` or `AdminLayout` and shared components.

## Admin Accounts

Create admin users from the CLI:

```bash
php artisan admin:create "Admin Name" admin@example.com "StrongPass123"
```

## Development Guide

### Local Dev With Laravel Sail

1. Start containers:

```bash
./vendor/bin/sail up -d
```

2. Install dependencies and build assets:

```bash
./vendor/bin/sail composer install
./vendor/bin/sail npm install
./vendor/bin/sail npm run dev
```

3. Run migrations:

```bash
./vendor/bin/sail artisan migrate
```

### Local Dev With Nix

Assuming you already have PHP, Composer, Node, and pnpm/npm via Nix:

1. Install PHP dependencies:

```bash
composer install
```

2. Install JS dependencies:

```bash
pnpm install
# or: npm install
```

3. Run migrations and dev server:

```bash
php artisan migrate
pnpm dev
# or: npm run dev
```

### Production Notes

- Set `APP_ENV=production` and `APP_DEBUG=false` in `.env`.
- Point your web root to `public/` (or deploy `public/` into `public_html/`).
- Run `php artisan migrate --force` after deploy.
- Build assets with `pnpm build` or `npm run build` and deploy `public/build`.

## Environment Variables

Required in `.env`:
- `APP_URL` Base URL for the site (used for asset URLs and links)
- `APP_ENV` Set to `production` on the server
- `APP_DEBUG` Set to `false` on the server
- `DB_*` Database connection credentials
- `FILESYSTEM_DISK` Uses `public_html` on shared hosting (see [config/filesystems.php](config/filesystems.php))

## Static Assets

Static files are stored in `public/assets/` and synced to `public_html/assets/` during deploy.
Common paths:
- `/assets/nav_logo.webp`
- `/assets/sekolah/kemurnian_i.avif`

Uploads (admin content) are stored in `public/uploads/` and served from `/uploads/...`.

## Deployment (Hostinger Shared Hosting)

See [DEPLOY.md](DEPLOY.md) for the full runbook.

Quick summary:
- The app lives outside `public_html` at `/home/u152944366/domains/sekolahkemurnian.sch.id/kemurnian-web`
- `public_html/index.php` points to the app
- GitHub Actions deploys code, runs migrations, and syncs `public/` into `public_html/`

## CI

Workflow: [.github/workflows/ci.yml](.github/workflows/ci.yml)

CI runs on `main` pushes and PRs and checks:
- Frontend build (`pnpm run build`)
- Composer validation and install (no scripts)

## Common Tasks

### Create Admin User

```bash
php artisan admin:create "Admin Name" admin@example.com "StrongPass123"
```

### Clear Caches (production)

```bash
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

## Troubleshooting

### 403 on routes like /news

- Check that `public_html/.htaccess` exists and contains Laravel rewrite rules.
- Remove legacy static folders/files that shadow routes (e.g. `public_html/news/`).

### Old .html URLs do not redirect

If the `.html` file still exists in `public_html`, Apache serves it directly and Laravel redirects never run.
Rename or delete the legacy file, or add a direct redirect in `.htaccess`.

### Uploads not showing

Confirm `public_html/uploads/` exists and is writable by the web server.
