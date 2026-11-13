<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete()->unique();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('city');
            $table->string('province')->default('Jawa Barat');
            $table->text('address');
            $table->string('phone');
            $table->text('description')->nullable();
            $table->string('logo')->nullable();
            $table->string('banner')->nullable();
            $table->text('doa_policy')->nullable(); // Garansi Ikan Hidup / D.O.A. Policy (MorphMarket style)
            $table->string('bank_name')->nullable();
            $table->string('bank_account_number')->nullable();
            $table->string('bank_account_name')->nullable();
            $table->string('qris_image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
