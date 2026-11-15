<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'city',
        'province',
        'address',
        'phone',
        'description',
        'logo',
        'banner',
        'doa_policy',
        'bank_name',
        'bank_account_number',
        'bank_account_name',
        'qris_image',
        'is_active',
    ];

    protected $appends = [
        'logo_url',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function getLogoUrlAttribute(): ?string
    {
        if (! $this->logo) {
            return null;
        }

        if (str_starts_with($this->logo, 'http') || str_starts_with($this->logo, '/')) {
            return $this->logo;
        }

        return '/storage/'.ltrim($this->logo, '/');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(StoreReview::class);
    }

    /**
     * Build aggregated store rating statistics and review list.
     *
     * @return array{
     *     average: float,
     *     count: int,
     *     distribution: array<int, int>,
     *     reviews: list<array<string, mixed>>,
     *     userReview: array{rating: int, comment: string|null}|null,
     *     canReview: bool
     * }
     */
    public function ratingSummary(?User $viewer = null): array
    {
        $reviews = $this->reviews()
            ->with('user:id,name,avatar')
            ->latest()
            ->get();

        $distribution = [5 => 0, 4 => 0, 3 => 0, 2 => 0, 1 => 0];
        foreach ($reviews as $review) {
            if (isset($distribution[$review->rating])) {
                $distribution[$review->rating]++;
            }
        }

        $count = $reviews->count();
        $average = $count > 0 ? round((float) $reviews->avg('rating'), 1) : 0.0;

        $verifiedBuyerIds = $this->orders()
            ->where('status', 'delivered')
            ->distinct()
            ->pluck('buyer_id')
            ->flip();

        $userReviewRecord = $viewer ? $reviews->firstWhere('user_id', $viewer->id) : null;

        return [
            'average' => $average,
            'count' => $count,
            'distribution' => $distribution,
            'reviews' => $reviews->map(function (StoreReview $review) use ($verifiedBuyerIds): array {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'created_at_formatted' => $review->created_at?->translatedFormat('d M Y') ?? '',
                    'is_verified_buyer' => $verifiedBuyerIds->has($review->user_id),
                    'user' => [
                        'id' => $review->user?->id,
                        'name' => $review->user?->name ?? 'Pembeli',
                        'avatar_url' => $review->user?->avatar_url,
                    ],
                ];
            })->values()->all(),
            'userReview' => $userReviewRecord ? [
                'rating' => $userReviewRecord->rating,
                'comment' => $userReviewRecord->comment,
            ] : null,
            'canReview' => $viewer !== null && $viewer->id !== $this->user_id,
        ];
    }
}
