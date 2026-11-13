# Dunia Ikan - Marketplace Ikan Hias & Mutasi Genetik (Morph)

**Dunia Ikan** adalah platform marketplace multi-penjual untuk ikan hias tropis, mutasi genetik (morph), dan kebutuhan aquascape yang terinspirasi dari pola taksonomi dan standar keselamatan hewan [MorphMarket](https://www.morphmarket.com/). Platform ini dibangun menggunakan **Laravel 12 (PHP 8.4)** dengan **React** melalui **Inertia.js**, di-style dengan **Tailwind CSS**, dan didukung oleh **Chatbot Asisten AI (Google Gemini)**.

---

## 🌟 Fitur Utama & Inspirasi MorphMarket

### 1. Karakteristik Biologi & Morfologi Ikan (MorphMarket-Inspired)
Setiap spesimen ikan hias dilengkapi metadata biologi spesifik:
- **Spesies & Mutasi (Morph / Trait):** Pencatatan nama ilmiah (e.g. *Betta splendens*, *Channa marulioides*) dan nama varian/mutasi genetik (e.g. *Rosetail Super Red*, *Avatar Gordon*, *Yellow Sentarum*).
- **Jenis Kelamin (Sex):** ♂ Jantan (Male), ♀ Betina (Female), Sepasang (Pair), dan Unsexed.
- **Ukuran & Fase Hidup (Size Stage):** S (2-3 cm), M (3-4 cm), Juvenile, hingga Indukan Dewasa Siap Pijah.
- **Parameter Air & Kebutuhan Akuarium:** Tipe air (Freshwater, Saltwater, Brackish), volume tank minimal (Liter), rentang suhu ideal (°C), dan rentang pH air.
- **Karakteristik Perawatan:** Tingkat perawatan (Pemula, Menengah, Mahir), temperamen (Damai, Semi-Agresif, Agresif, Predator), tipe pakan, dan asal pembiakan (*Captive Bred*, *Farm Raised*, *Tangkapan Liar*).

### 2. Standar Garansi Ikan Hidup (D.O.A. - Death On Arrival Policy)
- Mengadopsi standar marketplace hewan hidup dunia: setiap toko penangkar wajib menetapkan kebijakan D.O.A. (misal: jaminan 100% ikan hidup sampai tujuan dengan syarat melampirkan video unboxing utuh tanpa jeda maksimal 2 jam setelah paket tiba).
- Badge **Garansi DOA** ditampilkan secara transparan pada kartu produk, halaman detail, dan profil toko.

### 3. Sistem Multi-Penjual & Pembayaran Manual
- **Pesanan Terpisah per Toko:** Pembeli dapat memesan dari berbagai toko dalam satu keranjang, namun pesanan dan ongkos kirim (termasuk packing box styrofoam beroksigen) dikelompokkan dan diproses secara independen oleh masing-masing toko penangkar.
- **Metode Pembayaran Manual:** Transfer Bank (BCA, Mandiri, dsb), QRIS Manual, dan COD (Bayar di Tempat).
- **Alur Verifikasi:** Pembeli mengunggah bukti pembayaran -> Penjual memverifikasi -> Penjual memasukkan nama kurir dan nomor resi pengiriman -> Pembeli mengonfirmasi paket ikan telah tiba dengan selamat.

### 4. Chatbot Asisten AI Dunia Ikan (Google Gemini)
- **Konsultasi Kesehatan Ikan:** Menjawab pertanyaan gejala sakit (misal: *White Spot*, *Fin Rot*, gangguan kantung kemih) dengan rujukan langsung ke basis panduan database resmi yang dikelola Admin. Dilengkapi disclaimer medis bahwa asisten tidak memberikan resep obat keras berbahaya.
- **Rekomendasi Ikan:** Mencocokkan kriteria pengguna dengan stok ikan asli yang sedang aktif dan tersedia di database.
- **Transparansi & Fallback Cerdas:** Jika `GEMINI_API_KEY` belum diisi atau offline, chatbot secara jujur memberitahu pengguna dan menampilkan panduan statis serta produk rekomendasi dari database.

---

## 👥 Tiga Peran Pengguna (Roles)

1. **Pembeli (Buyer):**
   - Menjelajah dan memfilter katalog dengan filter biologi lengkap.
   - Mengelola buku alamat pengiriman dan keranjang belanja.
   - Melakukan checkout, mengunggah bukti transfer, memantau nomor resi, dan konfirmasi barang diterima.
   - Menggunakan chatbot asisten kesehatan dan rekomendasi ikan.
   - Dapat mendaftarkan toko melalui menu "Buka Toko".

2. **Penjual (Seller):**
   - Mengelola profil toko, kontak, rekening penerima pembayaran, dan kebijakan garansi hidup (DOA).
   - Menambah, mengubah, dan menghapus produk serta spesifikasi morfologi ikan.
   - Mengelola pesanan khusus tokonya: verifikasi bukti bayar dan input nomor resi pengiriman.

3. **Administrator (Admin):**
   - Dashboard monitoring statistik platform (pengguna, toko, produk, pesanan, dan total perputaran dana).
   - Mengelola taksonomi kategori produk.
   - Mengelola basis panduan kesehatan ikan untuk Chatbot.
   - Mengelola hak akses peran (Role) pengguna.
   - Memantau seluruh transaksi di marketplace.

---

## 🔑 Kredensial Akun Demo (Seeder)

Setelah menjalankan seeder database, akun demo berikut siap digunakan (Password default untuk semua akun: `password`):

| Role | Nama Akun | Email | Password |
|---|---|---|---|
| **Admin** | Administrator Dunia Ikan | `admin@duniaikan.test` | `password` |
| **Penjual 1** | Budi Hartono (Aquatic Heritage Farm) | `penjual1@duniaikan.test` | `password` |
| **Penjual 2** | Siti Rahayu (Nusantara Aquascape) | `penjual2@duniaikan.test` | `password` |
| **Pembeli** | Andi Pratama | `pembeli@duniaikan.test` | `password` |

> 💡 *Pada halaman login, tersedia tombol cepat satu-klik untuk mengisi otomatis kredensial akun demo.*

---

## 🛠️ Panduan Instalasi & Menjalankan Aplikasi

### Persyaratan Sistem
- PHP >= 8.2 (Disarankan PHP 8.4)
- Node.js >= 18 & npm
- Composer
- Database: **PostgreSQL** (atau SQLite untuk pengujian lokal instan)

### Langkah 1: Kloning & Pengaturan Lingkungan
Salin berkas konfigurasi `.env`:
```bash
cp .env.example .env
```

### Langkah 2: Konfigurasi Database

#### Opsi A: Menggunakan PostgreSQL (Sesuai Spesifikasi Tugas Akhir)
Pastikan PostgreSQL telah terpasang dan buat database bernama `dunia_ikan`. Sesuaikan baris berikut di `.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=dunia_ikan
DB_USERNAME=postgres
DB_PASSWORD=secret
```

#### Opsi B: Menggunakan SQLite (Pengujian Lokal Instan Tanpa Install Database Server)
```env
DB_CONNECTION=sqlite
```
*(File database otomatis dibuat di `database/database.sqlite`)*

### Langkah 3: Konfigurasi Gemini API (Opsional)
Dapatkan API Key gratis di [Google AI Studio](https://aistudio.google.com/):
```env
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-1.5-flash
```
*(Jika dikosongkan, chatbot tetap berfungsi secara penuh menggunakan panduan statis database).*

### Langkah 4: Migrasi & Seeding Data Awal
Jalankan migrasi tabel dan seeder:
```bash
php artisan migrate:fresh --seed
```

### Langkah 5: Buat Simbolik Link Storage
Untuk menampilkan foto produk dan bukti transfer yang diunggah:
```bash
php artisan storage:link
```

### Langkah 6: Kompilasi Aset Frontend
```bash
npm install
npm run build
```
*(Atau jalankan `npm run dev` untuk hot-reload saat pengembangan)*

### Langkah 7: Jalankan Server Lokal
```bash
php artisan serve
```
Buka browser di [http://localhost:8000](http://localhost:8000).

---

## 🧪 Menjalankan Pengujian (Automated Tests)

Aplikasi dilengkapi test suite PHPUnit untuk memastikan validasi stok, checkout multi-toko, pembatasan otorisasi peran, dan fungsi chatbot:
```bash
php artisan test --compact
```

---

## 📝 Asumsi Penting & Batas Arsitektur
1. **Otorisasi Server-Side:** Seluruh route seller dan admin dilindungi oleh middleware `role:seller,admin` dan `role:admin`. Menyembunyikan tombol di frontend tidak menggantikan validasi server.
2. **Pemesanan per Toko:** Tidak ada payment gateway otomatis pihak ketiga (seperti Midtrans/Xendit) sesuai batasan tugas; alur pembayaran menggunakan verifikasi manual rekening toko & QRIS.
3. **Resi Pengiriman:** Nomor resi dan ekspedisi dicatat secara manual oleh penjual; tidak ada pelacakan satelit real-time palsu.
4. **Keamanan Kunci API:** API key Gemini disimpan secara eksklusif di backend Laravel dan tidak pernah dikirim ke browser/klien.
