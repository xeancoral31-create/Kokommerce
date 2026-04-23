<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\User;

class SellerUserController extends Controller
{
    public function index()
    {
        $activeThreshold = now()->subMinutes(15);

        $users = User::latest()->get()->map(function($user) use ($activeThreshold) {
            $isSeller = \App\Models\SellerWhitelist::where('email', $user->email)->exists();
            
            // Refined status detection
            $isActive = $user->last_active_at && $user->last_active_at->diffInMinutes(now()) <= 15;
            
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'image' => $user->image ?? 'https://i.pravatar.cc/100?u=' . $user->name,
                'role' => $isSeller ? 'Seller' : 'Buyer',
                'status' => $isActive ? 'Active' : 'Inactive',
                'joined' => $user->created_at->format('M d, Y'),
                'orders' => $isSeller ? '--' : \App\Models\Order::whereHas('buyer', function($q) use ($user) {
                    $q->where('email', $user->email);
                })->count()
            ];
        });

        return Inertia::render('Seller/SellerUsers', [
            'users' => $users,
            'stats' => [
                'total_members' => User::count(),
                'active_now' => User::where('last_active_at', '>=', $activeThreshold)->count(),
                'permissions_audit' => 'Clean'
            ]
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'User profile updated successfully.');
    }

    public function togglePermissions(User $user)
    {
        $whitelist = \App\Models\SellerWhitelist::where('email', $user->email)->first();

        if ($whitelist) {
            $whitelist->delete();
            $message = "Public permissions restored for {$user->name}.";
        } else {
            \App\Models\SellerWhitelist::create(['email' => $user->email]);
            $message = "Staff Partner status granted to {$user->name}.";
        }

        return redirect()->back()->with('success', $message);
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Cannot remove your own masterful account.');
        }

        $user->delete();
        return redirect()->back()->with('success', 'User removed from artisanal community.');
    }
}
