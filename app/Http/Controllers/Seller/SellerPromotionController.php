<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\Promotion;

class SellerPromotionController extends Controller
{
    public function index()
    {
        return Inertia::render('Seller/SellerOffers', [
            'promotions' => Promotion::with('product')->latest()->get(),
            'products' => \App\Models\Product::all(),
            'stats' => [
                'total_reach' => '124.8K',
                'active_offers' => Promotion::where('status', 'active')->count(),
                'conversion_rate' => '4.2%'
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'code' => 'required|string|unique:promotions',
            'type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric',
            'product_id' => 'nullable|exists:products,id',
            'image' => 'nullable|string'
        ]);

        Promotion::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Promotion $promotion)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|string',
            'discount_value' => 'required|numeric',
            'product_id' => 'nullable|exists:products,id',
            'image' => 'nullable|string'
        ]);

        $promotion->update($validated);

        return redirect()->back();
    }

    public function destroy(Promotion $promotion)
    {
        $promotion->delete();
        return redirect()->back();
    }

}
