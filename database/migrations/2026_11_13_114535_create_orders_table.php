<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('buyer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->string('status')->default('pending_payment'); // pending_payment, awaiting_confirmation, processing, shipped, delivered, cancelled
            $table->string('payment_method'); // bank_transfer, qris, cod
            $table->string('payment_status')->default('unpaid'); // unpaid, paid, verified, rejected
            $table->decimal('total_product_amount', 12, 2);
            $table->decimal('shipping_cost', 12, 2)->default(0);
            $table->decimal('grand_total', 12, 2);
            $table->string('shipping_recipient_name');
            $table->string('shipping_phone');
            $table->string('shipping_city');
            $table->text('shipping_address');
            $table->text('shipping_notes')->nullable();
            $table->string('shipping_courier')->nullable(); // e.g. JNE YES, TiKi ONS, Kurir Toko
            $table->string('shipping_tracking_number')->nullable(); // no resi
            $table->string('payment_proof')->nullable(); // path to uploaded payment proof image
            $table->text('payment_notes')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['buyer_id', 'status']);
            $table->index(['store_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
