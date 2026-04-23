<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Order;

use App\Models\User;

class SellerDashboardController extends Controller
{
    public function index()
    {
        // Real-time Revenue Detection (Standardized across Dashboard, Orders, and Analytics)
        // Includes all orders except 'Cancelled' to capture immediate buyer activity
        $allActiveOrders = Order::where('status', '!=', 'Cancelled')->get();
        
        $totalRevenue = $allActiveOrders->sum('total_amount');
        $todayRevenue = $allActiveOrders->filter(fn($o) => $o->created_at->isToday())->sum('total_amount');
        
        $activeOrders = $allActiveOrders->filter(fn($o) => in_array($o->status, ['Pending', 'Preparing', 'Out for Delivery']))->count();
        $newCustomers = User::where('role', 'buyer')->count();
        $todaySignups = User::where('role', 'buyer')->whereDate('created_at', $today ?? now())->count();
        $lowStockCount = Product::where('stock', '<=', 10)->count();
        $preOrderCount = Product::where('status', 'pre_order')->count();

        $urgentOrders = Order::whereIn('status', ['Pending', 'Preparing'])
            ->with('buyer') // Connect to buyer info
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        // Calculate dynamic recent sales/activity trend for the last 7 days
        $recentSales = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dayName = $date->format('D');
            
            // We use order count for the "Trend" height to better show "Buyer Activity" 
            // especially valuable when orders are still pending/preparing
            $orderCount = Order::whereDate('created_at', $date->toDateString())->count();
            $dailyRevenue = Order::whereDate('created_at', $date->toDateString())->sum('total_amount');
            
            $recentSales[] = [
                'day' => $dayName,
                'revenue' => (float)$dailyRevenue,
                'orders' => $orderCount,
                'value' => (float)$orderCount // Using order count for visual trend
            ];
        }

        $maxOrders = collect($recentSales)->max('orders');
        if ($maxOrders > 0) {
            foreach ($recentSales as &$sale) {
                // Scale based on orders to show buyer engagement trend
                $sale['value'] = ($sale['orders'] / $maxOrders) * 100;
                // Minimum height for visibility if there's at least one order
                if ($sale['orders'] > 0 && $sale['value'] < 15) $sale['value'] = 15;
            }
        } else {
            // Keep a subtle baseline if absolutely no data exists
            $recentSales = array_map(function($sale) {
                $sale['value'] = 5; // Minimal baseline
                return $sale;
            }, $recentSales);
        }

        // Hourly activity for "Today" view
        $hourlyActivity = array_fill(0, 24, 0);
        Order::whereDate('created_at', now())->get()->each(function($order) use (&$hourlyActivity) {
            $hourlyActivity[$order->created_at->hour]++;
        });

        return Inertia::render('Seller/SellerDashboard', [
            'stats' => [
                'total_revenue' => (float)$totalRevenue,
                'today_revenue' => (float)$todayRevenue,
                'active_orders' => $activeOrders,
                'low_stock_alerts' => $lowStockCount,
                'new_customers' => $newCustomers,
                'today_signups' => $todaySignups,
                'pre_order_count' => $preOrderCount
            ],
            'recent_sales' => $recentSales,
            'hourly_activity' => $hourlyActivity,
            'top_products' => Product::withCount(['orderItems as total_sold' => function($q) {
                $q->select(\DB::raw('SUM(quantity)'));
            }])->orderByDesc('total_sold')->take(3)->get(),
            'urgent_orders' => $urgentOrders,
            'activity_logs' => \App\Models\ActivityLog::latest()->take(8)->get()
        ]);
    }
}
