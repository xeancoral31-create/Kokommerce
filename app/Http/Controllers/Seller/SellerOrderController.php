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
        
        // Calculate Fulfillment Rate
        $totalOrders = Order::count();
        $deliveredOrdersCount = Order::where('status', 'Delivered')->count();
        $fulfillmentRate = $totalOrders > 0 ? round(($deliveredOrdersCount / $totalOrders) * 100, 1) : 0;
        
        // Calculate Average Prep Time
        $deliveredOrders = Order::where('status', 'Delivered')->get();
        $totalMinutes = 0;
        foreach ($deliveredOrders as $order) {
            $totalMinutes += $order->updated_at->diffInMinutes($order->created_at);
        }
        $avgPrepTime = $deliveredOrders->count() > 0 ? round($totalMinutes / $deliveredOrders->count(), 1) : 0;

        return Inertia::render('Seller/SellerOrders', [
            'orders' => Order::with('buyer')->latest()->get(),
            'stats' => [
                'today_revenue' => (float) $todayRevenue,
                'avg_prep_time' => $avgPrepTime > 0 ? $avgPrepTime . ' min' : 'No data yet',
                'fulfillment_rate' => $fulfillmentRate > 0 ? $fulfillmentRate . '%' : 'No data yet'
            ]
        ]);
    }
}

