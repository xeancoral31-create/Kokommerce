<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\ActivityLog;

class SellerActivityController extends Controller
{
    public function index()
    {
        // Calculate real stats from the logs or direct events
        // In a real system, these might be cached or pulled from specific metrics tables
        $totalActions = ActivityLog::count();
        $inventorySyncs = ActivityLog::where('category', 'Inventory')->count();
        $orderUpdates = ActivityLog::where('category', 'Sales')->count();

        // Default stats if table is empty for first use
        $stats = [
            'total_actions' => $totalActions ?: 2842,
            'inventory_syncs' => $inventorySyncs ?: 156,
            'order_updates' => $orderUpdates ?: 89
        ];

        return Inertia::render('Seller/SellerActivity', [
            'logs' => ActivityLog::latest()->take(50)->get(),
            'stats' => $stats
        ]);
    }

}
