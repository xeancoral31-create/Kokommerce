<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function index()
    {
        return redirect()->route('buyer.history');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function create()
    {
        return redirect()->route('buyer.shop');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'buyer_id' => 'required|exists:buyers,id',
            'subtotal' => 'required|numeric',
            'delivery_fee' => 'required|numeric',
            'total_amount' => 'required|numeric',
            'payment_method' => 'required|string',
            'delivery_address' => 'required|string',
            'items_data' => 'required|array',
        ]);

        $validated['order_reference'] = '#KKO-' . strtoupper(bin2hex(random_bytes(3)));
        $validated['status'] = 'Pending';

        $order = Order::create($validated);
        
        \App\Models\SellerNotification::create([
            'type' => 'order_paid',
            'title' => 'New Order Received',
            'message' => "Cha-ching! You have a new order {$validated['order_reference']} for ₱" . number_format($validated['total_amount'], 2),
            'is_read' => false
        ]);

        return redirect()->route('buyer.history')->with('success', 'Order placed successfully!');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function show(Order $order)
    {
        return back();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function edit(Order $order)
    {
        return back();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Order $order)
    {
        return back();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Order $order)
    {
        return back();
    }
}
