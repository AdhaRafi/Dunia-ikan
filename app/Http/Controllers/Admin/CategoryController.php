<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::withCount('products')->get();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name',
            'description' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:50',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        Category::create($validated);

        return back()->with('success', 'Kategori baru berhasil dibuat.');
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name,'.$category->id,
            'description' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:50',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $category->update($validated);

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($category->products()->count() > 0) {
            return back()->with('error', 'Kategori tidak dapat dihapus karena memiliki produk terkait.');
        }

        $category->delete();

        return back()->with('success', 'Kategori berhasil dihapus.');
    }
}
