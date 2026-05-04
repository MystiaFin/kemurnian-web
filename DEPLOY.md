# Deploy Guide (Hostinger Shared Hosting)

This project is deployed to Hostinger shared hosting using GitHub Actions + SSH.

## Server layout

- App path: `/home/u152944366/domains/sekolahkemurnian.sch.id/kemurnian-web`
- Public web root: `/home/u152944366/domains/sekolahkemurnian.sch.id/public_html`

The `public_html` directory contains the web-served files. Requests are routed to `public_html/index.php`.

## GitHub Actions

Workflow: `.github/workflows/deploy.yml`

Required secrets:
- `SSH_HOST`
- `SSH_USER`
- `SSH_PRIVATE_KEY`
- `SSH_PORT`
- `DOMAIN_ROOT` = `/home/u152944366/domains/sekolahkemurnian.sch.id`

What the workflow does:
- Builds frontend assets (`pnpm run build`).
- SSH deploy:
  - `git pull` in the app directory.
  - `composer install`.
  - `php artisan migrate --force`.
  - `php artisan config:cache`, `route:cache`, `view:cache`.
- Copies `public/build/` to the server.
- Rsyncs `public/` to `public_html/` (excluding `index.php` and `.htaccess`).

## Important files in public_html

- `public_html/index.php` points to the app outside public_html.
- `public_html/.htaccess` must exist and include Laravel rewrite rules.

Note: the workflow currently excludes `.htaccess`, so if it is missing in `public_html`, copy it manually:

```
cp ~/domains/sekolahkemurnian.sch.id/kemurnian-web/public/.htaccess \
   ~/domains/sekolahkemurnian.sch.id/public_html/.htaccess
```

## Static assets

Static files live under `public/assets/` and are synced to `public_html/assets/`.

Common paths:
- `/assets/nav_logo.webp`
- `/assets/sekolah/kemurnian_i.avif`

## Troubleshooting

### 403 on /news or other routes

Likely cause: `.htaccess` missing in `public_html` or a static folder/file is shadowing the route.

- Ensure `public_html/.htaccess` exists.
- Remove legacy folders/files like `public_html/news/` or old `*.html` pages if they block Laravel routes.

### 404 on /news or routes not found

Run on server:

```
php artisan route:clear
php artisan route:list | grep news
```

### Old .html URLs not redirecting

Laravel redirects only work if the request hits Laravel. If the old `.html` file exists in `public_html`, Apache serves it directly.

Fix: rename or delete the legacy file, or add a `.htaccess` redirect.

### Database import from old domain

Best practice: drop target tables, then import full SQL including `migrations` table.

CLI example:
```
mysqldump -u OLD_USER -p OLD_DB > /tmp/main.sql
mysql -u NEW_USER -p NEW_DB < /tmp/main.sql
```

## Rollback

If a deploy fails:
1) SSH into server.
2) `cd /home/u152944366/domains/sekolahkemurnian.sch.id/kemurnian-web`
3) `git log --oneline -n 5` to find previous commit.
4) `git checkout <commit>` and re-run caches:

```
/opt/alt/php84/usr/bin/php artisan config:cache
/opt/alt/php84/usr/bin/php artisan route:cache
/opt/alt/php84/usr/bin/php artisan view:cache
```

## Suggestions (optional improvements)

- Consider adding a CI job for lint/test before deploy.
- Keep `public_html/.htaccess` versioned or remove the exclude in rsync to avoid missing rewrite rules.
