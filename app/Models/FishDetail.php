<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FishDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'species_name',
        'morph_trait',
        'sex',
        'size_stage',
        'water_type',
        'min_tank_liters',
        'temp_min',
        'temp_max',
        'ph_min',
        'ph_max',
        'care_level',
        'temperament',
        'diet_type',
        'breeding_origin',
    ];

    protected function casts(): array
    {
        return [
            'min_tank_liters' => 'integer',
            'temp_min' => 'float',
            'temp_max' => 'float',
            'ph_min' => 'float',
            'ph_max' => 'float',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
