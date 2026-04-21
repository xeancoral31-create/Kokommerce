<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'buyer_id',
        'order_reference',
        'subtotal',
        'delivery_fee',
        'total_amount',
        'status',
        'payment_method',
        'delivery_address',
        'items_data',
    ];

    protected $casts = [
        'items_data' => 'array',
    ];

    public function buyer()
    {
        return $this->belongsTo(Buyer::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
