<?php

namespace App\Http\Resources;

use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Store */
class StoreResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $logoUrl = $this->logo_url;

        if (is_string($logoUrl) && $logoUrl !== '' && ! str_starts_with($logoUrl, 'http')) {
            $logoUrl = url($logoUrl);
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'city' => $this->city,
            'province' => $this->province,
            'phone' => $this->phone,
            'description' => $this->description,
            'doa_policy' => $this->doa_policy,
            'logo_url' => $logoUrl,
        ];
    }
}
