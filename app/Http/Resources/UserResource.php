<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $avatarUrl = $this->avatar_url;

        if (is_string($avatarUrl) && $avatarUrl !== '' && ! str_starts_with($avatarUrl, 'http')) {
            $avatarUrl = url($avatarUrl);
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role,
            'seller_status' => $this->seller_status,
            'avatar_url' => $avatarUrl,
            'store' => new StoreResource($this->whenLoaded('store')),
        ];
    }
}
