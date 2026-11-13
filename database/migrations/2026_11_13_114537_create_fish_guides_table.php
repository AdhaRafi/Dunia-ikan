<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fish_guides', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('fish_type'); // e.g. Ikan Cupang, Ikan Mas Koki, Channa, Guppy, Umum
            $table->string('category');  // Penyakit Parasit, Bakteri/Jamur, Kualitas Air, Perawatan Dasar
            $table->text('symptoms');    // Gejala fisik / perilaku
            $table->text('possible_causes'); // Kemungkinan penyebab
            $table->text('care_instructions'); // Langkah penanganan awal
            $table->text('prevention')->nullable(); // Pencegahan
            $table->string('source')->nullable(); // Sumber referensi (buku, jurnal, asosiasi aquarist)
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['fish_type', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fish_guides');
    }
};
