<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        if (!Auth::check()) {
            if (request()->wantsJson()) {
                return response()->json(['recent' => [], 'low_stock' => []]);
            }
            return redirect()->route('login');
        }

        $notifications = Notification::where('user_id', Auth::id())
            ->where('is_read', false)
            ->latest()
            ->take(10)
            ->get();

        $lowStock = \App\Models\Product::where('stock', '<', 5)->get();

        if (request()->wantsJson()) {
            return response()->json([
                'recent' => $notifications,
                'low_stock' => $lowStock
            ]);
        }

        return Inertia::render('Notifications/Index', [
            'notifications' => [
                'recent' => $notifications,
                'low_stock' => $lowStock
            ]
        ]);
    }

    public function markAsRead($id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $notification->update(['is_read' => true]);

        if (request()->wantsJson() && !request()->header('X-Inertia')) {
            return response()->json(['success' => true]);
        }

        return redirect()->back();
    }

    public function markAllAsRead()
    {
        Notification::where('is_read', false)
            ->where('user_id', Auth::id())
            ->update(['is_read' => true]);

        if (request()->wantsJson() && !request()->header('X-Inertia')) {
            return response()->json(['success' => true]);
        }

        return redirect()->back();
    }
}
