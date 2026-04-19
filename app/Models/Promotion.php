<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    protected $fillable = [
        'product_id',
        'title',
        'description',
        'code',
        'type',
        'discount_value',
        'start_date',
        'end_date',
        'status',
        'image',
        'redemptions',
        'revenue'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }


    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'discount_value' => 'decimal:2',
        'revenue' => 'decimal:2',
    ];
}
