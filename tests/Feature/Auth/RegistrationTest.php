<?php

namespace Tests\Feature\Auth;

use App\Models\Category;
use App\Models\FishGuide;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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

        // Buyer cannot call admin approval routes
        $this->actingAs($applicant)
            ->post("/admin-portal/users/{$applicant->id}/approve-seller")
            ->assertStatus(403);

        // Admin approves first applicant
        $this->actingAs($admin)
            ->post("/admin-portal/users/{$applicant->id}/approve-seller")
            ->assertSessionHas('success');

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

        // Admin rejects second applicant
        $this->actingAs($admin)
            ->post("/admin-portal/users/{$rejectedApplicant->id}/reject-seller")
            ->assertSessionHas('success');

        $rejectedApplicant->refresh();
        $this->assertSame('buyer', $rejectedApplicant->role);
        $this->assertSame('rejected', $rejectedApplicant->seller_status);
        $this->actingAs($rejectedApplicant)
            ->get('/seller/products')
            ->assertStatus(403);

        // Filament Users management page renders cleanly for admin
        $this->actingAs($admin)
            ->get('/admin/users')
            ->assertStatus(200);
    }

    public function test_admin_dashboard_and_portal_crud_routes_are_connected(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $buyer = User::factory()->create(['role' => 'buyer', 'seller_status' => 'none']);

        $this->actingAs($admin)
            ->get('/dashboard')
            ->assertRedirect(url('/admin'));

        foreach (['/admin', '/admin/categories', '/admin/products', '/admin/stores', '/admin/orders'] as $filamentPath) {
            $this->actingAs($admin)->get($filamentPath)->assertStatus(200);
        }

        foreach (['/admin-portal', '/admin-portal/categories', '/admin-portal/guides', '/admin-portal/users', '/admin-portal/transactions'] as $portalPath) {
            $this->actingAs($admin)->get($portalPath)->assertStatus(200);
        }

        $this->actingAs($admin)
            ->post('/admin-portal/categories', [
                'name' => 'Udang Hias',
                'description' => 'Caridina & Neocaridina',
            ])
            ->assertSessionHas('success');

        $category = Category::where('slug', 'udang-hias')->firstOrFail();
        $this->actingAs($admin)
            ->delete("/admin-portal/categories/{$category->id}")
            ->assertSessionHas('success');

        $this->actingAs($admin)
            ->post('/admin-portal/guides', [
                'title' => 'Karantina Ikan Baru',
                'fish_type' => 'Semua Ikan',
                'category' => 'Perawatan Dasar',
                'symptoms' => 'Stres perjalanan',
                'possible_causes' => 'Aklimatisasi mendadak',
                'care_instructions' => 'Apungkan kantong 15 menit',
                'is_active' => true,
            ])
            ->assertSessionHas('success');

        $guide = FishGuide::where('title', 'Karantina Ikan Baru')->firstOrFail();
        $this->actingAs($admin)->post("/admin-portal/guides/{$guide->id}/toggle")->assertSessionHas('success');
        $this->assertFalse($guide->fresh()->is_active);
        $this->actingAs($admin)->delete("/admin-portal/guides/{$guide->id}")->assertSessionHas('success');

        $this->actingAs($admin)
            ->post("/admin-portal/users/{$buyer->id}/role", ['role' => 'seller'])
            ->assertSessionHas('success');
        $this->assertSame('seller', $buyer->fresh()->role);
    }
}
