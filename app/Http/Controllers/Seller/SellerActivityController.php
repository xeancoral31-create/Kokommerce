<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Order;
use App\Models\User;
use App\Models\SellerWhitelist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SellerActivityController extends Controller
{
    public function index()
    {
        // Sync activity logs from real system users and orders
        $this->syncActivityFromSystem();

        // Pull latest logs
        $logs = ActivityLog::latest()->take(100)->get();
        $totalActions = $logs->count();
        $inventorySyncs = $logs->where('category', 'Inventory')->count();
        $orderUpdates = $logs->where('category', 'Sales')->count();

        // Dynamic hourly activity for the chart (last 24 hours)
        $hourlyActivity = array_fill(0, 24, 0);
        $recentLogs = ActivityLog::where('created_at', '>=', now()->subDay())->get();
        foreach ($recentLogs as $log) {
            $hourlyActivity[$log->created_at->hour]++;
        }

        // Growth logic (last 7 days)
        $newActionsThisWeek = ActivityLog::where('created_at', '>=', now()->subWeek())->count();
        $totalBeforeThisWeek = ActivityLog::where('created_at', '<', now()->subWeek())->count();
        $growth = $totalBeforeThisWeek > 0
            ? round(($newActionsThisWeek / $totalBeforeThisWeek) * 100)
            : ($newActionsThisWeek > 0 ? $newActionsThisWeek : 0);

        return Inertia::render('Seller/SellerActivity', [
            'logs' => $logs->take(50)->map(function ($log) {
                return [
                    'user_id'   => $log->user_id,
                    'username'  => $log->username ?: 'System',
                    'action'    => $log->action,
                    'category'  => $log->category,
                    'status'    => $log->status,
                    'time'      => $log->created_at->format('h:i A'),
                    'timestamp' => $log->created_at->format('d M Y'),
                    'details'   => $log->metadata['details'] ?? '',
                    'email'     => $log->metadata['email'] ?? '',
                    'role'      => $log->metadata['role'] ?? 'Buyer',
                ];
            }),
            'stats' => [
                'total_actions'   => ActivityLog::count(),
                'inventory_syncs' => ActivityLog::where('category', 'Inventory')->count(),
                'order_updates'   => ActivityLog::where('category', 'Sales')->count(),
                'action_growth'   => ($growth > 0 ? '+' : '') . $growth . ($totalBeforeThisWeek > 0 ? '%' : ''),
                'hourly_activity' => $hourlyActivity,
            ],
        ]);
    }

    /**
     * Auto-generate activity logs from real system data (users + orders).
     * Avoids duplicates by checking for existing entries per user/order.
     */
    private function syncActivityFromSystem(): void
    {
        $existingUserIds = ActivityLog::whereNotNull('user_id')
            ->where('action', 'Account Registration')
            ->pluck('user_id')
            ->toArray();

        $existingOrderIds = ActivityLog::whereNotNull('metadata->order_id')
            ->pluck('metadata->order_id')
            ->toArray();

        $sellerEmails = SellerWhitelist::pluck('email')->toArray();

        // Create a log entry per user not yet recorded
        $users = User::whereNotIn('id', $existingUserIds)->get();
        foreach ($users as $user) {
            $role = in_array($user->email, $sellerEmails) ? 'Seller' : 'Buyer';
            ActivityLog::create([
                'user_id'  => $user->id,
                'username' => $user->name,
                'action'   => 'Account Registration',
                'category' => 'User',
                'status'   => 'success',
                'metadata' => [
                    'email'   => $user->email,
                    'role'    => $role,
                    'details' => "User '{$user->name}' registered as {$role}.",
                ],
                'created_at' => $user->created_at,
                'updated_at' => $user->created_at,
            ]);
        }

        // Create a log entry per order not yet recorded
        $orders = Order::with('buyer')->get();
        foreach ($orders as $order) {
            // Skip if already logged
            if (in_array((string)$order->id, $existingOrderIds)) {
                continue;
            }

            $buyerName = $order->buyer->name ?? 'Guest';
            $buyerEmail = $order->buyer->email ?? 'N/A';
            $buyerUserId = $order->buyer->id ?? null;

            ActivityLog::create([
                'user_id'  => $buyerUserId,
                'username' => $buyerName,
                'action'   => 'Order Placement',
                'category' => 'Sales',
                'status'   => $order->status === 'Cancelled' ? 'warning' : 'success',
                'metadata' => [
                    'email'    => $buyerEmail,
                    'role'     => 'Buyer',
                    'order_id' => (string)$order->id,
                    'details'  => "Order #{$order->id} placed for ₱" . number_format($order->total_amount, 2) . " — Status: {$order->status}.",
                ],
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
            ]);
        }
    }
}
