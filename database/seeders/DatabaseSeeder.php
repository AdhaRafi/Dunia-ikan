<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Category;
use App\Models\FishDetail;
use App\Models\FishGuide;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Akun Admin
        $admin = User::create([
            'name' => 'Administrator Dunia Ikan',
            'email' => 'admin@duniaikan.test',
            'phone' => '081234567890',
            'role' => 'admin',
            'password' => Hash::make('password'),
        ]);

        Address::create([
            'user_id' => $admin->id,
            'recipient_name' => 'Administrator Dunia Ikan',
            'phone' => '081234567890',
            'city' => 'Kota Bandung',
            'province' => 'Jawa Barat',
            'postal_code' => '40287',
            'full_address' => 'Gedung Agro Aquatic Park Lt. 3, Jl. Soekarno-Hatta No. 450',
            'is_primary' => true,
        ]);

        // 2. Akun Penjual 1 & Toko
        $seller1 = User::create([
            'name' => 'Budi Hartono',
            'email' => 'penjual1@duniaikan.test',
            'phone' => '082123456781',
            'role' => 'seller',
            'password' => Hash::make('password'),
        ]);

        $store1 = Store::create([
            'user_id' => $seller1->id,
            'name' => 'Aquatic Heritage Farm',
            'slug' => 'aquatic-heritage-farm',
            'city' => 'Kota Bandung',
            'province' => 'Jawa Barat',
            'address' => 'Jl. Terusan Buah Batu No. 45, Bojongsoang',
            'phone' => '082123456781',
            'description' => 'Penangkar resmi ikan hias kontes jenis Cupang (Betta) ekor ganda & rosetail serta Channa maru asal Kalimantan. Berpengalaman sejak 2018.',
            'doa_policy' => 'Garansi 100% ikan hidup sampai tujuan untuk pengiriman pulau Jawa & Bali. Syarat klaim wajib menyertakan video unboxing utuh tanpa jeda/cut maksimal 2 jam setelah paket tiba.',
            'bank_name' => 'BCA',
            'bank_account_number' => '7820192837',
            'bank_account_name' => 'Budi Hartono',
            'is_active' => true,
        ]);

        // 3. Akun Penjual 2 & Toko
        $seller2 = User::create([
            'name' => 'Siti Rahayu',
            'email' => 'penjual2@duniaikan.test',
            'phone' => '085712345672',
            'role' => 'seller',
            'password' => Hash::make('password'),
        ]);

        $store2 = Store::create([
            'user_id' => $seller2->id,
            'name' => 'Nusantara Aquascape & Nano Fish',
            'slug' => 'nusantara-aquascape',
            'city' => 'Jakarta Barat',
            'province' => 'DKI Jakarta',
            'address' => 'Ruko Daan Mogot Permai Blok B2 No. 11',
            'phone' => '085712345672',
            'description' => 'Menyediakan flora aquascape higienis bebas hama, ikan nano schooling, perlengkapan akuarium rimless, dan nutrisi tanaman aquascape.',
            'doa_policy' => 'Garansi hidup berlaku untuk kurir Sameday/Instant & Paxel Nextday. Wajib video unboxing jelas sebelum membuka kantong packing oksigen.',
            'bank_name' => 'Bank Mandiri',
            'bank_account_number' => '1370019283746',
            'bank_account_name' => 'Siti Rahayu',
            'is_active' => true,
        ]);

        // 4. Akun Pembeli & Alamat
        $buyer = User::create([
            'name' => 'Andi Pratama',
            'email' => 'pembeli@duniaikan.test',
            'phone' => '081398765432',
            'role' => 'buyer',
            'password' => Hash::make('password'),
        ]);

        Address::create([
            'user_id' => $buyer->id,
            'recipient_name' => 'Andi Pratama',
            'phone' => '081398765432',
            'city' => 'Kota Bandung',
            'province' => 'Jawa Barat',
            'postal_code' => '40135',
            'full_address' => 'Jl. Ir. H. Juanda (Dago Asri) No. 28B, Dago, Coblong',
            'is_primary' => true,
        ]);

        // 5. Kategori Produk
        $categories = [
            [
                'name' => 'Ikan Hias',
                'slug' => 'ikan-hias',
                'description' => 'Ikan air tawar & laut berkualitas, sehat, dan bergaransi hidup.',
                'icon' => 'Fish',
            ],
            [
                'name' => 'Perlengkapan Aquarium',
                'slug' => 'perlengkapan-aquarium',
                'description' => 'Filter, lampu LED, heater, aerator, dan tank kaca rimless.',
                'icon' => 'Box',
            ],
            [
                'name' => 'Pakan Ikan',
                'slug' => 'pakan-ikan',
                'description' => 'Pelet nutrisi tinggi, cacing darah beku, dan artemia kultur.',
                'icon' => 'Wheat',
            ],
            [
                'name' => 'Perawatan Ikan',
                'slug' => 'perawatan-ikan',
                'description' => 'Garam non-yodium, ekstrak ketapang, bakteri starter, dan obat ikan.',
                'icon' => 'ShieldAlert',
            ],
            [
                'name' => 'Aquascape',
                'slug' => 'aquascape',
                'description' => 'Tanaman hias air, batu seiryu, kayu rasamala, dan pasir silika.',
                'icon' => 'Trees',
            ],
        ];

        $catMap = [];
        foreach ($categories as $cat) {
            $catMap[$cat['slug']] = Category::create($cat);
        }

        // 6. Produk & Fish Details (MorphMarket-inspired taxonomy)
        $p1 = Product::create([
            'store_id' => $store1->id,
            'category_id' => $catMap['ikan-hias']->id,
            'name' => 'Cupang Halfmoon Rosetail Super Red (Male Grade A)',
            'slug' => 'cupang-halfmoon-rosetail-super-red',
            'description' => 'Ikan Cupang Halfmoon dengan mutasi ekor rosetail bertingkat yang sangat rapat dan warna merah menyala solid. Sirip bukaan 180 derajat sempurna, lincah, aktif flaring, dan dirawat dengan daun ketapang olahan.',
            'price' => 175000,
            'stock' => 12,
            'image' => '/images/products/cupang-halfmoon.jpg',
            'is_active' => true,
        ]);

        FishDetail::create([
            'product_id' => $p1->id,
            'species_name' => 'Betta splendens',
            'morph_trait' => 'Halfmoon Rosetail Super Red',
            'sex' => 'male',
            'size_stage' => 'M (3.5 - 4.0 cm)',
            'water_type' => 'freshwater',
            'min_tank_liters' => 10,
            'temp_min' => 25.0,
            'temp_max' => 29.0,
            'ph_min' => 6.5,
            'ph_max' => 7.2,
            'care_level' => 'pemula',
            'temperament' => 'semi-agresif',
            'diet_type' => 'Karnivora / Pelet High Protein & Jentik',
            'breeding_origin' => 'captive_bred',
        ]);

        $p2 = Product::create([
            'store_id' => $store1->id,
            'category_id' => $catMap['ikan-hias']->id,
            'name' => 'Cupang Plakat Avatar Gordon Multi-Colour',
            'slug' => 'cupang-plakat-avatar-gordon',
            'description' => 'Plakat Avatar Gordon corak galaksi sisik metalik dengan kombinasi warna hitam pekat, biru metalik, dan titik hijau tosca. Tubuh tegap, lincah, dan memiliki mental petarung show grade.',
            'price' => 220000,
            'stock' => 8,
            'image' => '/images/products/cupang-plakat.jpg',
            'is_active' => true,
        ]);

        FishDetail::create([
            'product_id' => $p2->id,
            'species_name' => 'Betta splendens',
            'morph_trait' => 'Plakat Avatar Gordon',
            'sex' => 'male',
            'size_stage' => 'M (3.8 cm)',
            'water_type' => 'freshwater',
            'min_tank_liters' => 12,
            'temp_min' => 25.0,
            'temp_max' => 28.5,
            'ph_min' => 6.5,
            'ph_max' => 7.0,
            'care_level' => 'pemula',
            'temperament' => 'semi-agresif',
            'diet_type' => 'Pelet Micro & Cacing Sutera',
            'breeding_origin' => 'captive_bred',
        ]);

        $p3 = Product::create([
            'store_id' => $store1->id,
            'category_id' => $catMap['ikan-hias']->id,
            'name' => 'Channa Marulioides Yellow Sentarum (Bunga Rapi 15cm)',
            'slug' => 'channa-maru-yellow-sentarum-15cm',
            'description' => 'Ikan predator hias Channa Maru varian Yellow Sentarum asli Danau Sentarum Kalimantan. Bunga sirip sudah mulai naik rapi, dorsal tegak, mental bar flaring mantap, dan sudah terbiasa makan udang kering serta pelet premium.',
            'price' => 350000,
            'stock' => 5,
            'image' => '/images/products/channa-maru.jpg',
            'is_active' => true,
        ]);

        FishDetail::create([
            'product_id' => $p3->id,
            'species_name' => 'Channa marulioides',
            'morph_trait' => 'Yellow Sentarum (Bunga Calon Rapi)',
            'sex' => 'unsexed',
            'size_stage' => 'Juvenile (14-16 cm)',
            'water_type' => 'freshwater',
            'min_tank_liters' => 150,
            'temp_min' => 26.0,
            'temp_max' => 30.0,
            'ph_min' => 6.0,
            'ph_max' => 7.0,
            'care_level' => 'menengah',
            'temperament' => 'predator',
            'diet_type' => 'Karnivora (Udang, Ikan Kecil, Pelet Predator)',
            'breeding_origin' => 'farm_raised',
        ]);

        $p4 = Product::create([
            'store_id' => $store2->id,
            'category_id' => $catMap['ikan-hias']->id,
            'name' => 'Guppy Albino Full Red (AFR) Pasangan Indukan',
            'slug' => 'guppy-albino-full-red-pair',
            'description' => '1 Pasang (1 Jantan + 1 Betina Siap Pijah) Guppy Albino Full Red grade murni. Mata merah terang (albino), dorsal lebar mengembang, ekor delta merah rata tanpa noda. Sangat cocok untuk aquascape atau breeding.',
            'price' => 85000,
            'stock' => 15,
            'image' => '/images/products/guppy-albino-full-red.jpg',
            'is_active' => true,
        ]);

        FishDetail::create([
            'product_id' => $p4->id,
            'species_name' => 'Poecilia reticulata',
            'morph_trait' => 'Albino Full Red (High Dorsal)',
            'sex' => 'pair',
            'size_stage' => 'Dewasa Siap Pijah (3-4 cm)',
            'water_type' => 'freshwater',
            'min_tank_liters' => 20,
            'temp_min' => 23.0,
            'temp_max' => 28.0,
            'ph_min' => 7.0,
            'ph_max' => 8.0,
            'care_level' => 'pemula',
            'temperament' => 'damai',
            'diet_type' => 'Omnivora (Pelet Halus, Artemia, Kutu Air)',
            'breeding_origin' => 'captive_bred',
        ]);

        $p5 = Product::create([
            'store_id' => $store2->id,
            'category_id' => $catMap['ikan-hias']->id,
            'name' => 'Neon Tetra Schooling Pack (Paket 10 Ekor)',
            'slug' => 'neon-tetra-schooling-pack-10-ekor',
            'description' => 'Paket 10 ekor Neon Tetra sehat dan lincah berenang bersama (schooling). Garis biru neon berpendar kontras dengan ekor merah menyala. Sangat aman dan mempesona untuk akuarium aquascape bertanaman lebat.',
            'price' => 45000,
            'stock' => 25,
            'image' => '/images/products/neon-tetra.jpg',
            'is_active' => true,
        ]);

        FishDetail::create([
            'product_id' => $p5->id,
            'species_name' => 'Paracheirodon innesi',
            'morph_trait' => 'Classic Neon Blue & Red',
            'sex' => 'unsexed',
            'size_stage' => 'S (2.0 - 2.5 cm)',
            'water_type' => 'freshwater',
            'min_tank_liters' => 40,
            'temp_min' => 22.0,
            'temp_max' => 26.0,
            'ph_min' => 6.0,
            'ph_max' => 7.0,
            'care_level' => 'pemula',
            'temperament' => 'damai',
            'diet_type' => 'Omnivora (Pelet Mikro & Daphnia)',
            'breeding_origin' => 'farm_raised',
        ]);

        $p6 = Product::create([
            'store_id' => $store2->id,
            'category_id' => $catMap['ikan-hias']->id,
            'name' => 'Ikan Discus Pigeon Blood Red (Size 2.5 Inch)',
            'slug' => 'ikan-discus-pigeon-blood-red-2-5-inch',
            'description' => 'Ikan Discus varian Pigeon Blood Red dengan bintik merah cerah dan warna dasar kuning keemasan. Ikan sudah adaptasi air tawar Bandung/Jakarta, makan lancar burger discus dan cacing beku.',
            'price' => 195000,
            'stock' => 6,
            'image' => '/images/products/discus-pigeon-blood.jpg',
            'is_active' => true,
        ]);

        FishDetail::create([
            'product_id' => $p6->id,
            'species_name' => 'Symphysodon aequifasciatus',
            'morph_trait' => 'Pigeon Blood Red Checker',
            'sex' => 'unsexed',
            'size_stage' => 'Juvenile (2.5 Inch / 6 cm)',
            'water_type' => 'freshwater',
            'min_tank_liters' => 100,
            'temp_min' => 28.0,
            'temp_max' => 31.0,
            'ph_min' => 6.0,
            'ph_max' => 6.8,
            'care_level' => 'mahir',
            'temperament' => 'damai',
            'diet_type' => 'Karnivora (Burger Discus & Bloodworm)',
            'breeding_origin' => 'captive_bred',
        ]);

        // 7. Produk Kategori Lainnya
        Product::create([
            'store_id' => $store2->id,
            'category_id' => $catMap['perlengkapan-aquarium']->id,
            'name' => 'Tank Aquarium Rimless Ultra Clear Optic White 60x30x35cm',
            'slug' => 'aquarium-rimless-ultra-clear-60cm',
            'description' => 'Akuarium kaca tanpa bingkai (rimless) menggunakan kaca Ultra Clear Optic White ketebalan 6mm. Sambungan lem silikon transparan presisi buatan pabrik Jerman. Tingkat kejernihan hingga 92%.',
            'price' => 290000,
            'stock' => 10,
            'image' => '/images/products/aquarium-rimless.jpg',
            'is_active' => true,
        ]);

        Product::create([
            'store_id' => $store2->id,
            'category_id' => $catMap['perlengkapan-aquarium']->id,
            'name' => 'Canister Filter External Aquascape Silent Pump 800 L/H',
            'slug' => 'canister-filter-silent-800lh',
            'description' => 'Filter canister eksternal hemat daya 12W dengan debit air 800 Liter/Jam. Sudah dilengkapi 3 keranjang media biologis (ceramic ring & bioball), selang in/out, dan lily pipe akrilik elegan.',
            'price' => 380000,
            'stock' => 7,
            'image' => '/images/products/canister-filter.jpg',
            'is_active' => true,
        ]);

        Product::create([
            'store_id' => $store1->id,
            'category_id' => $catMap['pakan-ikan']->id,
            'name' => 'Pelet Khusus Cupang & Channa Spirulina Plus 60g',
            'slug' => 'pelet-cupang-channa-spirulina-plus',
            'description' => 'Pakan butiran terapung mikro (0.8mm) dengan kandungan protein 48%, ekstrak spirulina, astaxanthin, dan vitamin C untuk mempercepat mutasi warna dan memperkuat daya tahan tubuh ikan.',
            'price' => 32000,
            'stock' => 40,
            'image' => '/images/products/pelet-spirulina.jpg',
            'is_active' => true,
        ]);

        Product::create([
            'store_id' => $store1->id,
            'category_id' => $catMap['pakan-ikan']->id,
            'name' => 'Cacing Darah Beku Higienis (Frozen Bloodworm) 100g 28 Cube',
            'slug' => 'cacing-darah-beku-100g',
            'description' => 'Cacing darah segar yang disterilisasi sinar UV dan dibekukan cepat dalam tray 28 kubus kecil. Bebas bakteri patogen dan parasit, kaya nutrisi pembentukan massa otot ikan hias.',
            'price' => 18000,
            'stock' => 50,
            'image' => '/images/products/cacing-darah-beku.jpg',
            'is_active' => true,
        ]);

        Product::create([
            'store_id' => $store1->id,
            'category_id' => $catMap['perawatan-ikan']->id,
            'name' => 'Garam Ikan Non-Yodium Murni Kristal Putih 1 Kg',
            'slug' => 'garam-ikan-non-yodium-1kg',
            'description' => 'Garam kristal murni murni tanpa yodium (NaCl 99%) untuk menyeimbangkan osmoregulasi cairan tubuh ikan pasca transportasi, mencegah infeksi jamur, dan menetralkan racun nitrit.',
            'price' => 10000,
            'stock' => 80,
            'image' => '/images/products/garam-ikan.jpg',
            'is_active' => true,
        ]);

        Product::create([
            'store_id' => $store1->id,
            'category_id' => $catMap['perawatan-ikan']->id,
            'name' => 'Ekstrak Daun Ketapang Laut Olahan Plus Antiseptik 250ml',
            'slug' => 'ekstrak-daun-ketapang-laut-250ml',
            'description' => 'Ekstrak fermentasi daun ketapang laut tua yang telah disaring bersih dari minyak dan kotoran. Mengandung tanin alami untuk menstabilkan pH air, antibakteri alami, dan menenangkan ikan yang stres.',
            'price' => 25000,
            'stock' => 35,
            'image' => '/images/products/ekstrak-ketapang.jpg',
            'is_active' => true,
        ]);

        Product::create([
            'store_id' => $store2->id,
            'category_id' => $catMap['aquascape']->id,
            'name' => 'Tanaman Aquascape Anubias Nana Golden on Lava Rock',
            'slug' => 'anubias-nana-golden-lava-rock',
            'description' => 'Tanaman anubias daun kuning cerah (golden) yang sudah menempel kuat pada lempengan batu lava hitam alami. Sangat mudah dirawat, minim kebutuhan CO2, dan tahan terhadap gigitan ikan kecil.',
            'price' => 45000,
            'stock' => 18,
            'image' => '/images/products/anubias-nana.jpg',
            'is_active' => true,
        ]);

        Product::create([
            'store_id' => $store2->id,
            'category_id' => $catMap['aquascape']->id,
            'name' => 'Bucephalandra Velvet Mini Cluster (Clump 5x5 cm)',
            'slug' => 'bucephalandra-velvet-mini-cluster',
            'description' => 'Tanaman endemik Kalimantan asli daun kecil berwarna hijau gelap dengan kemilau biru metalik (velvet) saat disinari cahaya lampu akuarium. Sudah adaptasi air tawar (submersed).',
            'price' => 60000,
            'stock' => 14,
            'image' => '/images/products/bucephalandra.jpg',
            'is_active' => true,
        ]);

        // 8. Panduan Kesehatan Ikan (FishGuide untuk Chatbot dan Basis Pengetahuan)
        FishGuide::create([
            'title' => 'Pencegahan & Pengobatan White Spot (Ich / Bintik Putih)',
            'fish_type' => 'Semua Ikan Air Tawar',
            'category' => 'Penyakit Parasit',
            'symptoms' => 'Muncul bintik-bintik putih kecil mirip taburan garam di permukaan badan, ekor, dan sirip. Ikan tampak gelisah dan sering menggesekkan badan (flashing) ke batu, substrat, atau kaca.',
            'possible_causes' => 'Infeksi protozoa ektoparasit Ichthyophthirius multifiliis yang sering terpicu oleh penurunan suhu air secara drastis saat musim hujan atau stres air pasca pergantian air besar.',
            'care_instructions' => "1. Naikkan suhu air bertahap menjadi 29-30°C menggunakan heater akuarium untuk mempercepat siklus hidup parasit.\n2. Berikan garam ikan non-yodium dengan takaran 1 hingga 2 gram per liter air.\n3. Lakukan sifon kotoran dasar dan ganti air 30% setiap 2 hari sebelum pemberian dosis ulang.\n4. Tingkatkan aerasi oksigen karena suhu yang lebih hangat mengurangi kelarutan oksigen di dalam air.",
            'prevention' => 'Gunakan heater untuk menjaga suhu konstan (26-28°C) dan karantina ikan baru minimal 7-10 hari sebelum disatukan ke tank utama.',
            'source' => 'Pedoman Kesehatan Aquakultur Air Tawar & Komunitas Aquarist Indonesia',
            'is_active' => true,
        ]);

        FishGuide::create([
            'title' => 'Mengatasi Penyakit Busuk Sirip (Fin Rot) & Ekor Robek',
            'fish_type' => 'Ikan Cupang, Guppy, Channa, Ikan Hias',
            'category' => 'Infeksi Bakteri / Jamur',
            'symptoms' => 'Tepi sirip atau ekor terlihat terkikis, berjumbai, berwarna putih kusam atau kemerahan akibat peradangan, dan ikan tampak kurang aktif mengembang.',
            'possible_causes' => 'Bakteri Aeromonas / Pseudomonas yang berkembang biak saat kualitas air menurun akibat sisa pakan membusuk, penumpukan amonia/nitrit, atau luka akibat pertarungan.',
            'care_instructions' => "1. Pindahkan ikan ke wadah karantina berair bersih dan terendap.\n2. Berikan ekstrak daun ketapang tua olahan hingga air berwarna kuning kecokelatan untuk memberikan efek antibakteri alami.\n3. Tambahkan garam ikan 1 gram per liter air.\n4. Ganti air 50% setiap 2 hari sekali secara konsisten.",
            'prevention' => 'Sifon sisa kotoran secara berkala dan hindari memberi makan berlebih (overfeeding).',
            'source' => 'Panduan Perawatan Ikan Laga & Hias Tropis',
            'is_active' => true,
        ]);

        FishGuide::create([
            'title' => 'Gangguan Kantung Kemih (Swim Bladder Disorder / Mengapung Terbalik)',
            'fish_type' => 'Ikan Mas Koki, Cupang, Guppy',
            'category' => 'Gangguan Pencernaan & Organ',
            'symptoms' => 'Ikan berenang miring, terbalik, sulit menyelam dan selalu terdorong naik ke permukaan air, atau justru diam tenggelam di dasar tank.',
            'possible_causes' => 'Konstipasi (sembelit) akibat pakan kering/pelet yang mengembang di dalam perut, udara yang tertelan saat makan pelet terapung, atau infeksi organ dalam.',
            'care_instructions' => "1. Puasakan ikan selama 24 hingga 48 jam penuh agar saluran pencernaan beristirahat.\n2. Berikan pakan hijau berupa kacang polong rebus yang sudah dikupas kulit arinya dan dihaluskan kecil.\n3. Jaga kedalaman air wadah karantina agak dangkal (sekitar 15-20 cm) agar ikan tidak terlalu lelah mengapung.",
            'prevention' => 'Rendam pelet kering di air selama 1-2 menit sebelum diberikan ke ikan, atau selingi diet dengan pakan alami segar/beku.',
            'source' => 'Petunjuk Praktis Pemeliharaan Ikan Mas Koki & Ikan Hias',
            'is_active' => true,
        ]);

        FishGuide::create([
            'title' => 'Kualitas Air Buruk & Keracunan Amonia (Megap-megap di Permukaan)',
            'fish_type' => 'Semua Ikan Air Tawar & Aquascape',
            'category' => 'Kualitas Air & Filter',
            'symptoms' => 'Ikan berkumpul di permukaan air dan megap-megap menghirup udara, insang tampak merah keunguan meradang, ikan lesu dan mogok makan.',
            'possible_causes' => 'Lonjakan amonia/nitrit karena akuarium belum melalui proses siklus nitrogen (cycling), filter biologis mati/terlalu sering dicuci dengan air kaporit, atau pakan busuk.',
            'care_instructions' => "1. Lakukan pergantian air (water change) darurat sebesar 40-50% menggunakan air bersih yang sudah diberi anti-klorin/dechlorinator.\n2. Berikan aerasi maksimal melalui airstone.\n3. Tambahkan bakteri starter cair (nitrifying bacteria) untuk memulihkan koloni bakteri pengurai amonia.\n4. Hentikan pemberian pakan selama 1-2 hari.",
            'prevention' => 'Pastikan akuarium sudah di-cycling minimal 1-2 minggu sebelum memasukkan ikan dalam jumlah banyak, dan jangan pernah mencuci media filter biologis menggunakan air kran langsung.',
            'source' => 'Dasar Siklus Nitrogen Aquascape & Akuarium Tropis',
            'is_active' => true,
        ]);
    }
}
