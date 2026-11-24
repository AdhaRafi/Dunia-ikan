<?php

namespace App\Http\Resources;

use App\Models\FishGuide;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin FishGuide */
class FishGuideResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'fish_type' => $this->fish_type,
            'category' => $this->category,
            'symptoms' => $this->symptoms,
            'possible_causes' => $this->possible_causes,
            'care_instructions' => $this->care_instructions,
            'prevention' => $this->prevention,
            'source' => $this->source,
        ];
    }
}
