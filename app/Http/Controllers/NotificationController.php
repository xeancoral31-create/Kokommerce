<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $notifications = [
            'low_stock' => \App\Models\Product::where('seller_id', $user->id)
                ->where('stock', '<', 10)
                ->whereNull('deleted_at')
                ->get(),
            'recent' => Notification::where('user_id', $user->id)
                ->where('is_read', false)
                ->latest()
                ->get()
        ];

        return Inertia::render('Seller/Notifications', [
            'notifications' => $notifications
        ]);
    }

    public function markAsRead($id)
    {
        $notification = Notification::where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        $notification->update(['is_read' => true]);

        return back()->with('success', 'Notification marked as read');
    }

    public function markAllAsRead()
    {
        Notification::where('user_id', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return back()->with('success', 'All notifications marked as read');
    }
}
