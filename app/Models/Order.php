<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'buyer_id',
        'store_id',
        'status',
        'payment_method',
        'payment_status',
        'snap_token',
        'total_product_amount',
        'shipping_cost',
        'grand_total',
        'shipping_recipient_name',
        'shipping_phone',
        'shipping_city',
        'shipping_address',
        'shipping_notes',
        'shipping_courier',
        'shipping_tracking_number',
        'payment_proof',
        'payment_notes',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'total_product_amount' => 'decimal:2',
            'shipping_cost' => 'decimal:2',
            'grand_total' => 'decimal:2',
        ];
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
