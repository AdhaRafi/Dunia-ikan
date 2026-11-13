<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FishGuide;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GuideController extends Controller
{
    public function index(Request $request): Response
    {
        $query = FishGuide::query();

        if ($search = $request->input('q')) {
            $query->where('title', 'like', "%{$search}%")
                ->orWhere('fish_type', 'like', "%{$search}%")
                ->orWhere('symptoms', 'like', "%{$search}%");
        }

        $guides = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Guides/Index', [
            'guides' => $guides,
            'filters' => $request->only(['q']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'fish_type' => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'symptoms' => 'required|string',
            'possible_causes' => 'required|string',
            'care_instructions' => 'required|string',
            'prevention' => 'nullable|string',
            'source' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        FishGuide::create([
            ...$validated,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', 'Panduan kesehatan ikan baru berhasil ditambahkan.');
    }

    public function update(Request $request, FishGuide $guide): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'fish_type' => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'symptoms' => 'required|string',
            'possible_causes' => 'required|string',
            'care_instructions' => 'required|string',
            'prevention' => 'nullable|string',
            'source' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $guide->update([
            ...$validated,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', 'Panduan kesehatan ikan berhasil diperbarui.');
    }

    public function toggleActive(FishGuide $guide): RedirectResponse
    {
        $guide->update(['is_active' => ! $guide->is_active]);

        return back()->with('success', 'Status panduan berhasil diubah menjadi '.($guide->is_active ? 'Aktif' : 'Non-aktif').'.');
    }

    public function destroy(FishGuide $guide): RedirectResponse
    {
        $guide->delete();

        return back()->with('success', 'Panduan kesehatan ikan berhasil dihapus.');
    }
}
