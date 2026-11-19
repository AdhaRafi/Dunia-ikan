<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;
use Throwable;

abstract class Controller
{
    /**
     * Run a feature migration lazily once when the target table has not been migrated yet.
     */
    protected function ensureTableMigrated(string $table, string $migrationPath): bool
    {
        if (Schema::hasTable($table)) {
            return true;
        }

        try {
            Artisan::call('migrate', [
                '--path' => $migrationPath,
                '--force' => true,
                '--no-interaction' => true,
            ]);
        } catch (Throwable $exception) {
            if (! Schema::hasTable($table)) {
                report($exception);
            }
        }

        return Schema::hasTable($table);
    }
}
