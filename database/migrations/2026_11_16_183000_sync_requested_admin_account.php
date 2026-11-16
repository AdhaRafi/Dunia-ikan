<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const ADMIN_EMAIL = 'adminkuy@kuyloh.com';

    private const LEGACY_EMAIL = 'admin@duniaikan.test';

    private const PASSWORD_HASH = '$2y$12$9BDmxwEQj/eymz22IEwV3O7OuqZQ0OZI1nb20B46pRG27KPY.ijLO';

    public function up(): void
    {
        if (app()->environment('testing') || ! Schema::hasTable('users')) {
            return;
        }

        $now = now();
        $target = DB::table('users')->where('email', self::ADMIN_EMAIL)->first();
        $legacy = DB::table('users')->where('email', self::LEGACY_EMAIL)->first();

        if ($target === null && $legacy !== null) {
            DB::table('users')
                ->where('id', $legacy->id)
                ->update([
                    'email' => self::ADMIN_EMAIL,
                    'role' => 'admin',
                    'password' => self::PASSWORD_HASH,
                    'remember_token' => null,
                    'updated_at' => $now,
                ]);
        } elseif ($target !== null) {
            DB::table('users')
                ->where('id', $target->id)
                ->update([
                    'role' => 'admin',
                    'password' => self::PASSWORD_HASH,
                    'remember_token' => null,
                    'updated_at' => $now,
                ]);

            if ($legacy !== null) {
                DB::table('users')->where('id', $legacy->id)->delete();
            }
        } else {
            DB::table('users')->insert([
                'name' => 'Administrator Dunia Ikan',
                'email' => self::ADMIN_EMAIL,
                'phone' => '081234567890',
                'role' => 'admin',
                'seller_status' => 'none',
                'password' => self::PASSWORD_HASH,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        if (Schema::hasTable('sessions')) {
            DB::table('sessions')->delete();
        }
    }

    public function down(): void
    {
        // Credential sync migration is intentionally non-destructive on rollback.
    }
};
