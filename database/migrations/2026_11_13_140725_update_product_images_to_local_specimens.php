<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * @var array<string, string>
     */
    private array $images = [
        'cupang-halfmoon-rosetail-super-red' => '/images/products/cupang-halfmoon.jpg',
        'cupang-plakat-avatar-gordon' => '/images/products/cupang-plakat.jpg',
        'channa-maru-yellow-sentarum-15cm' => '/images/products/channa-maru.jpg',
        'guppy-albino-full-red-pair' => '/images/products/guppy-albino-full-red.jpg',
        'neon-tetra-schooling-pack-10-ekor' => '/images/products/neon-tetra.jpg',
        'ikan-discus-pigeon-blood-red-2-5-inch' => '/images/products/discus-pigeon-blood.jpg',
        'aquarium-rimless-ultra-clear-60cm' => '/images/products/aquarium-rimless.jpg',
        'canister-filter-silent-800lh' => '/images/products/canister-filter.jpg',
        'pelet-cupang-channa-spirulina-plus' => '/images/products/pelet-spirulina.jpg',
        'cacing-darah-beku-100g' => '/images/products/cacing-darah-beku.jpg',
        'garam-ikan-non-yodium-1kg' => '/images/products/garam-ikan.jpg',
        'ekstrak-daun-ketapang-laut-250ml' => '/images/products/ekstrak-ketapang.jpg',
        'anubias-nana-golden-lava-rock' => '/images/products/anubias-nana.jpg',
        'bucephalandra-velvet-mini-cluster' => '/images/products/bucephalandra.jpg',
    ];

    public function up(): void
    {
        foreach ($this->images as $slug => $image) {
            DB::table('products')->where('slug', $slug)->update(['image' => $image]);
        }
    }

    public function down(): void
    {
        // Data fix only: previous Unsplash URLs pointed at unrelated subjects.
    }
};
