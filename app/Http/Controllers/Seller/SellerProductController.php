<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;

class SellerProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Seller/SellerProducts', [
            'products' => Product::with('category')->latest()->get(),
            'categories' => Category::all(),
            'stats' => [
                'total_items' => Product::count(),
                'low_stock' => Product::where('status', 'sold_out')->orWhere('stock', '<', 5)->count(),
                'category_count' => Category::count(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|string', // In a real app, handle file upload
            'status' => 'required|string',
        ]);

        $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']) . '-' . uniqid();
        $validated['rating'] = 5.0; // Default rating for new products
        $validated['reviews_count'] = 0;
        
        Product::create($validated);

        return redirect()->back()->with('success', 'Product created successfully!');
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|string',
            'status' => 'required|string',
        ]);

        $product->update($validated);

        return redirect()->back()->with('success', 'Product updated successfully!');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->back()->with('success', 'Product deleted successfully!');
    }
}

