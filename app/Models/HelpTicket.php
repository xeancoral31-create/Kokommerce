<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HelpTicket extends Model
{
    protected $fillable = [
        'user_id',
        'subject',
        'description',
        'category',
        'status',
        'priority'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
