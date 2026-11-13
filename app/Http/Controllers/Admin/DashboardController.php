<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FishGuide;
use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'totalUsers' => User::count(),
            'totalStores' => Store::count(),
            'totalProducts' => Product::count(),
            'totalOrders' => Order::count(),
            'totalRevenue' => Order::where('payment_status', 'verified')->sum('grand_total'),
            'totalGuides' => FishGuide::count(),
        ];

        $recentOrders = Order::with(['buyer:id,name', 'store:id,name'])
            ->latest()
            ->take(8)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
        ]);
    }
}
