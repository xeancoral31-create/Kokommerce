<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SellerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            ['name' => 'Bread', 'slug' => 'bread', 'description' => 'Hearty, hand-crafted loaves.', 'image' => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200', 'status' => 'active'],
            ['name' => 'Cookies', 'slug' => 'cookies', 'description' => 'Sweet, gourmet treats.', 'image' => 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600', 'status' => 'active'],
            ['name' => 'Cakes', 'slug' => 'cakes', 'description' => 'Artisanal celebratory cakes.', 'image' => 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600', 'status' => 'active'],
            ['name' => 'Kakanin', 'slug' => 'kakanin', 'description' => 'Traditional Filipino delicacies.', 'image' => 'https://images.unsplash.com/photo-1621510456681-23a016df2424?w=600', 'status' => 'inactive'],
        ];

        foreach ($categories as $cat) {
            \App\Models\Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }

        $promotions = [
            [
                'title' => 'Morning Glory BOGO',
                'description' => 'Buy one get one free on all pastries before 9AM.',
                'code' => 'MORNING24',
                'type' => 'percentage',
                'discount_value' => 50,
                'status' => 'active',
                'image' => 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600',
                'redemptions' => 1420,
                'revenue' => 4260
            ],
            [
                'title' => 'Coffee Lover\'s Bundle',
                'description' => 'Get a free coffee with any cookie purchase.',
                'code' => 'COFFEE2',
                'type' => 'fixed',
                'discount_value' => 120,
                'status' => 'active',
                'image' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600',
                'redemptions' => 2104,
                'revenue' => 8416
            ],
        ];

        foreach ($promotions as $promo) {
            \App\Models\Promotion::updateOrCreate(['code' => $promo['code']], $promo);
        }

        // Assign categories to existing products
        $breadCat = \App\Models\Category::where('slug', 'bread')->first();
        if ($breadCat) {
            \App\Models\Product::where('category', 'Bread')->update(['category_id' => $breadCat->id]);
        }
        
        $cakeCat = \App\Models\Category::where('slug', 'cakes')->first();
        if ($cakeCat) {
            \App\Models\Product::where('category', 'Cakes')->update(['category_id' => $cakeCat->id]);
        }

        // Users & Roles
        \App\Models\User::updateOrCreate(['email' => 'julian@kokommerce.com'], [
            'name' => 'Julian Hearth',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        \App\Models\User::updateOrCreate(['email' => 'marco@kokommerce.com'], [
            'name' => 'Marco',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        \App\Models\User::updateOrCreate(['email' => 'elena@kokommerce.com'], [
            'name' => 'Elena',
            'password' => bcrypt('password'),
            'role' => 'manager',
        ]);

        // Activity Logs
        \App\Models\ActivityLog::create([
            'username' => 'Admin Elena',
            'action' => 'Stock update: Sourdough Loaf',
            'category' => 'Inventory',
            'status' => 'success',
            'metadata' => ['old' => 20, 'new' => 45]
        ]);

        \App\Models\ActivityLog::create([
            'username' => 'System Bot',
            'action' => 'New order synchronization',
            'category' => 'Sales',
            'status' => 'processing'
        ]);

        // Help Tickets
        $user = \App\Models\User::first();
        \App\Models\HelpTicket::create([
            'user_id' => $user->id,
            'subject' => 'International Shipping Rates',
            'description' => 'How are international shipping rates calculated?',
            'category' => 'Logistics',
            'status' => 'open',
            'priority' => 'medium'
        ]);
    }
}
