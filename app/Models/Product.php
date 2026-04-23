<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'offer_price',
        'status',
        'rating',
        'reviews_count',
        'image',
        'is_featured',
        'is_new',
        'is_top_rated',
        'tags',
        'stock'
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_new' => 'boolean',
        'is_top_rated' => 'boolean',
        'tags' => 'array',
        'price' => 'decimal:2',
        'offer_price' => 'decimal:2',
        'rating' => 'decimal:1',
        'stock' => 'integer',
    ];

    public function scopePreOrder($query)
    {
        return $query->where('status', 'pre_order');
    }

    public function scopeInStock($query)
    {
        return $query->where('status', 'in_stock');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function promotions()
    {
        return $this->hasMany(Promotion::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
