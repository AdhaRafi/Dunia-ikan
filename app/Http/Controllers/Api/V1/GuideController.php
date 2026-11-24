<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\FishGuideResource;
use App\Models\FishGuide;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GuideController extends Controller
{
    /**
     * List active fish care guides with search and category filtering.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = FishGuide::where('is_active', true);

        if ($search = trim((string) $request->input('q'))) {
            $query->where(function ($q) use ($search): void {
                $q->whereLike('title', "%{$search}%")
                    ->orWhereLike('fish_type', "%{$search}%")
                    ->orWhereLike('category', "%{$search}%")
                    ->orWhereLike('symptoms', "%{$search}%")
                    ->orWhereLike('possible_causes', "%{$search}%")
                    ->orWhereLike('care_instructions', "%{$search}%");
            });
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        $perPage = max(1, min(30, $request->integer('per_page', 12)));
        $guides = $query->latest()->paginate($perPage)->withQueryString();

        $categoryCounts = FishGuide::where('is_active', true)
            ->selectRaw('category, count(*) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        return FishGuideResource::collection($guides)->additional([
            'categories' => $categoryCounts->keys()->values(),
            'category_counts' => $categoryCounts,
            'total_guides' => (int) $categoryCounts->sum(),
        ]);
    }

    /**
     * Show a single active fish care guide with related guides.
     */
    public function show(int $id): JsonResponse
    {
        $guide = FishGuide::where('is_active', true)->findOrFail($id);

        $relatedGuides = FishGuide::where('is_active', true)
            ->where('id', '!=', $guide->id)
            ->where(function ($q) use ($guide): void {
                $q->where('category', $guide->category)
                    ->orWhere('fish_type', $guide->fish_type);
            })
            ->take(3)
            ->get();

        return response()->json([
            'guide' => new FishGuideResource($guide),
            'related_guides' => FishGuideResource::collection($relatedGuides),
        ]);
    }
}
