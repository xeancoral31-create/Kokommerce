<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\Product;
use App\Models\Buyer;
use App\Models\Promotion;
use App\Models\Category;
use Inertia\Inertia;

class BuyerController extends Controller
{
    public function home()
    {
        $user = auth()->user();
        return Inertia::render('Buyer/BuyerHome', [
            'user_name' => $user ? $user->name : 'Gourmet',
            'featured_products' => Product::with('category')->where('is_top_rated', true)->take(4)->get(),
            'new_arrivals' => Product::with('category')->latest()->take(4)->get(),
            'recent_favorites' => $user ? Product::whereHas('orderItems.order', function($q) use ($user) {
                $q->whereHas('buyer', function($bq) use ($user) {
                    $bq->where('email', $user->email);
                });
            })->distinct()->take(4)->get() : [],
            'promotions' => Promotion::where('status', 'active')->latest()->take(3)->get(),
            'stats' => [
                'recent_orders_count' => $user ? Order::whereHas('buyer', function($q) use ($user) {
                    $q->where('email', $user->email);
                })->where('status', 'Completed')->count() : 0,
                'available_offers' => Promotion::where('status', 'active')->count(),
            ]
        ]);
    }

    public function shop()
    {
        return Inertia::render('Buyer/BuyerShop', [
            'products' => Product::with('category')->get(),
            'categories' => Category::all()
        ]);
    }

    public function offer()
    {
        $user = auth()->user();
        $promotions = Promotion::with('product')->where('status', 'active')->get();

        if ($user) {
            $buyer = Buyer::where('email', $user->email)->first();
            if ($buyer) {
                $promotions->each(function ($promo) use ($buyer) {
                    $promo->is_used = Order::where('buyer_id', $buyer->id)
                        ->where('promotion_id', $promo->id)
                        ->exists();
                });
            }
        }

        return Inertia::render('Buyer/BuyerOffer', [
            'promotions' => $promotions
        ]);
    }


    public function history()
    {
        $user = auth()->user();
        $guestEmail = session('guest_email');

        $orders = Order::whereHas('buyer', function($q) use ($user, $guestEmail) {
            if ($user) {
                $q->where('email', $user->email);
            } elseif ($guestEmail) {
                $q->where('email', $guestEmail);
            } else {
                $q->where('id', 0); // No matches
            }
        })->with(['orderItems.product'])->latest()->get();

        return Inertia::render('Buyer/OrderHistory', [
            'orders' => $orders
        ]);
    }

    public function account()
    {
        $user = auth()->user();
        $buyer = null;
        
        if ($user) {
            $buyer = Buyer::where('email', $user->email)->first();
        }
        
        if (!$buyer) {
            $buyer = Buyer::first(); // Fallback for local development or guest view
        }

        return Inertia::render('Buyer/BuyerAccount', [
            'buyer' => $buyer,
            'orders_count' => $buyer ? $buyer->orders()->count() : 0,
            'offers_count' => Promotion::where('status', 'active')->count(),
        ]);
    }

    public function updateAccount(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
        ]);

        $user = auth()->user();
        $buyer = null;

        if ($user) {
            $buyer = Buyer::where('email', $user->email)->first();
        }

        if (!$buyer) {
            $buyer = Buyer::first();
        }

        if ($buyer) {
            $buyer->update([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
            ]);
        }

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }

    public function cart()
    {
        $user = auth()->user();
        $promotions = Promotion::where('status', 'active')->with('product')->get();

        if ($user) {
            $buyer = Buyer::where('email', $user->email)->first();
            if ($buyer) {
                $promotions->each(function ($promo) use ($buyer) {
                    $promo->is_used = Order::where('buyer_id', $buyer->id)
                        ->where('promotion_id', $promo->id)
                        ->exists();
                });
            }
        }

        return Inertia::render('Buyer/BuyerShoppingCart', [
            'cart_items' => [],
            'active_promotions' => $promotions
        ]);
    }

    public function delivery(Request $request)
    {
        $items = $request->input('items');
        
        return Inertia::render('Buyer/BuyerDeliveryDetails', [
            'cart_items' => $items ?? []
        ]);
    }

    public function payment()
    {
        return Inertia::render('Buyer/OrderConfirmPay', [
            'cart_items' => [],
            'stripe_key' => env('STRIPE_KEY', 'pk_test_2zuyBaQ6NePxHFMmmsQ94zxm')
        ]);
    }

    public function wishlist()
    {
        return Inertia::render('Buyer/Wishlist');
    }
}

