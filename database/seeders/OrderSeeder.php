<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $buyer = \App\Models\Buyer::first();

        if ($buyer) {
            \App\Models\Order::create([
                'buyer_id' => $buyer->id,
                'order_reference' => '#KKO-9821',
                'subtotal' => 1400.00,
                'delivery_fee' => 90.00,
                'total_amount' => 1490.00,
                'status' => 'Delivered',
                'payment_method' => 'gcash',
                'delivery_address' => $buyer->address,
                'items_data' => [
                    ['name' => 'Signature Ube Cake', 'quantity' => 1, 'price' => 1250],
                    ['name' => 'Pandesal', 'quantity' => 2, 'price' => 120]
                ]
            ]);

            \App\Models\Order::create([
                'buyer_id' => $buyer->id,
                'order_reference' => '#KKO-9755',
                'subtotal' => 470.00,
                'delivery_fee' => 0.00,
                'total_amount' => 470.00,
                'status' => 'Delivered',
                'payment_method' => 'card',
                'delivery_address' => $buyer->address,
                'items_data' => [
                    ['name' => 'Wild Yeast Sourdough', 'quantity' => 1, 'price' => 320],
                    ['name' => 'Spanish Bread', 'quantity' => 1, 'price' => 150]
                ]
            ]);
            \App\Models\Order::create([
                'buyer_id' => $buyer->id,
                'order_reference' => '#KKO-8821',
                'subtotal' => 240.00,
                'delivery_fee' => 50.00,
                'total_amount' => 290.00,
                'status' => 'Pending',
                'payment_method' => 'gcash',
                'delivery_address' => $buyer->address,
                'items_data' => [
                    ['name' => 'Artisan Pandesal', 'quantity' => 2, 'price' => 120]
                ]
            ]);

            \App\Models\Order::create([
                'buyer_id' => $buyer->id,
                'order_reference' => '#KKO-8825',
                'subtotal' => 1250.00,
                'delivery_fee' => 0.00,
                'total_amount' => 1250.00,
                'status' => 'Preparing',
                'payment_method' => 'card',
                'delivery_address' => $buyer->address,
                'items_data' => [
                    ['name' => 'Signature Ube Halaya', 'quantity' => 1, 'price' => 1250]
                ]
            ]);

            \App\Models\Order::create([
                'buyer_id' => $buyer->id,
                'order_reference' => '#KKO-8830',
                'subtotal' => 380.00,
                'delivery_fee' => 40.00,
                'total_amount' => 420.00,
                'status' => 'Pending',
                'payment_method' => 'gcash',
                'delivery_address' => $buyer->address,
                'items_data' => [
                    ['name' => 'Sea Salt Choco', 'quantity' => 1, 'price' => 380]
                ]
            ]);
        }
    }
}
