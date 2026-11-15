<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('seller_status', 20)->default('none')->after('role');
            $table->string('seller_store_name', 120)->nullable()->after('seller_status');
            $table->text('seller_application_note')->nullable()->after('seller_store_name');
            $table->timestamp('seller_reviewed_at')->nullable()->after('seller_application_note');
        });

        DB::table('users')
            ->where('role', 'seller')
            ->update([
                'seller_status' => 'approved',
                'seller_reviewed_at' => now(),
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'seller_status',
                'seller_store_name',
                'seller_application_note',
                'seller_reviewed_at',
            ]);
        });
    }
};
