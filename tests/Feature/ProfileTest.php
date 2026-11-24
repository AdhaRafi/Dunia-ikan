<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/profile');

        $response->assertOk();
    }

    public function test_profile_information_can_be_updated(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
    }

    public function test_profile_update_validates_email_and_phone_strictly(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->from('/profile')
            ->patch('/profile', [
                'name' => $user->name,
                'email' => 'budi@gmail',
                'phone' => '081234567890',
            ])
            ->assertSessionHasErrors('email');

        $this->actingAs($user)
            ->from('/profile')
            ->patch('/profile', [
                'name' => $user->name,
                'email' => 'budi@gmail.com',
                'phone' => '12345',
            ])
            ->assertSessionHasErrors('phone');

        $this->actingAs($user)
            ->from('/profile')
            ->patch('/profile', [
                'name' => 'Budi Aquarist',
                'email' => 'budi@gmail.com',
                'phone' => '0812-3456-7890',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $user->refresh();
        $this->assertSame('budi@gmail.com', $user->email);
        $this->assertSame('081234567890', $user->phone);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'email' => $user->email,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete('/profile', [
                'password' => 'password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/');

        $this->assertGuest();
        $this->assertNull($user->fresh());
    }

    public function test_correct_password_must_be_provided_to_delete_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from('/profile')
            ->delete('/profile', [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect('/profile');

        $this->assertNotNull($user->fresh());
    }

    public function test_buyer_and_seller_can_upload_and_remove_profile_avatar(): void
    {
        Storage::fake('public');

        foreach (['buyer', 'seller'] as $role) {
            $user = User::factory()->create(['role' => $role]);
            $file = UploadedFile::fake()->image("{$role}-avatar.jpg");

            $response = $this
                ->actingAs($user)
                ->post('/profile', [
                    '_method' => 'patch',
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $file,
                ]);

            $response
                ->assertSessionHasNoErrors()
                ->assertRedirect('/profile');

            $user->refresh();
            $this->assertNotNull($user->avatar);
            $this->assertStringStartsWith('/storage/avatars/', $user->avatar_url);
            Storage::disk('public')->assertExists($user->avatar);

            $oldPath = $user->avatar;

            $removeResponse = $this
                ->actingAs($user)
                ->patch('/profile', [
                    'name' => $user->name,
                    'email' => $user->email,
                    'remove_avatar' => true,
                ]);

            $removeResponse
                ->assertSessionHasNoErrors()
                ->assertRedirect('/profile');

            $user->refresh();
            $this->assertNull($user->avatar);
            $this->assertNull($user->avatar_url);
            Storage::disk('public')->assertMissing($oldPath);
        }
    }
}
