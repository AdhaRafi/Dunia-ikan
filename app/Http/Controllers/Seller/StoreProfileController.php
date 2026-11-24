<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Http\Controllers\HomeController;
use App\Models\Store;
use App\Support\ContactValidation;
use App\Support\MediaStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

        return Inertia::render('Seller/Store/Create', [
            'verificationStatus' => $user->seller_status ?? 'none',
            'pendingStoreName' => $user->seller_store_name,
            'applicationNote' => $user->seller_application_note,
            'reviewedAt' => $user->seller_reviewed_at?->toISOString(),
        ]);
    }

    public function registerStore(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->store) {
            return redirect()->route('seller.store.edit');
        }

        // Buyers must be approved by an admin before creating an active store.
        if (! $user->isSeller() && ! $user->isAdmin()) {
            if ($user->isPendingSeller()) {
                return back()->with('error', 'Pengajuan akun penjual Anda sedang menunggu verifikasi admin.');
            }

            $request->merge([
                'phone' => ContactValidation::normalizePhone($request->input('phone', $user->phone)),
            ]);

            $application = $request->validate([
                'seller_store_name' => 'required|string|max:120',
                'phone' => ContactValidation::phoneRules(),
                'seller_application_note' => 'nullable|string|max:500',
            ], [
                ...ContactValidation::messages(),
                'seller_store_name.required' => 'Nama rencana toko atau farm wajib diisi.',
            ]);

            $note = trim((string) ($application['seller_application_note'] ?? ''));

            $user->update([
                'phone' => $application['phone'],
                'seller_status' => 'pending',
                'seller_store_name' => trim((string) $application['seller_store_name']),
                'seller_application_note' => $note !== '' ? $note : null,
                'seller_reviewed_at' => null,
            ]);

            return redirect()->route('seller.store.create')
                ->with('success', 'Pengajuan akun penjual berhasil dikirim! Mohon tunggu persetujuan admin.');
        }

        $request->merge([
            'phone' => ContactValidation::normalizePhone($request->input('phone')),
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:stores,name',
            'city' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'address' => 'required|string|max:500',
            'phone' => ContactValidation::phoneRules(),
            'description' => 'nullable|string|max:1000',
            'doa_policy' => 'nullable|string|max:1000',
            'bank_name' => 'nullable|string|max:50',
            'bank_account_number' => 'nullable|string|max:50',
            'bank_account_name' => 'nullable|string|max:100',
        ], ContactValidation::messages());

        $slug = Str::slug($validated['name']);

        Store::create([
            'user_id' => $user->id,
            'slug' => $slug,
            ...$validated,
        ]);

        HomeController::flushCatalogCache();

        return redirect()->route('seller.products.index')
            ->with('success', 'Selamat! Toko Anda berhasil didaftarkan di Dunia Ikan.');
    }

    public function edit(Request $request): Response|RedirectResponse
    {
        $store = $request->user()->store;

        if (! $store) {
            return redirect()->route('seller.store.create');
        }

        $store->makeVisible([
            'bank_name',
            'bank_account_number',
            'bank_account_name',
            'qris_image',
            'address',
        ]);

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

        $request->merge([
            'phone' => ContactValidation::normalizePhone($request->input('phone')),
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:stores,name,'.$store->id,
            'city' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'address' => 'required|string|max:500',
            'phone' => ContactValidation::phoneRules(),
            'description' => 'nullable|string|max:1000',
            'doa_policy' => 'nullable|string|max:1000',
            'bank_name' => 'nullable|string|max:50',
            'bank_account_number' => 'nullable|string|max:50',
            'bank_account_name' => 'nullable|string|max:100',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'remove_logo' => 'nullable|boolean',
            'qris_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ], ContactValidation::messages());

        if ($request->hasFile('logo')) {
            MediaStorage::delete($store->logo);
            $validated['logo'] = MediaStorage::store($request->file('logo'), 'stores/logos');
        } elseif ($request->boolean('remove_logo')) {
            MediaStorage::delete($store->logo);
            $validated['logo'] = null;
        } else {
            unset($validated['logo']);
        }

        unset($validated['remove_logo']);

        if ($request->hasFile('qris_image')) {
            MediaStorage::delete($store->qris_image);
            $validated['qris_image'] = MediaStorage::store($request->file('qris_image'), 'stores/qris');
        } else {
            unset($validated['qris_image']);
        }

        $validated['slug'] = Str::slug($validated['name']);

        $store->update($validated);
        HomeController::flushCatalogCache();

        return back()->with('success', 'Profil toko dan kebijakan garansi (DOA) berhasil disimpan.');
    }
}
