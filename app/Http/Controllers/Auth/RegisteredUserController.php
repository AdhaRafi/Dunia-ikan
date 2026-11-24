<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\TurnstileVerifier;
use App\Support\ContactValidation;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request, TurnstileVerifier $turnstileVerifier): RedirectResponse
    {
        $turnstileVerifier->verifyOrFail($request, 'signup');

        $request->merge([
            'email' => ContactValidation::normalizeEmail($request->input('email')),
            'phone' => ContactValidation::normalizePhone($request->input('phone')),
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ContactValidation::emailRules(),
            'phone' => ContactValidation::phoneRules(),
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'account_type' => 'nullable|in:buyer,seller',
            'seller_store_name' => 'required_if:account_type,seller|nullable|string|max:120',
            'seller_application_note' => 'nullable|string|max:500',
        ], [
            ...ContactValidation::messages(),
            'seller_store_name.required_if' => 'Nama rencana toko atau farm wajib diisi jika mendaftar sebagai penjual.',
        ]);

        $wantsSeller = ($validated['account_type'] ?? 'buyer') === 'seller';
        $note = trim((string) ($validated['seller_application_note'] ?? ''));

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'role' => 'buyer',
            'seller_status' => $wantsSeller ? 'pending' : 'none',
            'seller_store_name' => $wantsSeller ? trim((string) $validated['seller_store_name']) : null,
            'seller_application_note' => $wantsSeller && $note !== '' ? $note : null,
            'password' => Hash::make($validated['password']),
        ]);

        event(new Registered($user));

        Auth::login($user);

        if ($wantsSeller) {
            return redirect(route('dashboard', absolute: false))
                ->with('success', 'Akun berhasil dibuat! Pengajuan akun penjual Anda sedang menunggu verifikasi admin.');
        }

        return redirect(route('dashboard', absolute: false));
    }
}
