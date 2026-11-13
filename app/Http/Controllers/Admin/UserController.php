<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::with('store');

        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role = $request->input('role')) {
            $query->where('role', $role);
        }

        $users = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['q', 'role']),
        ]);
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => 'required|in:buyer,seller,admin',
        ]);

        if ($user->id === $request->user()->id && $validated['role'] !== 'admin') {
            return back()->with('error', 'Anda tidak dapat menurunkan peran akun Anda sendiri.');
        }

        $user->update(['role' => $validated['role']]);

        return back()->with('success', "Peran pengguna {$user->name} berhasil diubah menjadi {$validated['role']}.");
    }
}
