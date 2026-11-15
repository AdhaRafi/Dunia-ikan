<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\StoreReview;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StoreReviewSeeder extends Seeder
{
    public function run(): void
    {
        $store1 = Store::where('slug', 'aquatic-heritage-farm')->first();
        $store2 = Store::where('slug', 'nusantara-aquascape')->first();

        $reviewers = [
            [
                'name' => 'Raka Mahendra',
                'email' => 'raka@duniaikan.test',
                'store1' => [5, 'Ikan sampai dengan selamat ke Surabaya, kantong oksigen tebal dan boks styrofoam aman. Warna halfmoon super pekat dan langsung aktif flaring.'],
                'store2' => [5, 'Anubias sehat tanpa hama keong, akar sudah nempel kuat di lava rock. Packing rapi dan pengiriman cepat.'],
            ],
            [
                'name' => 'Dewi Lestari',
                'email' => 'dewi@duniaikan.test',
                'store1' => [5, 'Penjual ramah saat ditanya parameter air sebelumnya. Ikan sesuai foto dan ukuran proporsional.'],
                'store2' => [4, 'Tanaman segar semua, cuma kurir sempat agak malam sampainya. Untung insulasi aman.'],
            ],
            [
                'name' => 'Bagas Wijaya',
                'email' => 'bagas@duniaikan.test',
                'store1' => [4, 'Packing ganda sangat niat dan garansi DOA jelas. Recommended untuk penghobi cupang kontes.'],
                'store2' => [5, 'Bucephalandra velvetnya cakep banget di bawah lampu WRGB. Bakal langganan lagi.'],
            ],
        ];

        foreach ($reviewers as $entry) {
            $reviewer = User::firstOrCreate(
                ['email' => $entry['email']],
                [
                    'name' => $entry['name'],
                    'phone' => '081200000000',
                    'role' => 'buyer',
                    'password' => Hash::make('password'),
                ],
            );

            if ($store1) {
                StoreReview::updateOrCreate(
                    ['store_id' => $store1->id, 'user_id' => $reviewer->id],
                    ['rating' => $entry['store1'][0], 'comment' => $entry['store1'][1]],
                );
            }

            if ($store2) {
                StoreReview::updateOrCreate(
                    ['store_id' => $store2->id, 'user_id' => $reviewer->id],
                    ['rating' => $entry['store2'][0], 'comment' => $entry['store2'][1]],
                );
            }
        }
    }
}
