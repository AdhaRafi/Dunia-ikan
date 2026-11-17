#!/bin/sh
set -e

export PORT="${PORT:-80}"
export APP_CONFIG_CACHE="${APP_CONFIG_CACHE:-/tmp/config.php}"
export APP_ROUTES_CACHE="${APP_ROUTES_CACHE:-/tmp/routes.php}"
export VIEW_COMPILED_PATH="${VIEW_COMPILED_PATH:-/tmp/storage/framework/views}"

mkdir -p /tmp/storage/app/public \
    /tmp/storage/app/private \
    /tmp/storage/framework/cache/data \
    /tmp/storage/framework/sessions \
    /tmp/storage/framework/testing \
    /tmp/storage/framework/views \
    /tmp/storage/logs

if [ -d /app/storage/framework/views ]; then
    cp -rn /app/storage/framework/views/. /tmp/storage/framework/views/ 2>/dev/null || true
fi

if [ -n "${APP_KEY:-}" ]; then
    php artisan config:cache --no-interaction || true
    # Cache routes at runtime after config:cache so Livewire's APP_KEY-derived endpoint hash matches.
    php artisan route:cache --no-interaction || true
    if [ "${RUN_BOOT_MIGRATIONS:-false}" = "true" ]; then
        php artisan migrate --force --no-interaction || true
    fi
else
    rm -f "${APP_CONFIG_CACHE}" "${APP_ROUTES_CACHE}" /app/bootstrap/cache/config.php /app/bootstrap/cache/routes-v7.php || true
fi

exec frankenphp run --config /etc/frankenphp/Caddyfile
