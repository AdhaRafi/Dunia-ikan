<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('global_messages', 'channel')) {
            Schema::table('global_messages', function (Blueprint $table): void {
                $table->string('channel', 32)->default('general')->index();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('global_messages', 'channel')) {
            Schema::table('global_messages', function (Blueprint $table): void {
                $table->dropIndex(['channel']);
                $table->dropColumn('channel');
            });
        }
    }
};
