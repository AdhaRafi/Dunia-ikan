<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chat_session_id')->constrained()->cascadeOnDelete();
            $table->string('sender'); // user, assistant
            $table->text('message');
            $table->string('image_path')->nullable();
            $table->json('recommended_products')->nullable(); // JSON list of product snapshot data
            $table->timestamps();
        });

        // Relasi pesan-panduan untuk pelacakan referensi panduan yang dipakai chatbot
        Schema::create('chat_message_fish_guide', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chat_message_id')->constrained()->cascadeOnDelete();
            $table->foreignId('fish_guide_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_message_fish_guide');
        Schema::dropIfExists('chat_messages');
    }
};
