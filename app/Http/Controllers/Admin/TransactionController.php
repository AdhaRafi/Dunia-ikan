<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Order::with(['buyer:id,name,email', 'store:id,name', 'items']);

        if ($search = $request->input('q')) {
            $query->where('order_number', 'like', "%{$search}%")
                ->orWhereHas('buyer', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                ->orWhereHas('store', fn ($q) => $q->where('name', 'like', "%{$search}%"));
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($paymentStatus = $request->input('payment_status')) {
            $query->where('payment_status', $paymentStatus);
        }

        $orders = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Transactions/Index', [
            'orders' => $orders,
            'filters' => $request->only(['q', 'status', 'payment_status']),
        ]);
    }
}
