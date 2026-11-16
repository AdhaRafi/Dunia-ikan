<?php

namespace Tests\Feature\Auth;

use App\Filament\Resources\Categories\Pages\CreateCategory;
use App\Filament\Resources\FishGuides\Pages\CreateFishGuide;
use App\Filament\Resources\FishGuides\Pages\ListFishGuides;
use App\Filament\Resources\Users\Pages\EditUser;
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Models\Category;
use App\Models\FishGuide;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'role' => 'buyer',
            'seller_status' => 'none',
        ]);
    }

    public function test_seller_registration_requires_store_name_and_starts_pending(): void
    {
        $invalid = $this->post('/register', [
            'name' => 'Calon Penjual',
            'email' => 'calon@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'account_type' => 'seller',
        ]);

        $invalid->assertSessionHasErrors('seller_store_name');
        $this->assertGuest();

        $response = $this->post('/register', [
            'name' => 'Calon Penjual',
            'email' => 'calon@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'account_type' => 'seller',
            'seller_store_name' => 'Garuda Koi Farm',
            'seller_application_note' => 'Budidaya koi berkualitas di Bandung',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $user = User::where('email', 'calon@example.com')->firstOrFail();
        $this->assertSame('buyer', $user->role);
        $this->assertSame('pending', $user->seller_status);
        $this->assertSame('Garuda Koi Farm', $user->seller_store_name);

        // Dashboard routes pending seller applicant to verification status page, and seller routes stay blocked
        $this->actingAs($user)
            ->get('/dashboard')
            ->assertRedirect(route('seller.store.create'));

        $this->actingAs($user)
            ->get('/seller/products')
            ->assertStatus(403);
    }

    public function test_unverified_buyer_cannot_bypass_admin_approval_via_seller_register(): void
    {
        $buyer = User::factory()->create([
            'role' => 'buyer',
            'seller_status' => 'none',
        ]);

        $response = $this->actingAs($buyer)->post('/seller/register', [
            'seller_store_name' => 'Bypass Farm',
            'seller_application_note' => 'Ingin langsung jualan',
        ]);

        $response->assertRedirect(route('seller.store.create'));

        $buyer->refresh();
        $this->assertSame('buyer', $buyer->role);
        $this->assertSame('pending', $buyer->seller_status);
        $this->assertNull($buyer->store);
    }

    public function test_admin_can_approve_and_reject_seller_applications(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $applicant = User::factory()->create([
            'role' => 'buyer',
            'seller_status' => 'pending',
            'seller_store_name' => 'Nusantara Betta',
        ]);
        $rejectedApplicant = User::factory()->create([
            'role' => 'buyer',
            'seller_status' => 'pending',
            'seller_store_name' => 'Toko Ditolak',
        ]);

        // Buyer cannot reach admin seller approval or legacy admin portal routes
        $this->actingAs($applicant)
            ->get('/admin-portal/users')
            ->assertStatus(403);

        // Admin approves first applicant via Filament UserResource table action
        $this->actingAs($admin, 'admin');

        Livewire::test(ListUsers::class)
            ->callTableAction('approveSeller', $applicant);

        $applicant->refresh();
        $this->assertSame('seller', $applicant->role);
        $this->assertSame('approved', $applicant->seller_status);
        $this->assertNotNull($applicant->seller_reviewed_at);

        // Approved seller can now open their store at /seller/register
        $this->actingAs($applicant)
            ->post('/seller/register', [
                'name' => 'Nusantara Betta',
                'city' => 'Kota Bandung',
                'province' => 'Jawa Barat',
                'address' => 'Jl. Braga No. 12',
                'phone' => '081234567890',
            ])
            ->assertRedirect(route('seller.products.index'));

        $this->assertDatabaseHas('stores', [
            'user_id' => $applicant->id,
            'name' => 'Nusantara Betta',
        ]);

        // Admin rejects second applicant via Filament UserResource table action
        $this->actingAs($admin, 'admin');

        Livewire::test(ListUsers::class)
            ->callTableAction('rejectSeller', $rejectedApplicant);

        $rejectedApplicant->refresh();
        $this->assertSame('buyer', $rejectedApplicant->role);
        $this->assertSame('rejected', $rejectedApplicant->seller_status);
        $this->actingAs($rejectedApplicant)
            ->get('/seller/products')
            ->assertStatus(403);

        // Filament Users management page renders cleanly for admin
        $this->actingAs($admin, 'admin')
            ->get('/admin/users')
            ->assertStatus(200);
    }

    public function test_admin_dashboard_and_filament_crud_routes_are_connected(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $buyer = User::factory()->create(['role' => 'buyer', 'seller_status' => 'none']);

        $this->actingAs($admin)
            ->get('/dashboard')
            ->assertRedirect(url('/admin'));

        foreach ([
            '/admin',
            '/admin/transaction-reports',
            '/admin/fish-guides',
            '/admin/categories',
            '/admin/products',
            '/admin/stores',
            '/admin/orders',
            '/admin/users',
        ] as $filamentPath) {
            $this->actingAs($admin, 'admin')->get($filamentPath)->assertStatus(200);
        }

        // Legacy /admin-portal paths redirect cleanly to unified Filament routes.
        $this->actingAs($admin, 'admin')->get('/admin-portal')->assertRedirect('/admin');
        $this->actingAs($admin, 'admin')->get('/admin-portal/categories')->assertRedirect('/admin/categories');
        $this->actingAs($admin, 'admin')->get('/admin-portal/guides')->assertRedirect('/admin/fish-guides');
        $this->actingAs($admin, 'admin')->get('/admin-portal/users')->assertRedirect('/admin/users');
        $this->actingAs($admin, 'admin')->get('/admin-portal/transactions')->assertRedirect('/admin/orders');
        $this->actingAs($admin, 'admin')->get('/admin-portal/reports')->assertRedirect('/admin/transaction-reports');

        $this->actingAs($admin, 'admin');

        // Category CRUD in Filament
        Livewire::test(CreateCategory::class)
            ->fillForm([
                'name' => 'Udang Hias',
                'slug' => 'udang-hias',
                'description' => 'Caridina & Neocaridina',
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $category = Category::where('slug', 'udang-hias')->firstOrFail();
        $category->delete();

        // FishGuide CRUD + toggleActive in Filament
        Livewire::test(CreateFishGuide::class)
            ->fillForm([
                'title' => 'Karantina Ikan Baru',
                'fish_type' => 'Semua Ikan',
                'category' => 'Perawatan Dasar',
                'symptoms' => 'Stres perjalanan',
                'possible_causes' => 'Aklimatisasi mendadak',
                'care_instructions' => 'Apungkan kantong 15 menit',
                'is_active' => true,
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $guide = FishGuide::where('title', 'Karantina Ikan Baru')->firstOrFail();

        Livewire::test(ListFishGuides::class)
            ->callTableAction('toggleActive', $guide);

        $this->assertFalse($guide->fresh()->is_active);
        $guide->delete();

        // User role update in Filament EditUser
        Livewire::test(EditUser::class, ['record' => $buyer->getRouteKey()])
            ->fillForm([
                'role' => 'seller',
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertSame('seller', $buyer->fresh()->role);
    }
}
