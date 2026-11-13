<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fish_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete()->unique();
            $table->string('species_name')->nullable(); // e.g. Betta splendens, Poecilia reticulata
            $table->string('morph_trait')->nullable();  // e.g. Halfmoon, Albino Full Red, Maru Yellow Sentarum
            $table->string('sex')->default('unsexed');  // male, female, pair, unsexed
            $table->string('size_stage')->nullable();   // S (2-3 cm), M (3-5 cm), Indukan/Adult
            $table->string('water_type')->default('freshwater'); // freshwater, saltwater, brackish
            $table->unsignedInteger('min_tank_liters')->nullable(); // min volume in liters
            $table->decimal('temp_min', 4, 1)->nullable();
            $table->decimal('temp_max', 4, 1)->nullable();
            $table->decimal('ph_min', 3, 1)->nullable();
            $table->decimal('ph_max', 3, 1)->nullable();
            $table->string('care_level')->default('pemula'); // pemula, menengah, mahir
            $table->string('temperament')->default('damai'); // damai, semi-agresif, agresif, predator
            $table->string('diet_type')->nullable(); // omnivora, karnivora, herbivora
            $table->string('breeding_origin')->default('captive_bred'); // captive_bred, farm_raised, wild_caught
            $table->timestamps();

            $table->index(['water_type', 'care_level']);
            $table->index('sex');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fish_details');
    }
};
