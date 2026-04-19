<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\StoreSetting;

class SellerSettingsController extends Controller
{
    public function index()
    {
        // Fetch from dynamic settings or session if available
        $profile = session('store_profile', [
            'name' => 'The Golden Crust',
            'tagline' => 'Handcrafted Joy in Every Crumb',
            'description' => 'Authentic sourdough techniques passed down through three generations...',
            'image' => 'https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=400&h=400&fit=crop'
        ]);

        return Inertia::render('Seller/SellerSettings', [
            'store_profile' => $profile,
            'operating_hours' => [
                ['day' => 'Monday', 'hours' => '07:00 - 19:00'],
                ['day' => 'Tuesday', 'hours' => '07:00 - 19:00'],
                ['day' => 'Wednesday', 'hours' => '07:00 - 19:00'],
                ['day' => 'Thursday', 'hours' => '07:00 - 19:00'],
                ['day' => 'Friday', 'hours' => '07:00 - 21:00'],
                ['day' => 'Saturday', 'hours' => '08:00 - 21:00'],
                ['day' => 'Sunday', 'hours' => 'CLOSED'],
            ],
            'payment_methods' => [
                ['id' => 1, 'name' => 'GCash Mobile', 'status' => 'ACTIVE', 'details' => '0917 **** 888'],
                ['id' => 2, 'name' => 'Bank Transfer', 'status' => 'CONNECTED', 'details' => 'BDO Unibank **** 4291'],
            ]
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'tagline' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $profile = $request->only(['name', 'tagline', 'description']);
        
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('store', 'public');
            $profile['image'] = '/storage/' . $path;
        } else {
            $profile['image'] = session('store_profile.image', 'https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=400&h=400&fit=crop');
        }

        // Persist in session for real-time UI synchronization in this demo
        session(['store_profile' => $profile]);

        return back()->with('message', 'Bakery configuration updated successfully.');
    }

}
