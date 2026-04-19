<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $products = [
            [
                'name' => 'Country Sourdough',
                'slug' => 'country-sourdough',
                'description' => '72-hour fermented wild yeast...',
                'price' => 220.00,
                'category' => 'Bread',
                'status' => 'in_stock',
                'rating' => 4.8,
                'reviews_count' => 120,
                'image' => '/images/products/sourdough.png',
                'is_featured' => true,
            ],
            [
                'name' => 'Sea Salt Choco',
                'slug' => 'sea-salt-choco',
                'description' => 'Rich 70% dark Belgian chocolate...',
                'price' => 380.00,
                'category' => 'Cookies',
                'status' => 'in_stock',
                'rating' => 4.9,
                'reviews_count' => 85,
                'image' => '/images/products/cookies.png',
                'is_featured' => true,
            ],
            [
                'name' => 'Signature Ube Halaya',
                'slug' => 'signature-ube-halaya',
                'description' => 'Triple-layered purple yam cake...',
                'price' => 1250.00,
                'category' => 'Cakes',
                'status' => 'in_stock',
                'rating' => 5.0,
                'reviews_count' => 210,
                'image' => '/images/products/ube-cake.png',
                'is_new' => true,
                'is_featured' => true,
            ],
            [
                'name' => 'Bibingka Special',
                'slug' => 'bibingka-special',
                'description' => 'Baked in clay pots over charcoal.',
                'price' => 150.00,
                'category' => 'Kakanin',
                'status' => 'in_stock',
                'rating' => 4.7,
                'reviews_count' => 95,
                'image' => '/images/products/bibingka.png',
                'is_featured' => true,
            ],
            [
                'name' => 'Golden Cheese Ensaymada',
                'slug' => 'golden-cheese-ensaymada',
                'description' => 'Classic recipe with Quezo de Bola.',
                'price' => 85.00,
                'category' => 'Bread',
                'status' => 'in_stock',
                'rating' => 4.8,
                'reviews_count' => 2500,
                'image' => '/images/products/ensaymada.png',
                'is_top_rated' => true,
            ],
            [
                'name' => 'Custard Cassava Cake',
                'slug' => 'custard-cassava-cake',
                'description' => 'Slow-baked with macapuno.',
                'price' => 420.00,
                'category' => 'Kakanin',
                'status' => 'pre_order',
                'rating' => 4.8,
                'reviews_count' => 1500,
                'image' => '/images/products/cassava-cake-v2.png',
                'is_top_rated' => true,
            ],
            [
                'name' => 'Artisan Pandesal',
                'slug' => 'artisan-pandesal',
                'description' => 'Soft, pillowy dozen.',
                'price' => 120.00,
                'category' => 'Bread',
                'status' => 'in_stock',
                'rating' => 5.0,
                'reviews_count' => 800,
                'image' => '/images/products/pandesal-v2.png',
                'is_top_rated' => true,
            ],
            [
                'name' => 'Triple Dark Truffle',
                'slug' => 'triple-dark-truffle',
                'description' => 'Award-winning chocolate cake.',
                'price' => 1400.00,
                'category' => 'Cakes',
                'status' => 'in_stock',
                'rating' => 4.9,
                'reviews_count' => 300,
                'image' => '/images/products/dark-truffle.png',
                'is_top_rated' => true,
            ],
        ];

        foreach ($products as $i => $product) {
            $product['stock'] = ($i === 0) ? 5 : 50; // Set first item to low stock (5) to trigger alert
            \App\Models\Product::create($product);
        }
    }
}
