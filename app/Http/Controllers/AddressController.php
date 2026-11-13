<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AddressController extends Controller
{
    public function index(Request $request): Response
    {
        $addresses = Address::where('user_id', $request->user()->id)
            ->orderBy('is_primary', 'desc')
            ->latest()
            ->get();

        return Inertia::render('Addresses/Index', [
            'addresses' => $addresses,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'recipient_name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'city' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'postal_code' => 'required|string|max:10',
            'full_address' => 'required|string|max:500',
            'is_primary' => 'boolean',
        ]);

        $user = $request->user();

        if (! empty($validated['is_primary'])) {
            Address::where('user_id', $user->id)->update(['is_primary' => false]);
        } else {
            // Jika alamat pertama, otomatis set primary
            if (Address::where('user_id', $user->id)->count() === 0) {
                $validated['is_primary'] = true;
            }
        }

        Address::create([
            'user_id' => $user->id,
            ...$validated,
        ]);

        return back()->with('success', 'Alamat pengiriman berhasil ditambahkan.');
    }

    public function update(Request $request, Address $address): RedirectResponse
    {
        if ($address->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'recipient_name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'city' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'postal_code' => 'required|string|max:10',
            'full_address' => 'required|string|max:500',
            'is_primary' => 'boolean',
        ]);

        if (! empty($validated['is_primary'])) {
            Address::where('user_id', $request->user()->id)->where('id', '!=', $address->id)->update(['is_primary' => false]);
        }

        $address->update($validated);

        return back()->with('success', 'Alamat pengiriman berhasil diperbarui.');
    }

    public function destroy(Request $request, Address $address): RedirectResponse
    {
        if ($address->user_id !== $request->user()->id) {
            abort(403);
        }

        $address->delete();

        return back()->with('success', 'Alamat berhasil dihapus.');
    }

    public function setPrimary(Request $request, Address $address): RedirectResponse
    {
        if ($address->user_id !== $request->user()->id) {
            abort(403);
        }

        Address::where('user_id', $request->user()->id)->update(['is_primary' => false]);
        $address->update(['is_primary' => true]);

        return back()->with('success', 'Alamat utama berhasil diubah.');
    }
}
