<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'offer_price',
        'category', // Keep for backward compatibility if needed, or remove
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

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function promotions()
    {
        return $this->hasMany(Promotion::class);
    }

}
