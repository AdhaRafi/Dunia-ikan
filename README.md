# Dunia Ikan — Marketplace Ikan Hias & Aquascape

![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.3%2F8.4-777BB4?style=flat-square&logo=php&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Inertia.js](https://img.shields.io/badge/Inertia.js-v2-9553E9?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Filament](https://img.shields.io/badge/Filament-v5-FDAE4B?style=flat-square)
![Kotlin](https://img.shields.io/badge/Android-Kotlin-7F52FF?style=flat-square&logo=kotlin&logoColor=white)

**Dunia Ikan** adalah platform marketplace multi-penjual untuk ikan hias tropis (air tawar, air laut, air payau), varian/morph genetik, serta flora dan perlengkapan aquascape yang terinspirasi dari pola taksonomi dan standar keselamatan hewan [MorphMarket](https://www.morphmarket.com/).

---

## Tech Stack

| Lapisan | Teknologi |
| --- | --- |
| **Backend & Auth** | Laravel 13 (`^13.17`), PHP 8.3/8.4, Laravel Breeze, Laravel Sanctum, Ziggy |
| **Frontend & UI** | React 18, Inertia.js v2, Vite 6, Tailwind CSS 3, Headless UI, Lucide React |
| **Admin Panel** | Filament v5 (`/admin`) + Portal Admin Inertia (`/admin-portal`) |
| **Database** | PostgreSQL (produksi), SQLite / MySQL (pengembangan lokal) |
| **Integrasi & Keamanan** | Midtrans Snap, Cloudflare Turnstile, Google Gemini AI (Asisten Kiko) |
| **Aplikasi Android** | Kotlin WebView native (`android/`, Gradle, Splash Screen, Server Switcher) |
| **Container & Deploy** | Docker multi-stage, FrankenPHP + Caddy (`Caddyfile`), Vercel (`vercel.json`) |
| **Testing & Formatter** | PHPUnit 12, Laravel Pint |

---

## Fitur Utama

1. **Taksonomi Biologi & Filter Spesimen (`FishDetail`)**
   - Pencatatan nama ilmiah, morph/trait, jenis kelamin (`male`, `female`, `pair`, `unsexed`), fase ukuran, tipe air (`freshwater`, `saltwater`, `brackish`), minimal volume tank, rentang suhu & pH, tingkat perawatan, temperamen, dan asal pembiakan.
2. **Standar Garansi Hidup (D.O.A. Policy) & Ulasan Toko**
   - Setiap toko memiliki kebijakan garansi Death On Arrival yang ditampilkan pada halaman produk dan profil toko, beserta rating & ulasan pembeli (`StoreReview`).
3. **Checkout Multi-Toko & Tiga Jalur Pembayaran**
   - Pesanan dipisah otomatis per toko.
   - Mendukung **Midtrans Snap** (QRIS, Virtual Account, Kartu, dll lengkap dengan webhook `/midtrans/notification`, sinkronisasi status, dan halaman finish), **Transfer Bank Manual / Unggah Bukti Bayar**, serta **COD (Bayar di Tempat)** yang langsung diproses toko tanpa tahap pembayaran online.
4. **Dual Auth Guard Terisolasi (`web` & `admin`) + Anti-Bot**
   - Login Pembeli & Penjual melalui `/login` (`guard: web`), registrasi penangkar baru melalui `/register` (dengan status verifikasi admin), dan login Administrator terpisah melalui `/admin/login` (`guard: admin`) untuk mengakses Panel Filament `/admin` maupun Portal Admin `/admin-portal`.
   - Autentikasi dilindungi **Cloudflare Turnstile** (ketika site key & secret key dikonfigurasi) dan pembatasan percobaan login.
5. **Chatbot Asisten AI "Kiko" (Google Gemini)**
   - Konsultasi gejala penyakit ikan dan rekomendasi stok ikan langsung dari database. Jika `GEMINI_API_KEY` belum diisi atau layanan tidak tersedia, chatbot otomatis memakai fallback panduan perawatan (`FishGuide`) dan daftar produk aktif.
6. **UI Dwibahasa (`ID` / `EN`) & Dark/Light Mode**
   - Pengaturan bahasa dan tema tersedia di header aplikasi (`resources/js/lib/i18n.jsx`, `TopHeader.jsx`).

---

## Struktur Proyek

```text
.
├── app/
│   ├── Filament/
│   │   ├── Pages/Auth/AdminLogin.php       # Halaman login panel Filament (/admin/login) + Turnstile & rate limit
│   │   └── Resources/                      # Resource CRUD Filament: Categories, Orders, Products, Stores, Users
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/                      # Controller Portal Admin Inertia (/admin-portal/*)
│   │   │   ├── Auth/                       # Autentikasi Breeze + AdminLogoutController
│   │   │   ├── Seller/                     # Manajemen toko, produk, dan pesanan penjual (/seller/*)
│   │   │   └── *.php                       # Storefront, katalog, keranjang, checkout, order, review, chatbot, Midtrans
│   │   ├── Middleware/                     # EnsureUserHasRole, HandleInertiaRequests, SecurityHeaders
│   │   └── Requests/                       # Validasi LoginRequest & ProfileUpdateRequest
│   ├── Models/                             # User, Store, Category, Product, FishDetail, FishGuide, Address, CartItem, Order, OrderItem, StoreReview, ChatSession, ChatMessage
│   ├── Providers/                          # AppServiceProvider & Filament\AdminPanelProvider
│   └── Services/                           # TurnstileVerifier (verifikasi token Cloudflare Turnstile)
├── bootstrap/
│   ├── app.php                             # Routing, middleware, CSRF exception webhook Midtrans, render 403/404 Inertia, & path /tmp/storage di Vercel
│   └── providers.php                       # Registrasi service provider aplikasi & Filament
├── config/                                 # Konfigurasi Laravel (auth guard web/admin, services, ziggy filter, cors, sanctum, dll.)
├── database/
│   ├── factories/                          # Model factories untuk pengujian
│   ├── migrations/                         # Skema tabel marketplace, Midtrans snap_token, verifikasi seller, ulasan toko
│   └── seeders/                            # DatabaseSeeder, FishSpeciesExpansionSeeder, StoreReviewSeeder
├── public/
│   ├── images/                             # Aset lokal: brand, banner, kategori, produk, avatar Kiko, hero showcase
│   └── videos/                             # Video latar hero halaman utama
├── resources/
│   ├── css/app.css                         # Entry styling Tailwind CSS
│   ├── js/
│   │   ├── Components/                     # TopHeader, Sidebar, Footer, ProductCard, ChatbotWidget, TurnstileWidget, dll.
│   │   ├── Layouts/                        # AppLayout, GuestLayout, SellerLayout, AdminLayout
│   │   ├── Pages/                          # Halaman Inertia (Welcome, Products, Stores, Guides, Cart, Checkout, Orders, Seller, Admin, Auth, Profile, Errors/HttpError)
│   │   └── lib/                            # Helper frontend (i18n.jsx, guideMeta.js)
│   └── views/                              # app.blade.php (root Inertia) & komponen Blade Turnstile Filament
├── routes/
│   ├── web.php                             # Route storefront, buyer, seller (/seller/*), admin (/admin-portal/*), Midtrans, chatbot
│   ├── auth.php                            # Route autentikasi pengguna (/login, /register, reset password, dll.)
│   ├── api.php                             # Endpoint /api/health & /api/user (Sanctum)
│   └── console.php                         # Perintah Artisan CLI
├── tests/
│   └── Feature/                            # PHPUnit suite (Auth, MarketplaceTest, MidtransTest, ProfileTest, SecurityHardeningTest)
├── android/                                # Aplikasi Android WebView (Kotlin, splash screen & server switcher)
├── Caddyfile                               # Konfigurasi webserver FrankenPHP/Caddy + blokir akses /build/manifest.json
├── Dockerfile.vercel                       # Multi-stage Docker image (Node 22 + FrankenPHP PHP 8.4)
├── docker-entrypoint.sh                    # Inisialisasi container saat boot (migrasi, optimasi cache, start FrankenPHP)
└── vercel.json                             # Konfigurasi deployment container di Vercel
```

---

## Cara Menggunakan & Menjalankan Lokal

### 1. Persyaratan Sistem
- **PHP >= 8.3** (disarankan PHP 8.4) dengan ekstensi `pdo_pgsql` / `pdo_sqlite`, `intl`, `mbstring`, `bcmath`, `zip`, `gd`
- **Composer**
- **Node.js >= 18 & npm**
- **Database:** PostgreSQL (direkomendasikan untuk produksi) atau SQLite (praktis untuk lokal)

### 2. Instalasi Dependensi & Pengaturan `.env`
```bash
git clone https://github.com/AdhaRafi/Dunia-ikan.git
cd Dunia-ikan

composer install
cp .env.example .env
php artisan key:generate
```

> **Keamanan `.env`:** File `.env` dan `.env.*` (kecuali `.env.example`) sudah masuk dalam `.gitignore`. Jangan pernah menonaktifkan aturan tersebut atau meng-commit kunci API/rahasia asli ke GitHub.

### 3. Konfigurasi Database & Integrasi di `.env`

**Opsi A — PostgreSQL (Default `.env.example`)**
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=dunia_ikan
DB_USERNAME=postgres
DB_PASSWORD=secret
```
*(Untuk managed PostgreSQL seperti Neon/Supabase/Railway, Anda juga dapat memakai `DB_URL`.)*

**Opsi B — SQLite (Cepat Tanpa Server Database)**
```env
DB_CONNECTION=sqlite
```
*(Buat file kosong `database/database.sqlite` atau jalankan migrasi langsung bila SQLite mengizinkannya; hapus/komentari baris `DB_HOST`..`DB_SSLMODE` di `.env`.)*

**Integrasi Opsional di `.env`:**
- **Chatbot Gemini:** isi `GEMINI_API_KEY` dan `GEMINI_MODEL=gemini-3.5-flash-lite` (bila kosong, fallback database tetap berjalan).
- **Midtrans Snap:** isi `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`, dan `MIDTRANS_IS_PRODUCTION=false` untuk sandbox.
- **Cloudflare Turnstile:** isi `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, serta daftar host di `TURNSTILE_HOSTNAMES=localhost,127.0.0.1`.
- **Tombol Demo di `/login`:** set `APP_DEMO_MODE=false` untuk produksi publik, atau `true` bila ingin menampilkan tombol pengisi kredensial demo lokal.

### 4. Migrasi, Seeding, dan Symlink Storage
```bash
php artisan migrate --seed
php artisan storage:link
```
*(Gunakan `php artisan migrate:fresh --seed` untuk mereset database dari awal dan mengisi ulang data seeder.)*

### 5. Build Aset Frontend & Jalankan Server
```bash
npm install --ignore-scripts
npm run build
```

Jalankan server pengembangan Laravel + Vite:
```bash
composer run dev
```
Atau jalankan di dua terminal terpisah:
```bash
php artisan serve
npm run dev
```

Akses aplikasi di browser:
- **Marketplace:** `http://localhost:8000`
- **Login Pembeli / Penjual:** `http://localhost:8000/login`
- **Panel Admin (Filament):** `http://localhost:8000/admin/login` -> `/admin`
- **Portal Admin (Inertia):** `http://localhost:8000/admin-portal`

---

## Pengujian & Pemeriksaan Kualitas Kode

Jalankan suite PHPUnit (fitur katalog, checkout multi-toko & COD, Midtrans webhook, autentikasi, serta security hardening):
```bash
php artisan test --compact
```

Periksa gaya kode PHP menggunakan Laravel Pint:
```bash
php vendor/bin/pint --test --format agent
```

---

## Deployment Container / Vercel

Repository ini dilengkapi `vercel.json` (`"framework": "container"`), `Dockerfile.vercel`, `docker-entrypoint.sh`, dan `Caddyfile` (FrankenPHP PHP 8.4). Untuk deploy produksi:
1. Atur environment variable di platform hosting (`APP_KEY`, `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL`, `DB_CONNECTION=pgsql`, `DB_URL` / koneksi PostgreSQL, `SESSION_SECURE_COOKIE=true`, `TURNSTILE_*`, `MIDTRANS_*`, `GEMINI_*`).
2. Pastikan `APP_DEMO_MODE=false` pada deployment publik.

---

## Aplikasi Android (`android/`)

Companion app Android WebView (`id.duniaikan.app`, Kotlin) dilengkapi layar loading (splash screen) dan pengalih server (produksi `https://dunia-ikan.vercel.app`, emulator `10.0.2.2:8000`, USB `127.0.0.1:8000`, atau IP LAN lokal). Build APK debug:
```bash
cd android
./gradlew assembleDebug
```
*(Folder `android/` dikecualikan dari build container melalui `.dockerignore` dan `.vercelignore`.)*
