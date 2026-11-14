<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Order;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        $recentOrders = Order::with(['store', 'items.product'])
            ->where('buyer_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        $orderStats = [
            'pending' => Order::where('buyer_id', $user->id)->where('status', 'pending_payment')->count(),
            'processing' => Order::where('buyer_id', $user->id)->whereIn('status', ['awaiting_confirmation', 'processing'])->count(),
            'shipped' => Order::where('buyer_id', $user->id)->where('status', 'shipped')->count(),
            'delivered' => Order::where('buyer_id', $user->id)->where('status', 'delivered')->count(),
        ];

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'recentOrders' => $recentOrders,
            'orderStats' => $orderStats,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
