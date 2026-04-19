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
        return Inertia::render('Buyer/BuyerHome');
    }

    public function shop()
    {
        return Inertia::render('Buyer/BuyerShop', [
            'products' => Product::with('category')->get()
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
        return Inertia::render('Buyer/OrderHistory', [
            'orders' => Order::with('buyer')->latest()->get()
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
        return Inertia::render('Buyer/BuyerShoppingCart');
    }

    public function delivery()
    {
        return Inertia::render('Buyer/BuyerDeliveryDetails');
    }

    public function payment()
    {
        return Inertia::render('Buyer/OrderConfirmPay');
    }
}

