<?php

namespace App\Http\Controllers;

use App\Models\FishGuide;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GuideController extends Controller
{
    public function index(Request $request): Response
    {
        $query = FishGuide::where('is_active', true);

        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
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

        $guides = $query->latest()->paginate(9)->withQueryString();
        $categoryCounts = FishGuide::where('is_active', true)
            ->selectRaw('category, count(*) as total')
            ->groupBy('category')
            ->pluck('total', 'category');
        $categories = $categoryCounts->keys()->values();

        $popularGuides = FishGuide::where('is_active', true)
            ->orderBy('id')
            ->take(3)
            ->get(['id', 'title', 'fish_type', 'category', 'symptoms'])
            ->toArray();

        return Inertia::render('Guides/Index', [
            'guides' => $guides,
            'popularGuides' => $popularGuides,
            'categories' => $categories,
            'categoryCounts' => $categoryCounts,
            'totalGuides' => $categoryCounts->sum(),
            'filters' => $request->only(['q', 'category']),
        ]);
    }

    public function show(int $id): Response
    {
        $guide = FishGuide::where('is_active', true)->findOrFail($id);

        $relatedGuides = FishGuide::where('is_active', true)
            ->where('id', '!=', $guide->id)
            ->where(function ($q) use ($guide) {
                $q->where('category', $guide->category)
                    ->orWhere('fish_type', $guide->fish_type);
            })
            ->take(3)
            ->get();

        return Inertia::render('Guides/Show', [
            'guide' => $guide,
            'relatedGuides' => $relatedGuides,
        ]);
    }
}
