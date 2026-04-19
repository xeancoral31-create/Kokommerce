<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\Category;
use App\Models\Product;

class SellerCategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Seller/SellerCategories', [
            'categories' => Category::withCount('products')->get(),
            'total_products' => Product::count()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|string'
        ]);

        Category::create([
            'name' => $validated['name'],
            'slug' => \Illuminate\Support\Str::slug($validated['name']),
            'description' => $validated['description'],
            'image' => $validated['image'] ?? 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
            'status' => 'Active'
        ]);

        return redirect()->back();
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|string',
            'image' => 'nullable|string'
        ]);

        $category->update($validated);

        return redirect()->back();
    }


    public function destroy(Category $category)
    {
        // Optional: Reassign products to a default category before deleting?
        // For now, simple delete.
        $category->delete();

        return redirect()->back();
    }
}
