<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\AdminAnalyticsService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(public AdminAnalyticsService $analytics) {}

    public function index(): Response
    {
        $recentOrders = Order::with(['buyer:id,name', 'store:id,name'])
            ->latest()
            ->take(8)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            ...$this->analytics->getDashboardData(),
            'recentOrders' => $recentOrders,
        ]);
    }
}
