<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\Promotion;

class SellerPromotionController extends Controller
{
    public function index()
    {
        $promotions   = Promotion::with('product')->latest()->get();
        $archived     = Promotion::onlyTrashed()->with('product')->latest()->get();
        $activeOffers = Promotion::where('status', 'active')->count();

        // Total Reach: all registered users in the system (potential audience)
        $totalUsers = \App\Models\User::count();
        $totalReach = $totalUsers >= 1000
            ? round($totalUsers / 1000, 1) . 'K'
            : (string) $totalUsers;

        // Conversion Rate: % of users who have placed at least one order
        $usersWithOrders = \App\Models\Order::distinct('buyer_id')->count('buyer_id');
        $conversionRate  = $totalUsers > 0
            ? round(($usersWithOrders / $totalUsers) * 100, 1) . '%'
            : '0%';

        // Month-over-month user growth
        $lastMonthUsers  = \App\Models\User::whereDate('created_at', '<', now()->startOfMonth())->count();
        $newUsersThisMonth = \App\Models\User::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)->count();
        $reachGrowth = $lastMonthUsers > 0
            ? ($newUsersThisMonth >= 0 ? '+' : '') . round(($newUsersThisMonth / $lastMonthUsers) * 100, 1) . '% this month'
            : ($newUsersThisMonth > 0 ? "+{$newUsersThisMonth} new this month" : 'No new users this month');

        return Inertia::render('Seller/SellerOffers', [
            'promotions' => $promotions,
            'archived_promotions' => $archived,
            'products'   => \App\Models\Product::all(),
            'stats'      => [
                'total_reach'     => $totalReach,
                'reach_growth'    => $reachGrowth,
                'active_offers'   => $activeOffers,
                'conversion_rate' => $conversionRate,
                'users_converted' => $usersWithOrders,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'code' => 'required|string|unique:promotions',
            'type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric',
            'product_id' => 'nullable|exists:products,id',
            'image' => 'nullable|string',
            'end_date' => 'nullable|date'
        ]);

        $promotion = Promotion::create($validated);
        
        // Dispatch Professional Bounty Notification to all Users
        $users = \App\Models\User::whereNotNull('email')->get();
        foreach($users as $user) {
            try {
                \Illuminate\Support\Facades\Mail::to($user->email)->queue(new \App\Mail\PromotionNotificationMail($promotion));
            } catch (\Exception $e) {
                \Log::error("Failed to send promo email to {$user->email}: " . $e->getMessage());
            }
        }

        \App\Models\Notification::create([
            'type' => 'offer_created',
            'title' => 'New Special Offer Created',
            'message' => "Campaign '{$validated['title']}' is now live. Notification dispatched to all users.",
            'user_id' => auth()->id(),
            'is_read' => false
        ]);

        // Notify all Buyers via Notification System
        foreach ($users as $u) {
            \App\Models\Notification::create([
                'user_id' => $u->id,
                'type' => 'promotion',
                'title' => 'Exclusive Invitation: ' . $validated['title'],
                'message' => "An artisanal offer awaits you! Use code '{$validated['code']}' to redeem your special reward. " . $validated['description'],
                'data' => ['promotion_id' => $promotion->id, 'code' => $validated['code']]
            ]);
        }

        return redirect()->back();
    }

    public function update(Request $request, Promotion $promotion)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'code' => 'required|string|unique:promotions,code,' . $promotion->id,
            'type' => 'required|in:percentage,fixed',
            'status' => 'required|string',
            'discount_value' => 'required|numeric',
            'product_id' => 'nullable|exists:products,id',
            'image' => 'nullable|string',
            'end_date' => 'nullable|date'
        ]);

        $promotion->update($validated);

        return redirect()->back();
    }

    public function destroy(Promotion $promotion)
    {
        $promotion->delete();
        return redirect()->back()->with('success', 'Campaign archived successfully!');
    }

    public function restore($id)
    {
        Promotion::withTrashed()->findOrFail($id)->restore();
        return redirect()->back()->with('success', 'Campaign restored successfully!');
    }

    public function forceDelete($id)
    {
        Promotion::withTrashed()->findOrFail($id)->forceDelete();
        return redirect()->back()->with('success', 'Campaign permanently removed!');
    }

}
