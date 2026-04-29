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
        'solo_price',
        'solo_unit',
        'package_price',
        'package_unit',
        'package_qty',
        'offer_price',
        'status',
        'rating',
        'reviews_count',
        'image',
        'solo_image',
        'package_image',
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
        'solo_price' => 'decimal:2',
        'package_price' => 'decimal:2',
        'package_qty' => 'integer',
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

    protected static function booted()
    {
        static::saving(function ($product) {
            // Auto-generate slug if name is set and slug is empty or name changed
            if ($product->name && (!$product->slug || $product->isDirty('name'))) {
                $product->slug = \Illuminate\Support\Str::slug($product->name);
                
                // Ensure uniqueness by appending a unique string if needed
                $originalSlug = $product->slug;
                $count = 1;
                while (static::where('slug', $product->slug)->where('id', '!=', $product->id)->exists()) {
                    $product->slug = "{$originalSlug}-" . $count++;
                }
            }

            // Auto-update status based on stock
            if ($product->stock <= 0 && $product->status === 'in_stock') {
                $product->status = 'sold_out';
            } elseif ($product->stock > 0 && $product->status === 'sold_out') {
                $product->status = 'in_stock';
            }
        });
    }
}
