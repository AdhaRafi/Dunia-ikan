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
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('seller_store_name', 'like', "%{$search}%");
            });
        }

        if ($role = $request->input('role')) {
            $query->where('role', $role);
        }

        if ($sellerStatus = $request->input('seller_status')) {
            $query->where('seller_status', $sellerStatus);
        }

        $users = $query
            ->orderByRaw("CASE WHEN seller_status = 'pending' THEN 0 ELSE 1 END")
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['q', 'role', 'seller_status']),
            'pendingCount' => User::where('seller_status', 'pending')->count(),
        ]);
    }

    public function approveSeller(User $user): RedirectResponse
    {
        if ($user->isAdmin()) {
            return back()->with('error', 'Akun administrator tidak memerlukan verifikasi penjual.');
        }

        $user->approveSellerApplication();

        return back()->with('success', "Pengajuan penjual {$user->name} disetujui.");
    }

    public function rejectSeller(User $user): RedirectResponse
    {
        if ($user->isAdmin()) {
            return back()->with('error', 'Akun administrator tidak dapat ditolak.');
        }

        $user->rejectSellerApplication();

        return back()->with('success', "Pengajuan penjual {$user->name} ditolak.");
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => 'required|in:buyer,seller,admin',
        ]);

        if ($user->id === $request->user()->id && $validated['role'] !== 'admin') {
            return back()->with('error', 'Anda tidak dapat menurunkan peran akun Anda sendiri.');
        }

        if ($validated['role'] === 'seller') {
            $user->approveSellerApplication();
        } else {
            $user->update([
                'role' => $validated['role'],
                'seller_status' => $user->seller_status === 'approved' ? 'none' : $user->seller_status,
            ]);
        }

        return back()->with('success', "Peran pengguna {$user->name} berhasil diubah menjadi {$validated['role']}.");
    }
}
