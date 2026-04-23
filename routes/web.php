<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BuyerController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Auth\AuthSyncController;

// Artisanal Auth Bridge
Route::post('/auth/sync', [AuthSyncController::class, 'sync'])->name('auth.sync');


// Professional and Formal UI Flow Routes
Route::get('/', function () {
    $targetCategories = ['Cakes', 'Bread', 'Cookies', 'kakanin'];
    $favorites = collect($targetCategories)->map(function($catName) {
        return \App\Models\Product::with('category')
            ->whereHas('category', fn($q) => $q->where('name', 'like', $catName))
            ->withCount(['orderItems as total_sold' => function($query) {
                $query->select(\DB::raw('SUM(quantity)'));
            }])
            ->orderByDesc('total_sold')
            ->orderByDesc('rating')
            ->first();
    })->filter()->values();

    return Inertia::render('Home', [
        'favorites' => $favorites,
        'new_arrivals' => \App\Models\Product::with('category')
            ->latest()
            ->take(3)
            ->get(),
        'categories' => \App\Models\Category::all()
    ]);
});

Route::get('/about', function () {
    return Inertia::render('About');
});

Route::get('/shop', function () {
    return Inertia::render('Shop', [
        'products' => \App\Models\Product::with('category')->get(),
        'categories' => \App\Models\Category::all()
    ]);
});

Route::get('/offer', function () {
    return Inertia::render('Offer', [
        'promotions' => \App\Models\Promotion::with('product')->where('status', 'active')->get()
    ]);
});

// Buyer Dashboard Routes (Unprotected as requested)
Route::prefix('buyer')->group(function () {
    Route::get('/home', [BuyerController::class, 'home'])->name('buyer.home');
    Route::get('/shop', [BuyerController::class, 'shop'])->name('buyer.shop');
    Route::get('/offer', [BuyerController::class, 'offer'])->name('buyer.offer');
    Route::get('/history', [BuyerController::class, 'history'])->name('buyer.history');
    Route::get('/account', [BuyerController::class, 'account'])->name('buyer.account');
    Route::get('/cart', [BuyerController::class, 'cart'])->name('buyer.cart');
    Route::get('/delivery', [BuyerController::class, 'delivery'])->name('buyer.delivery');
    Route::get('/payment', [BuyerController::class, 'payment'])->name('buyer.payment');
    
    Route::post('/payment/intent', [OrderController::class, 'createPaymentIntent'])->name('payment.intent');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
});

// Seller Portal Routes (Fully Functional Module)
Route::prefix('seller')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Seller\SellerDashboardController::class, 'index'])->name('seller.dashboard');
    Route::get('/products', [\App\Http\Controllers\Seller\SellerProductController::class, 'index'])->name('seller.products');
    Route::get('/orders', [\App\Http\Controllers\Seller\SellerOrderController::class, 'index'])->name('seller.orders');
    Route::put('/orders/{order}', [\App\Http\Controllers\Seller\SellerOrderController::class, 'update'])->name('seller.orders.update');
    Route::get('/categories', [\App\Http\Controllers\Seller\SellerCategoryController::class, 'index'])->name('seller.categories');
    Route::get('/offers', [\App\Http\Controllers\Seller\SellerPromotionController::class, 'index'])->name('seller.offers');
    Route::get('/analytics', [\App\Http\Controllers\Seller\SellerAnalyticsController::class, 'index'])->name('seller.analytics');
    Route::get('/users', [\App\Http\Controllers\Seller\SellerUserController::class, 'index'])->name('seller.users');
    Route::put('/users/{user}', [\App\Http\Controllers\Seller\SellerUserController::class, 'update'])->name('seller.users.update');
    Route::post('/users/{user}/permissions', [\App\Http\Controllers\Seller\SellerUserController::class, 'togglePermissions'])->name('seller.users.permissions');
    Route::delete('/users/{user}', [\App\Http\Controllers\Seller\SellerUserController::class, 'destroy'])->name('seller.users.destroy');
    Route::get('/activity', [\App\Http\Controllers\Seller\SellerActivityController::class, 'index'])->name('seller.activity');
    Route::get('/settings', [\App\Http\Controllers\Seller\SellerSettingsController::class, 'index'])->name('seller.settings');
    Route::post('/settings/update', [\App\Http\Controllers\Seller\SellerSettingsController::class, 'update'])->name('seller.settings.update');
    Route::get('/help', [\App\Http\Controllers\Seller\SellerHelpController::class, 'index'])->name('seller.help');
    
    // API-like endpoints for CRUD (Actions mentioned in request)
    Route::post('/products', [\App\Http\Controllers\Seller\SellerProductController::class, 'store'])->name('seller.products.store');
    Route::put('/products/{product}', [\App\Http\Controllers\Seller\SellerProductController::class, 'update'])->name('seller.products.update');
    Route::delete('/products/{product}', [\App\Http\Controllers\Seller\SellerProductController::class, 'destroy'])->name('seller.products.destroy');
    Route::post('/products/{id}/restore', [\App\Http\Controllers\Seller\SellerProductController::class, 'restore'])->name('seller.products.restore');
    Route::post('/products/{product}/restock', [\App\Http\Controllers\Seller\SellerProductController::class, 'restock'])->name('seller.products.restock');
    Route::delete('/products/{id}/force', [\App\Http\Controllers\Seller\SellerProductController::class, 'forceDelete'])->name('seller.products.forceDelete');
    
    Route::post('/categories', [\App\Http\Controllers\Seller\SellerCategoryController::class, 'store'])->name('seller.categories.store');
    Route::put('/categories/{category}', [\App\Http\Controllers\Seller\SellerCategoryController::class, 'update'])->name('seller.categories.update');
    Route::delete('/categories/{category}', [\App\Http\Controllers\Seller\SellerCategoryController::class, 'destroy'])->name('seller.categories.destroy');
    Route::post('/categories/{id}/restore', [\App\Http\Controllers\Seller\SellerCategoryController::class, 'restore'])->name('seller.categories.restore');
    Route::delete('/categories/{id}/force', [\App\Http\Controllers\Seller\SellerCategoryController::class, 'forceDelete'])->name('seller.categories.forceDelete');
    
    Route::post('/offers', [\App\Http\Controllers\Seller\SellerPromotionController::class, 'store'])->name('seller.promotions.store');
    Route::put('/offers/{promotion}', [\App\Http\Controllers\Seller\SellerPromotionController::class, 'update'])->name('seller.promotions.update');
    Route::delete('/offers/{promotion}', [\App\Http\Controllers\Seller\SellerPromotionController::class, 'destroy'])->name('seller.promotions.destroy');
    Route::post('/offers/{id}/restore', [\App\Http\Controllers\Seller\SellerPromotionController::class, 'restore'])->name('seller.promotions.restore');
    Route::delete('/offers/{id}/force', [\App\Http\Controllers\Seller\SellerPromotionController::class, 'forceDelete'])->name('seller.promotions.forceDelete');
});



