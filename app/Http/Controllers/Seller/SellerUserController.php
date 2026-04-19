<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\User;

class SellerUserController extends Controller
{
    public function index()
    {
        return Inertia::render('Seller/SellerUsers', [
            'users' => User::latest()->get(),
            'stats' => [
                'total_members' => 1284,
                'active_now' => 42,
                'permissions_audit' => 'Clean'
            ]
        ]);
    }
}
