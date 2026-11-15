<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        $canUseDemoAccounts = app()->environment(['local', 'testing']);

        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'canUseDemoAccounts' => $canUseDemoAccounts,
            'demoAccounts' => $canUseDemoAccounts ? [
                [
                    'role' => 'buyer',
                    'label' => 'Pembeli',
                    'label_en' => 'Buyer',
                    'email' => 'pembeli@duniaikan.test',
                    'password' => 'password',
                ],
                [
                    'role' => 'seller',
                    'label' => 'Penjual',
                    'label_en' => 'Seller',
                    'email' => 'penjual1@duniaikan.test',
                    'password' => 'password',
                ],
            ] : [],
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        if (! Auth::guard('admin')->check()) {
            $request->session()->invalidate();
        } else {
            $request->session()->regenerate();
        }

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
