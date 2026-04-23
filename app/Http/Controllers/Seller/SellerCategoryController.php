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
        // Heuristic: Link products to category_id if they have a matching 'category' string but no ID
        $unlinkedProducts = Product::whereNull('category_id')->get();
        if ($unlinkedProducts->count() > 0) {
            foreach ($unlinkedProducts as $product) {
                // Try matching by the 'category' string field if it exists
                if ($product->category) {
                    $match = Category::where('name', 'LIKE', '%' . $product->category . '%')->first();
                    if ($match) {
                        $product->update(['category_id' => $match->id]);
                    }
                }
            }
        }

        return Inertia::render('Seller/SellerCategories', [
            'categories' => Category::withCount('products')->orderBy('name')->get(),
            'archived_categories' => Category::onlyTrashed()->withCount('products')->orderBy('name')->get(),
            'total_products' => Product::count()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'image_file' => 'nullable|image|max:2048',
            'image' => 'nullable|string'
        ]);

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('categories', 'public');
            $validated['image'] = '/storage/' . $path;
        }

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
            'image_file' => 'nullable|image|max:2048',
            'image' => 'nullable|string'
        ]);

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('categories', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $category->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'status' => $validated['status'],
            'image' => $validated['image'] ?? $category->image
        ]);

        return redirect()->back();
    }


    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->back()->with('success', 'Collection archived successfully!');
    }

    public function restore($id)
    {
        Category::withTrashed()->findOrFail($id)->restore();
        return redirect()->back()->with('success', 'Collection restored successfully!');
    }

    public function forceDelete($id)
    {
        Category::withTrashed()->findOrFail($id)->forceDelete();
        return redirect()->back()->with('success', 'Collection permanently deleted!');
    }
}
