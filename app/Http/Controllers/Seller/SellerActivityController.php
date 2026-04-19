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
        // Real detection from the system audit log
        $totalActions = ActivityLog::count();
        $inventorySyncs = ActivityLog::where('category', 'Inventory')->count();
        $orderUpdates = ActivityLog::where('category', 'Sales')->count();

        // Growth logic (last 7 days)
        $newActionsThisWeek = ActivityLog::where('created_at', '>=', now()->subWeek())->count();
        $totalBeforeThisWeek = ActivityLog::where('created_at', '<', now()->subWeek())->count();
        $growth = $totalBeforeThisWeek > 0 
            ? round(($newActionsThisWeek / $totalBeforeThisWeek) * 100) 
            : ($newActionsThisWeek > 0 ? $newActionsThisWeek : 0);

        return Inertia::render('Seller/SellerActivity', [
            'logs' => ActivityLog::with('user')->latest()->take(50)->get(),
            'stats' => [
                'total_actions' => $totalActions,
                'inventory_syncs' => $inventorySyncs,
                'order_updates' => $orderUpdates,
                'action_growth' => ($growth > 0 ? '+' : '') . $growth . ($totalBeforeThisWeek > 0 ? '%' : '')
            ]
        ]);
    }

}
