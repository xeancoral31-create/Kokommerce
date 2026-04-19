<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\Order;

class SellerOrderController extends Controller
{
    public function index()
    {
        $today = \Carbon\Carbon::today();
        
        $todayRevenue = Order::whereDate('created_at', $today)->sum('total_amount');
        
        $totalOrders = Order::count();
        $completedOrders = Order::where('status', 'Delivered')->count();
        $fulfillmentRate = $totalOrders > 0 ? round(($completedOrders / $totalOrders) * 100, 1) : 100;
        
        return Inertia::render('Seller/SellerOrders', [
            'orders' => Order::with('buyer')->latest()->get(),
            'stats' => [
                'today_revenue' => (float) $todayRevenue,
                'avg_prep_time' => '14.2 min', // Simulated metric based on workflow
                'fulfillment_rate' => $fulfillmentRate . '%'
            ]
        ]);
    }
}

