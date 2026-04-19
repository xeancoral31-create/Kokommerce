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
            'image_file' => 'nullable|image|max:2048', // Real file upload
            'image' => 'nullable|string', // Fallback for existing/mock images
            'status' => 'required|string',
        ]);

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('products', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']) . '-' . uniqid();
        $validated['rating'] = 5.0; // Default rating for new products
        $validated['reviews_count'] = 0;
        
        Product::create($validated);
        
        \App\Models\SellerNotification::create([
            'type' => 'product_added',
            'title' => 'New Product Added',
            'message' => "Fresh batch alert! '{$validated['name']}' has been added to your inventory.",
            'is_read' => false
        ]);

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
            'image_file' => 'nullable|image|max:2048',
            'image' => 'nullable|string',
            'status' => 'required|string',
        ]);

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('products', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $product->update($validated);

        return redirect()->back()->with('success', 'Product updated successfully!');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->back()->with('success', 'Product deleted successfully!');
    }
}

