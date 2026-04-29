<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'seller_notifications' => [
                'low_stock' => \App\Models\Product::where('stock', '<', 5)->get(),
                'recent' => \App\Models\Notification::where('user_id', auth()->id())
                            ->where('is_read', false)
                            ->latest()
                            ->take(10)
                            ->get()
            ],
            'store_profile' => session('store_profile', [
                'name' => 'Kokommerce Artisanal',
                'tagline' => 'Handcrafted Joy in Every Crumb',
                'description' => 'Authentic sourdough techniques passed down through three generations...',
                'image' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
            ]),
            'auth_user' => \Illuminate\Support\Facades\Auth::check() ? [
                'name'   => \Illuminate\Support\Facades\Auth::user()->name,
                'image'  => \Illuminate\Support\Facades\Auth::user()->image,
                'online' => true,
            ] : null,
        ]);
    }
}
