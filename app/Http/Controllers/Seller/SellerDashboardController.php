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
        $totalRevenue = Order::where('status', 'Delivered')->sum('total_amount');
        $activeOrders = Order::whereIn('status', ['Pending', 'Preparing', 'Out for Delivery'])->count();
        $newCustomers = User::where('role', 'customer')->count();
        $lowStockCount = Product::where('stock', '<=', 8)->count();

        $urgentOrders = Order::whereIn('status', ['Pending', 'Preparing'])
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        return Inertia::render('Seller/SellerDashboard', [
            'stats' => [
                'total_revenue' => (float)$totalRevenue,
                'active_orders' => $activeOrders,
                'low_stock_alerts' => $lowStockCount,
                'new_customers' => $newCustomers
            ],
            'recent_sales' => [
                ['day' => 'Mon', 'value' => 25],
                ['day' => 'Tue', 'value' => 45],
                ['day' => 'Wed', 'value' => 38],
                ['day' => 'Thu', 'value' => 75],
                ['day' => 'Fri', 'value' => 32],
                ['day' => 'Sat', 'value' => 60],
                ['day' => 'Sun', 'value' => 88],
            ],
            'top_products' => Product::take(3)->get(['id', 'name', 'price', 'stock', 'image', 'is_featured']),
            'urgent_orders' => $urgentOrders
        ]);
    }
}
