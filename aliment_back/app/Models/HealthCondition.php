<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HealthCondition extends Model
{
    protected $fillable = ['name', 'description'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}