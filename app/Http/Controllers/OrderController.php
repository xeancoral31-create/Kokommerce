<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class OrderController extends Controller
{
    /**
     * Create a Stripe Payment Intent.
     */
    public function createPaymentIntent(Request $request)
    {
        try {
            $secretKey = env('STRIPE_SECRET');
            $secretString = is_string($secretKey) ? $secretKey : '';
            
            $stripe = new \Stripe\StripeClient($secretString);
            
            $inputTotal = $request->get('total');
            $numericTotal = is_numeric($inputTotal) ? (float) $inputTotal : 0.0;
            $amountInCents = (int) ($numericTotal * 100);
            
            // By casting to mixed, we force the IDE to skip type inferring the massive 
            // array shapes from the Stripe SDK, bypassing the "internal limitation" error.
            /** @var mixed $paymentIntentsApi */
            $paymentIntentsApi = $stripe->paymentIntents;
            $paymentIntent = $paymentIntentsApi->create([
                'amount' => $amountInCents,
                'currency' => 'php',
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

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
            'buyer_id' => 'required', // Expects clerk_id or generic identifier from frontend
            'subtotal' => 'required|numeric',
            'delivery_fee' => 'required|numeric',
            'total_amount' => 'required|numeric',
            'payment_method' => 'required|string',
            'delivery_address' => 'required|string',
            'items_data' => 'required|array',
        ]);

        // Find or create the Buyer based on clerk_id
        $buyer = \App\Models\Buyer::firstOrCreate(
            ['clerk_id' => $validated['buyer_id']],
            [
                'name' => auth()->user() ? auth()->user()->name : 'Artisanal Guest',
                'email' => auth()->user() ? auth()->user()->email : 'guest@kokommerce.com',
                'phone' => 'N/A'
            ]
        );
        
        $validated['buyer_id'] = $buyer->id; // Replace clerk_id with actual integer ID

        $validated['order_reference'] = '#KKO-' . strtoupper(bin2hex(random_bytes(3)));
        $validated['status'] = 'Pending';

        $order = Order::create($validated);
        
        \App\Models\SellerNotification::create([
            'type' => 'order_paid',
            'title' => 'New Order Received',
            'message' => "Cha-ching! You have a new order {$validated['order_reference']} for ₱" . number_format($validated['total_amount'], 2),
            'is_read' => false
        ]);

        \App\Models\ActivityLog::create([
            'user_id' => $buyer->id,
            'username' => $buyer->name,
            'action' => 'Order Placement',
            'category' => 'Sales',
            'status' => 'success',
            'metadata' => [
                'order_reference' => $validated['order_reference'],
                'total_amount' => $validated['total_amount'],
                'details' => "Order {$validated['order_reference']} placed for ₱" . number_format($validated['total_amount'], 2) . ".",
                'email' => $buyer->email,
                'role' => 'Buyer'
            ]
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
