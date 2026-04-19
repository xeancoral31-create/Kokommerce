<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            [
                'name' => 'Bread',
                'slug' => 'bread',
                'description' => 'Artisanal hearth-baked sourdough and traditional Filipino rolls.',
                'image' => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200',
                'status' => 'Active',
            ],
            [
                'name' => 'Cookies',
                'slug' => 'cookies',
                'description' => 'Hand-crafted cookies using premium Belgian chocolate and local sea salt.',
                'image' => 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800',
                'status' => 'Active',
            ],
            [
                'name' => 'Cakes',
                'slug' => 'cakes',
                'description' => 'Elegant layered creations celebrating local flavors like Ube and Mango.',
                'image' => 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
                'status' => 'Active',
            ],
            [
                'name' => 'Kakanin',
                'slug' => 'kakanin',
                'description' => 'Traditional Filipino rice cakes made with high-quality rice flour and coconut milk.',
                'image' => 'https://images.unsplash.com/photo-1621510456681-23a016df2424?w=800', // Re-tested Filipino dessert URL
                'status' => 'Active',
            ]
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }
    }
}
