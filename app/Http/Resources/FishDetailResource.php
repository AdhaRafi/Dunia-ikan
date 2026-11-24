<?php

namespace App\Http\Resources;

use App\Models\FishDetail;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin FishDetail */
class FishDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'species_name' => $this->species_name,
            'morph_trait' => $this->morph_trait,
            'sex' => $this->sex,
            'size_stage' => $this->size_stage,
            'water_type' => $this->water_type,
            'min_tank_liters' => $this->min_tank_liters,
            'temp_min' => $this->temp_min,
            'temp_max' => $this->temp_max,
            'ph_min' => $this->ph_min,
            'ph_max' => $this->ph_max,
            'care_level' => $this->care_level,
            'temperament' => $this->temperament,
            'diet_type' => $this->diet_type,
            'breeding_origin' => $this->breeding_origin,
        ];
    }
}
