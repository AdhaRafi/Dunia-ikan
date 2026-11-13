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
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('fish_type', 'like', "%{$search}%")
                    ->orWhere('symptoms', 'like', "%{$search}%")
                    ->orWhere('care_instructions', 'like', "%{$search}%");
            });
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        $guides = $query->latest()->paginate(9)->withQueryString();
        $categories = FishGuide::where('is_active', true)->distinct()->pluck('category');

        return Inertia::render('Guides/Index', [
            'guides' => $guides,
            'categories' => $categories,
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
