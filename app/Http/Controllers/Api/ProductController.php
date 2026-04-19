<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::all());
    }

    public function featured()
    {
        return response()->json(Product::where('is_featured', true)->get());
    }

    public function topRated()
    {
        return response()->json(Product::where('is_top_rated', true)->get());
    }

    public function shop(Request $request)
    {
        $query = Product::query();

        if ($request->has('category')) {
            $query->whereIn('category', (array) $request->category);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        return response()->json($query->paginate(12));
    }
}
