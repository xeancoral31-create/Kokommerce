<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SellerAnalyticsController extends Controller
{
    public function index()
    {
        // Data aggregation logic below will handle these metrics.

        // Dynamic Revenue Overview (Last 6 Months)
        // Grouping in PHP for absolute reliability across different DB drivers
        $allActiveOrders = Order::where('status', '!=', 'Cancelled')->get();
        
        $revenueOverview = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthDate = Carbon::now()->subMonths($i);
            $monthLabel = $monthDate->format('M');
            $monthNum = $monthDate->month;
            $yearNum = $monthDate->year;
            
            $monthlySum = $allActiveOrders->filter(function($o) use ($monthNum, $yearNum) {
                return $o->created_at->month === $monthNum && $o->created_at->year === $yearNum;
            })->sum('total_amount');
            
            $revenueOverview[] = [
                'month' => $monthLabel,
                'revenue' => (float)$monthlySum
            ];
        }

        // Metrics Detection
        $totalRevenue = $allActiveOrders->sum('total_amount');
        $todayRevenue = $allActiveOrders->filter(fn($o) => $o->created_at->isToday())->sum('total_amount');
        $yesterdayRevenue = $allActiveOrders->filter(fn($o) => $o->created_at->isYesterday())->sum('total_amount');
        
        $revenueDiff = $yesterdayRevenue > 0 ? (($todayRevenue - $yesterdayRevenue) / $yesterdayRevenue) * 100 : ($todayRevenue > 0 ? 100 : 0);
        $revenueChange = ($revenueDiff >= 0 ? '+' : '') . round($revenueDiff, 1) . '% activity vs yesterday';

        // Update Prep Time
        $completedOrPrepared = $allActiveOrders->filter(fn($o) => in_array($o->status, ['Preparing', 'Out for Delivery', 'Delivered']));
        $totalMinutes = 0;
        foreach ($completedOrPrepared as $order) {
            $totalMinutes += $order->updated_at->diffInMinutes($order->created_at);
        }
        $avgPrepTime = $completedOrPrepared->count() > 0 ? round($totalMinutes / $completedOrPrepared->count(), 1) : 0;

        $totalOrdersCount = $allActiveOrders->count();
        $completedCount = $allActiveOrders->filter(fn($o) => in_array($o->status, ['Out for Delivery', 'Delivered']))->count();
        $fulfillmentRate = $totalOrdersCount > 0 ? round(($completedCount / $totalOrdersCount) * 100, 1) : 0;

        // Deep Data Mining for Categories and Products
        $orders = Order::all();
        $categorySales = [];
        $productSales = [];
        $hourlyActivity = array_fill(0, 24, 0);
        
        foreach ($orders as $order) {
            $hourlyActivity[$order->created_at->hour]++;
            $items = $order->items_data;
            if ($items && is_array($items)) {
                foreach ($items as $item) {
                    $catName = $item['category'] ?? 'Artisanal';
                    $price = (float)($item['price'] ?? 0);
                    $qty = (int)($item['quantity'] ?? 1);
                    
                    $categorySales[$catName] = ($categorySales[$catName] ?? 0) + ($price * $qty);
                    
                    $prodName = $item['name'] ?? 'Unknown Collection';
                    if (!isset($productSales[$prodName])) {
                        $productSales[$prodName] = [
                            'name' => $prodName,
                            'units_sold' => 0,
                            'revenue' => 0
                        ];
                    }
                    $productSales[$prodName]['units_sold'] += $qty;
                    $productSales[$prodName]['revenue'] += ($price * $qty);
                }
            }
        }

        // Finalize Bestselling
        usort($productSales, fn($a, $b) => $b['revenue'] <=> $a['revenue']);
        $bestselling = array_slice($productSales, 0, 3);
        foreach ($bestselling as &$p) {
            $p['status'] = $p['revenue'] > 2000 ? 'Top Performer' : ($p['revenue'] > 1000 ? 'Steady Demand' : 'Trending up');
        }

        // Fallback for Bestselling if no sales: Use products from DB
        if (empty($bestselling)) {
            $realProducts = Product::latest()->take(3)->get();
            foreach ($realProducts as $rp) {
                $bestselling[] = [
                    'name' => $rp->name,
                    'units_sold' => 0,
                    'revenue' => 0,
                    'status' => 'New Addition'
                ];
            }
        }

        // Category Perf: Use real categories from DB and match against normalized sales
        $allCategories = Category::all();
        $categoryPerf = [];
        $totalItemsSold = 0;

        foreach ($allCategories as $cat) {
            $normalizedName = ucfirst(strtolower($cat->name));
            $salesValue = $categorySales[$normalizedName] ?? 0;
            
            $categoryPerf[] = [
                'name' => $cat->name,
                'items_sold' => 0, // We will fill this in a second pass or just use revenue
                'revenue' => $salesValue,
                'product_count' => Product::where('category_id', $cat->id)->count()
            ];
        }

        // Second pass to fill volume (pila ka item) correctly with smart detection
        foreach ($orders as $order) {
            $items = $order->items_data;
            if ($items && is_array($items)) {
                foreach ($items as $item) {
                    $catName = $item['category'] ?? null;
                    $prodId = $item['id'] ?? null;
                    if (!$catName && $prodId) {
                        $p = Product::find($prodId);
                        if ($p && $p->category) $catName = $p->category->name;
                    }
                    if (!$catName) $catName = 'Artisanal';
                    
                    foreach ($categoryPerf as &$cp) {
                        if (strtolower($cp['name']) === strtolower($catName)) {
                            $cp['items_sold'] += ($item['quantity'] ?? 1);
                            $totalItemsSold += ($item['quantity'] ?? 1);
                        }
                    }
                }
            }
        }

        // Calculate percentages based on item volume (or revenue if you prefer, but "pila ka item" suggests volume)
        foreach ($categoryPerf as &$cp) {
            $cp['percentage'] = $totalItemsSold > 0 ? round(($cp['items_sold'] / $totalItemsSold) * 100) : 0;
        }

        // If no sales, distribute by product inventory count as a baseline
        if ($totalItemsSold === 0) {
            $totalProducts = Product::count();
            foreach ($categoryPerf as &$cp) {
                $cp['percentage'] = $totalProducts > 0 ? round(($cp['product_count'] / $totalProducts) * 100) : 0;
            }
        }

        // Customer Insights Logic
        $allCustomers = User::where('role', 'buyer')->count();
        $ordersCount = Order::count();
        $uniqueBuyers = Order::distinct('buyer_id')->count('buyer_id');
        $returningCustomers = Order::select('buyer_id')->groupBy('buyer_id')->havingRaw('count(*) > 1')->count();
        
        $retentionRate = $uniqueBuyers > 0 ? round(($returningCustomers / $uniqueBuyers) * 100) : 0;
        $avgRepeat = $uniqueBuyers > 0 ? round($ordersCount / $uniqueBuyers, 1) : 0;

        // Peak Hours Logic
        $peakHourValue = max($hourlyActivity);
        $peakHour = $peakHourValue > 0 ? array_search($peakHourValue, $hourlyActivity) : 9;
        $peakPeriod = Carbon::createFromTime($peakHour)->format('gA') . ' - ' . Carbon::createFromTime(($peakHour + 2) % 24)->format('gA') . ' Peak';

        return Inertia::render('Seller/SellerAnalytics', [
            'metrics' => [
                'total_revenue' => (float)$totalRevenue,
                'today_revenue' => (float)$todayRevenue,
                'avg_prep_time' => $avgPrepTime, 
                'fulfillment_rate' => $fulfillmentRate,
                'revenue_change' => $revenueChange,
            ],
            'revenue_overview' => $revenueOverview,
            'category_performance' => $categoryPerf,
            'bestselling_products' => $bestselling,
            'customer_insights' => [
                'peak_hours' => ['6AM', '12PM', '6PM', '12AM'],
                'peak_period' => $peakPeriod,
                'retention_rate' => $retentionRate . '%',
                'repeat_purchases' => $avgRepeat . ' avg/month',
                'raw_customer_count' => $allCustomers,
                'hourly_activity' => $hourlyActivity
            ],
            'activity_logs' => \App\Models\ActivityLog::latest()->take(10)->get()
        ]);
    }
}
