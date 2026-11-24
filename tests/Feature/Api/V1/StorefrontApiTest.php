<?php

namespace Tests\Feature\Api\V1;

use App\Models\Category;
use App\Models\FishDetail;
use App\Models\FishGuide;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StorefrontApiTest extends TestCase
{
    use RefreshDatabase;

    private function createCatalogFixture(): array
    {
        $seller = User::factory()->create(['role' => 'seller']);

        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'Nusantara Betta Farm',
            'slug' => 'nusantara-betta-farm',
            'city' => 'Bandung',
            'province' => 'Jawa Barat',
            'address' => 'Jl. Akuatik No. 12, Bandung',
            'phone' => '081299988877',
            'description' => 'Peternak cupang kontes.',
            'doa_policy' => 'Garansi DOA 100% dengan video unboxing.',
            'is_active' => true,
        ]);

        $fishCategory = Category::create([
            'name' => 'Ikan Hias',
            'slug' => 'ikan-hias',
            'description' => 'Koleksi ikan hias air tawar dan laut.',
        ]);

        $gearCategory = Category::create([
            'name' => 'Perlengkapan',
            'slug' => 'perlengkapan',
            'description' => 'Filter dan peralatan akuarium.',
        ]);

        $betta = Product::create([
            'store_id' => $store->id,
            'category_id' => $fishCategory->id,
            'name' => 'Cupang Halfmoon Super Red',
            'slug' => 'cupang-halfmoon-super-red',
            'description' => 'Sirip lebar sehat lincah.',
            'price' => 125000,
            'stock' => 6,
            'image' => '/images/products/cupang-halfmoon.jpg',
            'is_active' => true,
            'views' => 10,
        ]);

        FishDetail::create([
            'product_id' => $betta->id,
            'species_name' => 'Betta splendens',
            'morph_trait' => 'Halfmoon',
            'sex' => 'male',
            'size_stage' => 'adult',
            'water_type' => 'freshwater',
            'min_tank_liters' => 5,
            'temp_min' => 24,
            'temp_max' => 28,
            'ph_min' => 6.5,
            'ph_max' => 7.5,
            'care_level' => 'beginner',
            'temperament' => 'aggressive',
            'diet_type' => 'carnivore',
            'breeding_origin' => 'captive_bred',
        ]);

        $filter = Product::create([
            'store_id' => $store->id,
            'category_id' => $gearCategory->id,
            'name' => 'Canister Filter Pro 500',
            'slug' => 'canister-filter-pro-500',
            'description' => 'Filter sunyi hemat listrik.',
            'price' => 450000,
            'stock' => 3,
            'image' => '/images/products/canister-filter.jpg',
            'is_active' => true,
            'views' => 4,
        ]);

        $inactive = Product::create([
            'store_id' => $store->id,
            'category_id' => $fishCategory->id,
            'name' => 'Arwana Arsip Nonaktif',
            'slug' => 'arwana-arsip-nonaktif',
            'description' => 'Tidak tampil di publik.',
            'price' => 2500000,
            'stock' => 1,
            'is_active' => false,
        ]);

        $guide = FishGuide::create([
            'title' => 'Mengatasi White Spot pada Cupang',
            'fish_type' => 'Cupang',
            'category' => 'Penyakit & Parasit',
            'symptoms' => 'Bintik putih di sirip dan tubuh.',
            'possible_causes' => 'Parasit Ichthyophthirius multifiliis.',
            'care_instructions' => 'Naikkan suhu ke 30C dan berikan garam ikan.',
            'prevention' => 'Karantina ikan baru minimal 7 hari.',
            'is_active' => true,
        ]);

        $inactiveGuide = FishGuide::create([
            'title' => 'Draft Panduan Nonaktif',
            'fish_type' => 'Koi',
            'category' => 'Kualitas Air',
            'symptoms' => 'Draft.',
            'possible_causes' => 'Draft.',
            'care_instructions' => 'Draft.',
            'is_active' => false,
        ]);

        return compact('store', 'fishCategory', 'gearCategory', 'betta', 'filter', 'inactive', 'guide', 'inactiveGuide');
    }

    public function test_home_returns_categories_featured_fish_stores_and_stats(): void
    {
        $fixture = $this->createCatalogFixture();

        $response = $this->getJson('/api/v1/home');

        $response->assertOk()
            ->assertJsonPath('featured_fish.0.slug', $fixture['betta']->slug)
            ->assertJsonPath('featured_fish.0.image_url', url('/images/products/cupang-halfmoon.jpg'))
            ->assertJsonPath('featured_stores.0.slug', $fixture['store']->slug)
            ->assertJsonPath('stats.total_fish', 9)
            ->assertJsonPath('stats.total_stores', 1)
            ->assertJsonPath('stats.total_guides', 1);
    }

    public function test_products_index_filters_by_alias_morphology_and_excludes_inactive(): void
    {
        $fixture = $this->createCatalogFixture();

        $aliasResponse = $this->getJson('/api/v1/products?q=alat');
        $aliasResponse->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', $fixture['filter']->slug);

        $fishResponse = $this->getJson('/api/v1/products?category=ikan-hias&water_type=freshwater&sex=male');
        $fishResponse->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', $fixture['betta']->slug)
            ->assertJsonPath('data.0.fish_detail.species_name', 'Betta splendens')
            ->assertJsonPath('filters.cities.0', 'Bandung');
    }

    public function test_product_show_increments_views_and_returns_404_for_inactive_product(): void
    {
        $fixture = $this->createCatalogFixture();

        $response = $this->getJson("/api/v1/products/{$fixture['betta']->slug}");

        $response->assertOk()
            ->assertJsonPath('product.slug', $fixture['betta']->slug)
            ->assertJsonPath('product.views', 11)
            ->assertJsonPath('product.store.slug', $fixture['store']->slug)
            ->assertJsonPath('store_rating.count', 0);

        $this->assertSame(11, $fixture['betta']->fresh()->views);

        $this->getJson("/api/v1/products/{$fixture['inactive']->slug}")->assertNotFound();
    }

    public function test_store_show_returns_active_store_products_and_404_for_missing_store(): void
    {
        $fixture = $this->createCatalogFixture();

        $response = $this->getJson("/api/v1/stores/{$fixture['store']->slug}");

        $response->assertOk()
            ->assertJsonPath('store.slug', $fixture['store']->slug)
            ->assertJsonCount(2, 'products.data');

        $this->getJson('/api/v1/stores/toko-tidak-ada')->assertNotFound();
    }

    public function test_guides_index_and_show_filter_and_hide_inactive_guides(): void
    {
        $fixture = $this->createCatalogFixture();

        $listResponse = $this->getJson('/api/v1/guides?q=parasit');
        $listResponse->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $fixture['guide']->id)
            ->assertJsonPath('total_guides', 1);

        $detailResponse = $this->getJson("/api/v1/guides/{$fixture['guide']->id}");
        $detailResponse->assertOk()
            ->assertJsonPath('guide.title', 'Mengatasi White Spot pada Cupang');

        $this->getJson("/api/v1/guides/{$fixture['inactiveGuide']->id}")->assertNotFound();
    }
}
