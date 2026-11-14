<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class StoreProfileController extends Controller
{
    public function create(): Response|RedirectResponse
    {
        $user = auth()->user();
        if ($user->store) {
            return redirect()->route('seller.store.edit');
        }

        return Inertia::render('Seller/Store/Create');
    }

    public function registerStore(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->store) {
            return redirect()->route('seller.store.edit');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:stores,name',
            'city' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'address' => 'required|string|max:500',
            'phone' => 'required|string|max:20',
            'description' => 'nullable|string|max:1000',
            'doa_policy' => 'nullable|string|max:1000',
            'bank_name' => 'nullable|string|max:50',
            'bank_account_number' => 'nullable|string|max:50',
            'bank_account_name' => 'nullable|string|max:100',
        ]);

        $slug = Str::slug($validated['name']);

        $store = Store::create([
            'user_id' => $user->id,
            'slug' => $slug,
            ...$validated,
        ]);

        // Upgrade role to seller jika belum
        if ($user->role === 'buyer') {
            $user->update(['role' => 'seller']);
        }

        return redirect()->route('seller.products.index')
            ->with('success', 'Selamat! Toko Anda berhasil didaftarkan di Dunia Ikan.');
    }

    public function edit(Request $request): Response
    {
        $store = $request->user()->store;

        if (! $store) {
            return redirect()->route('seller.store.create');
        }

        return Inertia::render('Seller/Store/Edit', [
            'store' => $store,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $store = $request->user()->store;

        if (! $store) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:stores,name,'.$store->id,
            'city' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'address' => 'required|string|max:500',
            'phone' => 'required|string|max:20',
            'description' => 'nullable|string|max:1000',
            'doa_policy' => 'nullable|string|max:1000',
            'bank_name' => 'nullable|string|max:50',
            'bank_account_number' => 'nullable|string|max:50',
            'bank_account_name' => 'nullable|string|max:100',
            'logo' => 'nullable|image|max:2048',
            'remove_logo' => 'nullable|boolean',
            'qris_image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            if ($store->logo && Storage::disk('public')->exists($store->logo)) {
                Storage::disk('public')->delete($store->logo);
            }
            $validated['logo'] = $request->file('logo')->store('stores/logos', 'public');
        } elseif ($request->boolean('remove_logo')) {
            if ($store->logo && Storage::disk('public')->exists($store->logo)) {
                Storage::disk('public')->delete($store->logo);
            }
            $validated['logo'] = null;
        } else {
            unset($validated['logo']);
        }

        unset($validated['remove_logo']);

        if ($request->hasFile('qris_image')) {
            if ($store->qris_image && Storage::disk('public')->exists($store->qris_image)) {
                Storage::disk('public')->delete($store->qris_image);
            }
            $validated['qris_image'] = $request->file('qris_image')->store('stores/qris', 'public');
        } else {
            unset($validated['qris_image']);
        }

        $validated['slug'] = Str::slug($validated['name']);

        $store->update($validated);

        return back()->with('success', 'Profil toko dan kebijakan garansi (DOA) berhasil disimpan.');
    }
}
