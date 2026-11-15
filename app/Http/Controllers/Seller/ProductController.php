<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\FishDetail;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $store = $request->user()->store;
        if (! $store) {
            return redirect()->route('seller.store.create');
        }

        $products = Product::with(['category', 'fishDetail'])
            ->where('store_id', $store->id)
            ->latest()
            ->paginate(15);

        return Inertia::render('Seller/Products/Index', [
            'store' => $store,
            'products' => $products,
        ]);
    }

    public function create(Request $request): Response|RedirectResponse
    {
        $store = $request->user()->store;
        if (! $store) {
            return redirect()->route('seller.store.create');
        }

        $categories = Category::all();

        return Inertia::render('Seller/Products/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $store = $request->user()->store;
        if (! $store) {
            abort(403);
        }

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:200',
            'description' => 'required|string',
            'price' => 'required|numeric|min:1000',
            'stock' => 'required|integer|min:0',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3072',
            'image_url' => 'nullable|url:http,https|max:500',
            'is_active' => 'boolean',

            // Atribut Khusus Ikan (MorphMarket-inspired traits)
            'is_fish' => 'boolean',
            'species_name' => 'nullable|string|max:150',
            'morph_trait' => 'nullable|string|max:150',
            'sex' => 'nullable|in:male,female,pair,unsexed',
            'size_stage' => 'nullable|string|max:100',
            'water_type' => 'nullable|in:freshwater,saltwater,brackish',
            'min_tank_liters' => 'nullable|integer|min:1',
            'temp_min' => 'nullable|numeric|between:10,40',
            'temp_max' => 'nullable|numeric|between:10,40',
            'ph_min' => 'nullable|numeric|between:3,10',
            'ph_max' => 'nullable|numeric|between:3,10',
            'care_level' => 'nullable|in:pemula,menengah,mahir',
            'temperament' => 'nullable|in:damai,semi-agresif,agresif,predator',
            'diet_type' => 'nullable|string|max:100',
            'breeding_origin' => 'nullable|in:captive_bred,farm_raised,wild_caught',
        ]);

        $imagePath = $validated['image_url'] ?? null;
        if ($request->hasFile('image_file')) {
            $imagePath = '/storage/'.$request->file('image_file')->store('products', 'public');
        }

        $slug = Str::slug($validated['name']).'-'.Str::random(5);

        $product = Product::create([
            'store_id' => $store->id,
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'image' => $imagePath,
            'is_active' => $request->boolean('is_active', true),
        ]);

        // Simpan metadata ikan jika kategori ikan atau ditandai sebagai ikan
        if ($request->boolean('is_fish') || $validated['species_name'] || $validated['morph_trait']) {
            FishDetail::create([
                'product_id' => $product->id,
                'species_name' => $validated['species_name'] ?? null,
                'morph_trait' => $validated['morph_trait'] ?? null,
                'sex' => $validated['sex'] ?? 'unsexed',
                'size_stage' => $validated['size_stage'] ?? null,
                'water_type' => $validated['water_type'] ?? 'freshwater',
                'min_tank_liters' => $validated['min_tank_liters'] ?? null,
                'temp_min' => $validated['temp_min'] ?? null,
                'temp_max' => $validated['temp_max'] ?? null,
                'ph_min' => $validated['ph_min'] ?? null,
                'ph_max' => $validated['ph_max'] ?? null,
                'care_level' => $validated['care_level'] ?? 'pemula',
                'temperament' => $validated['temperament'] ?? 'damai',
                'diet_type' => $validated['diet_type'] ?? null,
                'breeding_origin' => $validated['breeding_origin'] ?? 'captive_bred',
            ]);
        }

        return redirect()->route('seller.products.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    public function edit(Request $request, Product $product): Response|RedirectResponse
    {
        $store = $request->user()->store;
        if (! $store || $product->store_id !== $store->id) {
            abort(403, 'Anda tidak memiliki hak akses untuk produk ini.');
        }

        $product->load('fishDetail');
        $categories = Category::all();

        return Inertia::render('Seller/Products/Edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $store = $request->user()->store;
        if (! $store || $product->store_id !== $store->id) {
            abort(403);
        }

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:200',
            'description' => 'required|string',
            'price' => 'required|numeric|min:1000',
            'stock' => 'required|integer|min:0',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3072',
            'image_url' => 'nullable|url:http,https|max:500',
            'is_active' => 'boolean',

            'is_fish' => 'boolean',
            'species_name' => 'nullable|string|max:150',
            'morph_trait' => 'nullable|string|max:150',
            'sex' => 'nullable|in:male,female,pair,unsexed',
            'size_stage' => 'nullable|string|max:100',
            'water_type' => 'nullable|in:freshwater,saltwater,brackish',
            'min_tank_liters' => 'nullable|integer|min:1',
            'temp_min' => 'nullable|numeric|between:10,40',
            'temp_max' => 'nullable|numeric|between:10,40',
            'ph_min' => 'nullable|numeric|between:3,10',
            'ph_max' => 'nullable|numeric|between:3,10',
            'care_level' => 'nullable|in:pemula,menengah,mahir',
            'temperament' => 'nullable|in:damai,semi-agresif,agresif,predator',
            'diet_type' => 'nullable|string|max:100',
            'breeding_origin' => 'nullable|in:captive_bred,farm_raised,wild_caught',
        ]);

        $imagePath = $product->image;
        if ($request->hasFile('image_file')) {
            $imagePath = '/storage/'.$request->file('image_file')->store('products', 'public');
        } elseif (! empty($validated['image_url'])) {
            $imagePath = $validated['image_url'];
        }

        $product->update([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'image' => $imagePath,
            'is_active' => $request->boolean('is_active', true),
        ]);

        if ($request->boolean('is_fish') || $validated['species_name'] || $validated['morph_trait']) {
            FishDetail::updateOrCreate(
                ['product_id' => $product->id],
                [
                    'species_name' => $validated['species_name'] ?? null,
                    'morph_trait' => $validated['morph_trait'] ?? null,
                    'sex' => $validated['sex'] ?? 'unsexed',
                    'size_stage' => $validated['size_stage'] ?? null,
                    'water_type' => $validated['water_type'] ?? 'freshwater',
                    'min_tank_liters' => $validated['min_tank_liters'] ?? null,
                    'temp_min' => $validated['temp_min'] ?? null,
                    'temp_max' => $validated['temp_max'] ?? null,
                    'ph_min' => $validated['ph_min'] ?? null,
                    'ph_max' => $validated['ph_max'] ?? null,
                    'care_level' => $validated['care_level'] ?? 'pemula',
                    'temperament' => $validated['temperament'] ?? 'damai',
                    'diet_type' => $validated['diet_type'] ?? null,
                    'breeding_origin' => $validated['breeding_origin'] ?? 'captive_bred',
                ]
            );
        }

        return redirect()->route('seller.products.index')
            ->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Request $request, Product $product): RedirectResponse
    {
        $store = $request->user()->store;
        if (! $store || $product->store_id !== $store->id) {
            abort(403);
        }

        $product->delete();

        return back()->with('success', 'Produk berhasil dihapus.');
    }
}
