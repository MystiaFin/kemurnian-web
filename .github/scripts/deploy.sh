#!/bin/bash

set -euo pipefail

# Arguments
RELEASE_ID="$1"
DOMAIN_ROOT="$2"
ARCHIVE_NAME="release-${RELEASE_ID}.tar.gz"

# Paths
PHP_BIN="/opt/alt/php84/usr/bin/php"
COMPOSER_BIN="/usr/local/bin/composer"
APP_ROOT="$DOMAIN_ROOT/kemurnian-web"
RELEASES_DIR="$APP_ROOT/releases"
SHARED_DIR="$APP_ROOT/shared"
CURRENT_LINK="$APP_ROOT/current"
PUBLIC_HTML="$DOMAIN_ROOT/public_html"
ARCHIVE_PATH="$DOMAIN_ROOT/tmp/$ARCHIVE_NAME"
RELEASE_PATH="$RELEASES_DIR/$RELEASE_ID"

# Capture previous target for rollback
PREVIOUS_TARGET=""
if [ -L "$CURRENT_LINK" ]; then
  PREVIOUS_TARGET="$(readlink -f "$CURRENT_LINK" || true)"
fi

# Rollback function
rollback() {
  if [ -n "$PREVIOUS_TARGET" ] && [ -d "$PREVIOUS_TARGET" ]; then
    echo "Rolling back to $PREVIOUS_TARGET"
    ln -sfn "$PREVIOUS_TARGET" "$CURRENT_LINK"
    rsync -a --delete "$PREVIOUS_TARGET/public/build/" "$PUBLIC_HTML/build/"
    rsync -a \
      --exclude='index.php' \
      --exclude='.htaccess' \
      --exclude='assets/' \
      --exclude='uploads/' \
      "$PREVIOUS_TARGET/public/" "$PUBLIC_HTML/"
  fi
}
trap rollback ERR

# Ensure directories exist
mkdir -p "$RELEASES_DIR" "$SHARED_DIR/storage" "$DOMAIN_ROOT/tmp"
mkdir -p "$SHARED_DIR/storage/app" "$SHARED_DIR/storage/framework" "$SHARED_DIR/storage/logs"

# Check .env exists
if [ ! -f "$SHARED_DIR/.env" ]; then
  echo "Error: Missing $SHARED_DIR/.env. Create it before deploying."
  exit 1
fi

# Extract archive
echo "Extracting $ARCHIVE_PATH to $RELEASE_PATH"
rm -rf "$RELEASE_PATH"
mkdir -p "$RELEASE_PATH"
if [ ! -f "$ARCHIVE_PATH" ]; then
  echo "Error: Archive not found at $ARCHIVE_PATH"
  ls -la "$DOMAIN_ROOT/tmp"
  exit 1
fi
tar -xzf "$ARCHIVE_PATH" -C "$RELEASE_PATH"
rm -f "$ARCHIVE_PATH"

# Link shared resources
echo "Linking shared resources"
ln -sfn "$SHARED_DIR/.env" "$RELEASE_PATH/.env"
rm -rf "$RELEASE_PATH/storage"
ln -sfn "$SHARED_DIR/storage" "$RELEASE_PATH/storage"

# Laravel setup
echo "Running Laravel setup"
cd "$RELEASE_PATH"
"$PHP_BIN" "$COMPOSER_BIN" install --no-dev --prefer-dist --optimize-autoloader --no-interaction
"$PHP_BIN" artisan migrate --force
"$PHP_BIN" artisan config:cache
"$PHP_BIN" artisan route:cache
"$PHP_BIN" artisan view:cache

# Switch live
echo "Switching current to $RELEASE_PATH"
ln -sfn "$RELEASE_PATH" "$CURRENT_LINK"

# Sync public files
echo "Syncing public files"
rsync -a --delete "$CURRENT_LINK/public/build/" "$PUBLIC_HTML/build/"
rsync -a \
  --exclude='index.php' \
  --exclude='.htaccess' \
  --exclude='assets/' \
  --exclude='uploads/' \
  "$CURRENT_LINK/public/" "$PUBLIC_HTML/"

# Cleanup old releases (keep max 10)
echo "Cleaning up old releases (keeping latest 10)"
ls -1dt "$RELEASES_DIR"/* | tail -n +11 | xargs -r rm -rf

# Clear trap
trap - ERR

echo "Deploy successful!"
