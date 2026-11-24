<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Product */
class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $imageUrl = null;

        if (is_string($this->image) && $this->image !== '') {
            if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://')) {
                $imageUrl = $this->image;
            } elseif (str_starts_with($this->image, '/')) {
                $imageUrl = url($this->image);
            } else {
                $imageUrl = url('/storage/'.ltrim($this->image, '/'));
            }
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (float) $this->price,
            'stock' => (int) $this->stock,
            'views' => (int) $this->views,
            'image_url' => $imageUrl,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'store' => new StoreResource($this->whenLoaded('store')),
            'fish_detail' => new FishDetailResource($this->whenLoaded('fishDetail')),
        ];
    }
}
