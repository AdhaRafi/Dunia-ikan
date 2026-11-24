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
        if (! Schema::hasTable('store_conversations')) {
            Schema::create('store_conversations', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('store_id')->constrained()->cascadeOnDelete();
                $table->foreignId('buyer_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
                $table->timestamp('last_message_at')->nullable()->index();
                $table->unsignedBigInteger('buyer_last_read_message_id')->default(0);
                $table->unsignedBigInteger('seller_last_read_message_id')->default(0);
                $table->timestamps();

                $table->unique(['store_id', 'buyer_id']);
            });
        }

        if (! Schema::hasTable('store_messages')) {
            Schema::create('store_messages', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('conversation_id')->constrained('store_conversations')->cascadeOnDelete();
                $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
                $table->text('message')->nullable();
                $table->string('image_path')->nullable();
                $table->timestamps();

                $table->index(['conversation_id', 'id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_messages');
        Schema::dropIfExists('store_conversations');
    }
};
