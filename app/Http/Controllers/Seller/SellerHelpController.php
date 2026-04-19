<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\HelpTicket;

class SellerHelpController extends Controller
{
    public function index()
    {
        return Inertia::render('Seller/SellerHelp', [
            'tickets' => HelpTicket::where('user_id', auth()->id())->latest()->get(),
            'common_questions' => [
                [
                    'question' => 'How are international shipping rates calculated?',
                    'answer' => 'Shipping rates are determined by the weight of your artisanal products and the distance to the destination. Kokommerce provides discounted rates through our partners at DHL and FedEx for all platform sellers.'
                ],
                [
                    'question' => 'When do I receive my payouts?',
                    'answer' => 'Payouts are processed every Monday for the previous week\'s sales.'
                ]
            ]
        ]);
    }
}
