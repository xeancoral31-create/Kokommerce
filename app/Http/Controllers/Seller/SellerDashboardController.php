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

        // --- Trend Data Generation ---
        
        // 1. Hourly (Today)
        $hourlyTrend = array_fill(0, 24, 0);
        Order::whereDate('created_at', now())->get()->each(function($order) use (&$hourlyTrend) {
            $hourlyTrend[$order->created_at->hour]++;
        });

        // 2. Daily (Last 7 Days)
        $dailyTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dailyTrend[] = [
                'label' => $date->format('D'),
                'orders' => Order::whereDate('created_at', $date->toDateString())->count(),
                'revenue' => (float)Order::whereDate('created_at', $date->toDateString())->sum('total_amount'),
            ];
        }

        // 3. Weekly (Last 4 Weeks)
        $weeklyTrend = [];
        for ($i = 3; $i >= 0; $i--) {
            $start = now()->subWeeks($i)->startOfWeek();
            $end = now()->subWeeks($i)->endOfWeek();
            $weeklyTrend[] = [
                'label' => 'Week ' . (4 - $i),
                'orders' => Order::whereBetween('created_at', [$start, $end])->count(),
                'revenue' => (float)Order::whereBetween('created_at', [$start, $end])->sum('total_amount'),
            ];
        }

        // 4. Monthly (Last 6 Months)
        $monthlyTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthlyTrend[] = [
                'label' => $date->format('M'),
                'orders' => Order::whereYear('created_at', $date->year)->whereMonth('created_at', $date->month)->count(),
                'revenue' => (float)Order::whereYear('created_at', $date->year)->whereMonth('created_at', $date->month)->sum('total_amount'),
            ];
        }

        // Normalize values for chart visualization (0-100 scale)
        $normalize = function($data) {
            $max = collect($data)->max('orders');
            return array_map(function($item) use ($max) {
                $item['value'] = $max > 0 ? ($item['orders'] / $max) * 100 : 5;
                if ($item['orders'] > 0 && $item['value'] < 15) $item['value'] = 15;
                return $item;
            }, $data);
        };

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
            'trend_data' => [
                'hourly' => array_map(fn($count, $hr) => [
                    'label' => $hr % 6 === 0 ? ($hr === 0 ? '12AM' : ($hr === 12 ? '12PM' : ($hr > 12 ? $hr-12 : $hr) . ($hr >= 12 ? 'PM' : 'AM'))) : '',
                    'fullLabel' => ($hr === 0 ? '12 AM' : ($hr === 12 ? '12 PM' : ($hr > 12 ? $hr-12 : $hr) . ($hr >= 12 ? ' PM' : ' AM'))),
                    'orders' => $count,
                    'value' => $count > 0 ? min($count * 20, 100) : 5
                ], $hourlyTrend, array_keys($hourlyTrend)),
                'daily' => $normalize($dailyTrend),
                'weekly' => $normalize($weeklyTrend),
                'monthly' => $normalize($monthlyTrend),
            ],
            'top_products' => Product::withCount(['orderItems as total_sold' => function($q) {
                $q->select(\DB::raw('SUM(quantity)'));
            }])->orderByDesc('total_sold')->take(3)->get(),
            'urgent_orders' => $urgentOrders,
            'activity_logs' => \App\Models\ActivityLog::latest()->take(50)->get()
        ]);
    }
}
