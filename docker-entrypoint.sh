#!/bin/sh
set -e

export PORT="${PORT:-80}"
export APP_CONFIG_CACHE="${APP_CONFIG_CACHE:-/tmp/config.php}"
export VIEW_COMPILED_PATH="${VIEW_COMPILED_PATH:-/tmp/storage/framework/views}"

mkdir -p /tmp/storage/app/public \
    /tmp/storage/app/private \
    /tmp/storage/framework/cache/data \
    /tmp/storage/framework/sessions \
    /tmp/storage/framework/testing \
    /tmp/storage/framework/views \
    /tmp/storage/logs

if [ -n "${APP_KEY:-}" ]; then
    php artisan config:cache --no-interaction || true
    php artisan view:cache --no-interaction || true
    php artisan migrate --force --no-interaction || true
else
    rm -f "${APP_CONFIG_CACHE}" /app/bootstrap/cache/config.php || true
fi

exec frankenphp run --config /etc/frankenphp/Caddyfile
