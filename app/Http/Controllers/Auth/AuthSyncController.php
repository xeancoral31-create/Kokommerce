<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AuthSyncController extends Controller
{
    public function sync(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'clerk_id' => 'required',
            'name' => 'required',
            'image' => 'nullable|string'
        ]);

        $email = $request->email;
        $clerk_id = $request->clerk_id;
        $name = $request->name;
        $image = $request->image;

        // Whitelist Logic (Image 1 Req)
        $isWhitelisted = DB::table('seller_whitelist')->where('email', $email)->exists();
        $role = $isWhitelisted ? 'seller' : 'buyer';

        // Secure Role Assignment & Credential Management
        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'role' => $role,
                'image' => $image,
                'status' => 'Active',
                'email_verified_at' => now(),
                'password' => bcrypt(Str::random(24)), // Secure placeholder for Clerk-managed accounts
                'last_active_at' => now()
            ]
        );

        Auth::login($user);

        return response()->json([
            'success' => true,
            'role' => $role,
            'redirect' => $role === 'seller' ? route('seller.dashboard') : route('buyer.home')
        ]);
    }
}
