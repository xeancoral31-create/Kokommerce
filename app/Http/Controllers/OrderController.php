<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Buyer;

class OrderController extends Controller
{
    /**
     * Create a payment intent (via REST API, no SDK).
     */
    public function createPaymentIntent(Request $request): JsonResponse
    {
        $amount = (int) ($request->total * 100);
        $secret = (string) env('STRIPE_SECRET');

        if ($this->isMockMode($secret)) {
            return $this->mockPaymentResponse();
        }

        return $this->stripePaymentIntent($secret, $amount);
    }

    private function isMockMode(string $secret): bool
    {
        if (env('APP_ENV') !== 'local') {
            return false;
        }
        return empty($secret) || Str::startsWith($secret, 'sk_test_');
    }

    private function mockPaymentResponse(): JsonResponse
    {
        return response()->json([
            'clientSecret' => 'mock_secret_' . Str::random(32),
            'mock' => true,
        ]);
    }

    private function stripePaymentIntent(string $secret, int $amount): JsonResponse
    {
        try {
            $email = auth()->user() ? auth()->user()->email : 'guest';

            $res = Http::withBasicAuth($secret, '')
                ->post('https://api.stripe.com/v1/payment_intents', [
                    'amount'               => $amount,
                    'currency'             => 'php',
                    'payment_method_types' => ['card'],
                    'metadata'             => ['buyer_email' => (string) $email],
                ]);

            if ($res->successful()) {
                return response()->json([
                    'clientSecret' => (string) ($res->json('client_secret') ?? ''),
                    'mock'         => false,
                ]);
            }

            Log::error('Stripe API error: ' . $res->body());
            return response()->json(['error' => 'Payment gateway error.'], 500);
        } catch (\Exception $e) {
            Log::error('Stripe exception: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Create a PayMongo payment source (GCash / Maya).
     */
    public function createPaymongoSource(Request $request): JsonResponse
    {
        $amount    = (int) ($request->amount * 100);
        $type      = (string) $request->type;
        $secretKey = (string) env('PAYMONGO_SECRET_KEY');

        if ($this->isPaymongoMockMode($secretKey)) {
            $mockId = 'mock_src_' . Str::random(24);
            
            // Store items in session for the mock receipt
            session(["mock_order_{$mockId}" => [
                'items' => $request->items_data ?? [],
                'amount' => $request->amount,
                'type' => $type
            ]]);

            return response()->json([
                'source_id'    => $mockId,
                'checkout_url' => route('payment.mock.checkout', ['source' => $mockId]),
                'mock'         => true,
            ]);
        }

        return $this->paymongoSource($secretKey, $amount, $type);
    }

    private function isPaymongoMockMode(string $key): bool
    {
        if (env('APP_ENV') !== 'local') {
            return false;
        }
        return empty($key) || Str::startsWith($key, 'sk_test_');
    }

    private function paymongoSource(string $key, int $amount, string $type): JsonResponse
    {
        try {
            $res = Http::withBasicAuth($key, '')
                ->post('https://api.paymongo.com/v1/sources', [
                    'data' => [
                        'attributes' => [
                            'amount'   => $amount,
                            'currency' => 'PHP',
                            'type'     => $type,
                            'redirect' => [
                                'success' => route('buyer.history'),
                                'failed'  => route('buyer.cart'),
                            ],
                        ],
                    ],
                ]);

            if ($res->successful()) {
                $data = $res->json()['data'];
                return response()->json([
                    'source_id'    => $data['id'],
                    'checkout_url' => $data['attributes']['redirect']['checkout_url'],
                ]);
            }

            Log::error('PayMongo source error: ' . $res->body());
            return response()->json(['error' => 'Failed to create payment source.'], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Poll a PayMongo source for payment status.
     */
    public function checkPaymongoSource(Request $request): JsonResponse
    {
        $sourceId = (string) $request->source_id;

        if (Str::startsWith($sourceId, 'mock_src_')) {
            return response()->json(['status' => 'chargeable']);
        }

        try {
            $key = (string) env('PAYMONGO_SECRET_KEY');
            $res = Http::withBasicAuth($key, '')
                ->get("https://api.paymongo.com/v1/sources/{$sourceId}");

            if ($res->successful()) {
                return response()->json([
                    'status' => $res->json()['data']['attributes']['status'],
                ]);
            }

            return response()->json(['error' => 'Could not verify payment status.'], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Mock checkout page — rendered via Inertia for a professional UI.
     */
    public function mockCheckout(Request $request)
    {
        $sourceId = $request->query('source');
        $mockData = session("mock_order_{$sourceId}", [
            'items' => [],
            'amount' => 0,
            'type' => 'gcash'
        ]);

        return \Inertia\Inertia::render('Payment/MockEwallet', [
            'source_id' => $sourceId,
            'amount' => (float) $mockData['amount'],
            'provider' => $mockData['type'] === 'paymaya' ? 'maya' : 'gcash',
            'reference' => 'KOKO-MOCK-' . strtoupper(Str::random(6)),
            'items' => $mockData['items']
        ]);
    }

    /**
     * Confirm a mock checkout (AJAX).
     */
    public function confirmMockCheckout(Request $request): JsonResponse
    {
        return response()->json(['status' => 'success', 'message' => 'Simulated settlement confirmed.']);
    }

    /**
     * Store a new order and create associated order items.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'buyer_id'         => 'required|string',
            'subtotal'         => 'required|numeric',
            'delivery_fee'     => 'required|numeric',
            'discount_amount'  => 'required|numeric',
            'total_amount'     => 'required|numeric',
            'payment_method'   => 'required|string',
            'delivery_address' => 'required|string',
            'items_data'       => 'required|array',
            'promotion_id'     => 'nullable',
        ]);

        $buyer = $this->resolveOrCreateBuyer($request);
        $order = $this->createOrder($request, $buyer->id);
        $this->createOrderItems($order->id, $request->items_data);
        $this->dispatchOrderNotification($order);

        // Connect and Detect: Persist guest session for history tracking
        if (!auth()->check()) {
            session(['guest_email' => $buyer->email]);
        }

        return redirect()->route('buyer.history')
            ->with('success', 'Your artisanal order has been secured.');
    }

    private function resolveOrCreateBuyer(Request $request): Buyer
    {
        $user    = auth()->user();
        $email   = $user ? $user->email : ($request->buyer_id . '@guest.com');
        $clerkId = Str::contains($request->buyer_id, 'guest_') ? null : $request->buyer_id;

        // Check by clerk_id first (most specific identifier), then fall back to email
        $buyer = null;
        if ($clerkId) {
            $buyer = Buyer::where('clerk_id', $clerkId)->first();
        }
        if (!$buyer) {
            $buyer = Buyer::where('email', $email)->first();
        }

        if (!$buyer) {
            $buyer = Buyer::create([
                'clerk_id'      => $clerkId,
                'name'          => $user ? $user->name : 'Guest User',
                'email'         => $email,
                'phone'         => '',
                'address'       => $request->delivery_address,
                'member_since'  => now(),
                'grain_points'  => 0,
                'hearth_status' => 'Member',
            ]);
        } else {
            // Update any missing fields on the existing buyer
            $updates = [];
            if ($clerkId && !$buyer->clerk_id) $updates['clerk_id'] = $clerkId;
            if (!$buyer->email && $email)       $updates['email']    = $email;
            if (!empty($updates)) $buyer->update($updates);
        }

        return $buyer;
    }

    private function createOrder(Request $request, int $buyerId): Order
    {
        return Order::create([
            'buyer_id'         => $buyerId,
            'order_reference'  => 'KOKO-' . strtoupper(Str::random(8)),
            'subtotal'         => $request->subtotal,
            'delivery_fee'     => $request->delivery_fee,
            'discount_amount'  => $request->discount_amount,
            'total_amount'     => $request->total_amount,
            'status'           => 'Pending',
            'payment_method'   => $request->payment_method,
            'delivery_address' => $request->delivery_address,
            'items_data'       => $request->items_data,
            'promotion_id'     => $request->promotion_id,
        ]);
    }

    private function createOrderItems(int $orderId, array $items): void
    {
        foreach ($items as $item) {
            OrderItem::create([
                'order_id'   => $orderId,
                'product_id' => $item['id'],
                'variant'    => $item['variant'] ?? 'Solo',
                'quantity'   => $item['qty'],
                'price'      => $item['price'],
                'subtotal'   => $item['price'] * $item['qty'],
            ]);
        }
    }

    private function dispatchOrderNotification(Order $order): void
    {
        try {
            \App\Models\Notification::create([
                'type'    => 'order',
                'title'   => 'New Order Received',
                'message' => "Order #{$order->order_reference} has been placed for ₱"
                    . number_format($order->total_amount, 2),
                'is_read' => false,
            ]);
        } catch (\Exception $e) {
            Log::warning('Could not create order notification: ' . $e->getMessage());
        }
    }
}
