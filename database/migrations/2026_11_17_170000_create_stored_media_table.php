<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stored_media', function (Blueprint $table) {
            $table->id();
            $table->string('path')->unique();
            $table->string('mime_type', 100);
            $table->unsignedInteger('size')->default(0);
            $table->longText('contents_base64');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stored_media');
    }
};
