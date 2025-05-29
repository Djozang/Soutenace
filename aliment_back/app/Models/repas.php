<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class repas extends Model
{
    protected $fillable = [
        'nom',
        
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
