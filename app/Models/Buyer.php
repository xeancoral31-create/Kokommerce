<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Buyer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'member_since',
        'grain_points',
        'hearth_status',
        'address',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
