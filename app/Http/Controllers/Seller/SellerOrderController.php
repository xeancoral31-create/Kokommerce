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
        // Standardized Real-time Revenue Detection
        // Fetched from Order model, excluding cancelled orders for system-wide consistency
        $allActiveOrders = Order::where('status', '!=', 'Cancelled')->get();
        $totalOrders = $allActiveOrders->count();
        $totalRevenue = $allActiveOrders->sum('total_amount');
        
        $todayRevenue = $allActiveOrders->filter(fn($o) => $o->created_at->isToday())->sum('total_amount');
        $yesterdayRevenue = $allActiveOrders->filter(fn($o) => $o->created_at->isYesterday())->sum('total_amount');
        
        // Fulfillment Rate: Percentage of non-cancelled orders that are already 'Completed'
        $completedOrdersCount = $allActiveOrders->filter(fn($o) => $o->status === 'Completed')->count();
        $fulfillmentRate = $allActiveOrders->count() > 0 ? round(($completedOrdersCount / $allActiveOrders->count()) * 100, 1) : 0;
        
        // Calculate Average Prep Time (Time from 'Created' to 'Completed')
        // Only for orders completed in the last 30 days to keep it relevant
        $completedOrders = Order::where('status', 'Completed')
            ->where('updated_at', '>=', now()->subDays(30))
            ->get();
            
        $totalMinutes = 0;
        $countForPrep = 0;
        foreach ($completedOrders as $order) {
            $diff = $order->updated_at->diffInMinutes($order->created_at);
            if ($diff > 0) {
                $totalMinutes += $diff;
                $countForPrep++;
            }
        }
        $avgPrepTimeValue = $countForPrep > 0 ? round($totalMinutes / $countForPrep, 1) : 0;

        $orders = Order::with(['buyer', 'orderItems.product'])->latest()->get()->map(function($order) {
            if ($order->buyer) {
                $user = \App\Models\User::where('email', $order->buyer->email)->first();
                $order->buyer->profile_image = $user && $user->image 
                    ? $user->image 
                    : 'https://i.pravatar.cc/100?u=' . urlencode($order->buyer->name);
            }
            return $order;
        });

        $revenueDiff = $yesterdayRevenue > 0 ? (($todayRevenue - $yesterdayRevenue) / $yesterdayRevenue) * 100 : ($todayRevenue > 0 ? 100 : 0);
        $revenueChange = ($revenueDiff >= 0 ? '+' : '') . round($revenueDiff, 1) . '% activity vs yesterday';

        return Inertia::render('Seller/SellerOrders', [
            'orders' => $orders,
            'stats' => [
                'total_revenue' => (float)$totalRevenue,
                'today_revenue' => (float) $todayRevenue,
                'revenue_change' => $revenueChange,
                'avg_prep_time' => $totalOrders > 0 ? ($avgPrepTimeValue >= 60 ? round($avgPrepTimeValue/60, 1) . 'h' : round($avgPrepTimeValue) . 'm') : 'No data yet',
                'fulfillment_rate' => $totalOrders > 0 ? $fulfillmentRate . '%' : 'No data yet'
            ]
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|string|in:Pending,Preparing,Out for Delivery,Completed'
        ]);

        $order->update([
            'status' => $request->status
        ]);

        return redirect()->back();
    }
}

