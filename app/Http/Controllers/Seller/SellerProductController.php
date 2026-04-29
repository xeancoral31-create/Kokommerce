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
                'sold_out_count' => Product::where('status', 'sold_out')->count(),
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
            'price' => 'nullable|numeric|min:0',
            'solo_price' => 'required|numeric|min:0',
            'solo_unit' => 'nullable|string|max:50',
            'package_price' => 'required|numeric|min:0',
            'package_unit' => 'nullable|string|max:50',
            'package_qty' => 'nullable|integer|min:1',
            'stock' => 'required|integer|min:0',
            'image_file' => 'nullable|image|max:2048', 
            'solo_image_file' => 'nullable|image|max:2048',
            'package_image_file' => 'nullable|image|max:2048',
            'image' => 'nullable|string',
            'solo_image' => 'nullable|string',
            'package_image' => 'nullable|string',
            'status' => 'required|string',
        ]);

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('products', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        if ($request->hasFile('solo_image_file')) {
            $path = $request->file('solo_image_file')->store('products', 'public');
            $validated['solo_image'] = '/storage/' . $path;
        }

        if ($request->hasFile('package_image_file')) {
            $path = $request->file('package_image_file')->store('products', 'public');
            $validated['package_image'] = '/storage/' . $path;
        }

        $validated['price'] = $validated['price'] ?? $validated['solo_price'];
        $validated['rating'] = 5.0; // Default rating for new products
        $validated['reviews_count'] = 0;

        // Synchronize status with stock
        if ($validated['stock'] == 0) {
            $validated['status'] = 'sold_out';
        } elseif ($validated['status'] === 'sold_out' && $validated['stock'] > 0) {
            $validated['status'] = 'in_stock';
        }
        
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

        \App\Models\Notification::create([
            'user_id' => auth()->id(),
            'type' => 'product_added',
            'title' => 'New Product Added',
            'message' => "Fresh batch alert! '{$validated['name']}' has been added to your inventory.",
            'is_read' => false
        ]);

        // Notify all Buyers
        $buyers = \App\Models\User::where('role', 'buyer')->get();
        foreach ($buyers as $buyerUser) {
            \App\Models\Notification::create([
                'user_id' => $buyerUser->id,
                'type' => 'new_product',
                'title' => 'New Masterpiece Available!',
                'message' => "Freshly baked: '{$validated['name']}' is now available in our artisanal collection. Check it out!",
                'data' => ['product_id' => $newProduct->id]
            ]);
        }

        return redirect()->back()->with('success', 'Product created successfully!');
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'price' => 'nullable|numeric|min:0',
            'solo_price' => 'required|numeric|min:0',
            'solo_unit' => 'nullable|string|max:50',
            'package_price' => 'required|numeric|min:0',
            'package_unit' => 'nullable|string|max:50',
            'package_qty' => 'nullable|integer|min:1',
            'stock' => 'required|integer|min:0',
            'image_file' => 'nullable|image|max:2048',
            'solo_image_file' => 'nullable|image|max:2048',
            'package_image_file' => 'nullable|image|max:2048',
            'image' => 'nullable|string',
            'solo_image' => 'nullable|string',
            'package_image' => 'nullable|string',
            'status' => 'required|string',
        ]);

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('products', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        if ($request->hasFile('solo_image_file')) {
            $path = $request->file('solo_image_file')->store('products', 'public');
            $validated['solo_image'] = '/storage/' . $path;
        }

        if ($request->hasFile('package_image_file')) {
            $path = $request->file('package_image_file')->store('products', 'public');
            $validated['package_image'] = '/storage/' . $path;
        }

        if (!$request->price) {
            $validated['price'] = $validated['solo_price'];
        }

        // Synchronize status with stock
        if ($validated['stock'] == 0) {
            $validated['status'] = 'sold_out';
        } elseif ($validated['status'] === 'sold_out' && $validated['stock'] > 0) {
            $validated['status'] = 'in_stock';
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

        $product->stock += $validated['quantity'];
        
        // Automatically mark as in_stock if it was previously sold_out
        if ($product->status === 'sold_out' && $product->stock > 0) {
            $product->status = 'in_stock';
        }
        
        $product->save();

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

        \App\Models\Notification::create([
            'user_id' => auth()->id(),
            'type' => 'stock_update',
            'title' => 'Inventory Replenished',
            'message' => "Restock successful! {$validated['quantity']} units added to '{$product->name}'. Total stock: {$product->stock}.",
            'is_read' => false
        ]);

        return redirect()->back()->with('success', 'Stock updated successfully!');
    }
}

