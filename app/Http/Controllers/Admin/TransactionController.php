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
            $query->where(function ($q) use ($search) {
                $q->whereLike('order_number', "%{$search}%")
                    ->orWhereHas('buyer', fn ($bq) => $bq->whereLike('name', "%{$search}%"))
                    ->orWhereHas('store', fn ($sq) => $sq->whereLike('name', "%{$search}%"));
            });
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
