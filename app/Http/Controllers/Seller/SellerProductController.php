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
            'archived_products' => Product::onlyTrashed()->with('category')->latest()->get(),
            'categories' => Category::all(),
            'stats' => [
                'total_items' => Product::count(),
                'in_stock_count' => Product::where('status', 'in_stock')->count(),
                'low_stock' => Product::where('status', '!=', 'pre_order')
                    ->where(function($query) {
                        $query->where('status', 'sold_out')
                              ->orWhere('stock', '<', 5);
                    })->count(),
                'pre_order_count' => Product::where('status', 'pre_order')->count(),
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
        
        $newProduct = Product::create($validated);
        
        \App\Models\ActivityLog::create([
            'username' => 'Seller', // Could be dynamic based on auth
            'action' => 'Product Creation',
            'category' => 'Inventory',
            'status' => 'success',
            'metadata' => [
                'details' => "New masterpiece '{$validated['name']}' added to inventory.",
                'product_id' => $newProduct->id
            ]
        ]);

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

        \App\Models\ActivityLog::create([
            'username' => 'Seller',
            'action' => 'Product Update',
            'category' => 'Inventory',
            'status' => 'success',
            'metadata' => [
                'details' => "Details updated for '{$product->name}'.",
                'product_id' => $product->id
            ]
        ]);

        return redirect()->back()->with('success', 'Product updated successfully!');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        \App\Models\ActivityLog::create([
            'username' => 'Seller',
            'action' => 'Product Archived',
            'category' => 'Inventory',
            'status' => 'warning',
            'metadata' => [
                'details' => "Product '{$product->name}' moved to archive.",
                'product_id' => $product->id
            ]
        ]);

        return redirect()->back()->with('success', 'Product archived successfully!');
    }

    public function restore($id)
    {
        $product = Product::withTrashed()->findOrFail($id);
        $product->restore();

        \App\Models\ActivityLog::create([
            'username' => 'Seller',
            'action' => 'Product Restored',
            'category' => 'Inventory',
            'status' => 'success',
            'metadata' => [
                'details' => "Product '{$product->name}' has been restored to inventory.",
                'product_id' => $product->id
            ]
        ]);

        return redirect()->back()->with('success', 'Product restored successfully!');
    }

    public function forceDelete($id)
    {
        $product = Product::withTrashed()->findOrFail($id);
        $product->forceDelete();

        \App\Models\ActivityLog::create([
            'username' => 'Seller',
            'action' => 'Permanent Deletion',
            'category' => 'Inventory',
            'status' => 'error',
            'metadata' => [
                'details' => "Product '{$product->name}' permanently removed from system.",
                'product_id' => $id
            ]
        ]);

        return redirect()->back()->with('success', 'Product permanently deleted!');
    }

    public function restock(Request $request, Product $product)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $product->increment('stock', $validated['quantity']);
        
        // Update status if it was sold out
        if ($product->status === 'sold_out' && $product->stock > 0) {
            $product->update(['status' => 'in_stock']);
        }

        \App\Models\ActivityLog::create([
            'username' => 'Seller',
            'action' => 'Restock Action',
            'category' => 'Inventory',
            'status' => 'success',
            'metadata' => [
                'details' => "Replenished {$validated['quantity']} units for '{$product->name}'. Current stock: {$product->stock}.",
                'product_id' => $product->id
            ]
        ]);

        \App\Models\SellerNotification::create([
            'type' => 'stock_update',
            'title' => 'Inventory Replenished',
            'message' => "Restock successful! {$validated['quantity']} units added to '{$product->name}'. Total stock: {$product->stock}.",
            'is_read' => false
        ]);

        return redirect()->back()->with('success', 'Stock updated successfully!');
    }
}

