<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\Product;
use App\Models\Buyer;
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
            'promotions' => \App\Models\Promotion::where('status', 'active')->latest()->take(3)->get(),
            'stats' => [
                'recent_orders_count' => $user ? Order::whereHas('buyer', function($q) use ($user) {
                    $q->where('email', $user->email);
                })->where('status', 'pending')->count() : 0,
                'available_offers' => \App\Models\Promotion::where('status', 'active')->count(),
            ]
        ]);
    }

    public function shop()
    {
        return Inertia::render('Buyer/BuyerShop', [
            'products' => Product::with('category')->get(),
            'categories' => \App\Models\Category::all()
        ]);
    }

    public function offer()
    {
        return Inertia::render('Buyer/BuyerOffer', [
            'promotions' => \App\Models\Promotion::with('product')->where('status', 'active')->get()
        ]);
    }


    public function history()
    {
        $user = auth()->user();
        $orders = $user 
            ? Order::whereHas('buyer', function($q) use ($user) {
                $q->where('email', $user->email);
            })->with(['orderItems.product'])->latest()->get()
            : [];

        return Inertia::render('Buyer/OrderHistory', [
            'orders' => $orders
        ]);
    }

    public function account()
    {
        return Inertia::render('Buyer/BuyerAccountPage', [
            'buyer' => Buyer::first()
        ]);
    }

    public function cart()
    {
        return Inertia::render('Buyer/BuyerShoppingCart', [
            'cart_items' => []
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
            'cart_items' => []
        ]);
    }
}

