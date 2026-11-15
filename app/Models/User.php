<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->isAdmin();
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'role',
        'seller_status',
        'seller_store_name',
        'seller_application_note',
        'seller_reviewed_at',
        'avatar',
        'password',
    ];

    /**
     * @var list<string>
     */
    protected $appends = [
        'avatar_url',
    ];

    public function getAvatarUrlAttribute(): ?string
    {
        if (! $this->avatar) {
            return null;
        }

        if (str_starts_with($this->avatar, 'http') || str_starts_with($this->avatar, '/')) {
            return $this->avatar;
        }

        return '/storage/'.ltrim($this->avatar, '/');
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'seller_reviewed_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isSeller(): bool
    {
        return $this->role === 'seller';
    }

    public function isBuyer(): bool
    {
        return $this->role === 'buyer';
    }

    public function isPendingSeller(): bool
    {
        return $this->role === 'buyer' && $this->seller_status === 'pending';
    }

    public function isRejectedSeller(): bool
    {
        return $this->role === 'buyer' && $this->seller_status === 'rejected';
    }

    /**
     * Approve a buyer's seller verification request and grant seller role.
     */
    public function approveSellerApplication(): void
    {
        $this->update([
            'role' => 'seller',
            'seller_status' => 'approved',
            'seller_reviewed_at' => now(),
        ]);
    }

    /**
     * Reject a buyer's seller verification request and keep buyer privileges.
     */
    public function rejectSellerApplication(): void
    {
        $this->update([
            'role' => 'buyer',
            'seller_status' => 'rejected',
            'seller_reviewed_at' => now(),
        ]);
    }

    public function store(): HasOne
    {
        return $this->hasOne(Store::class);
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'buyer_id');
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function chatSessions(): HasMany
    {
        return $this->hasMany(ChatSession::class);
    }
}
