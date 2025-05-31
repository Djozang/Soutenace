<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HealthCondition extends Model
{
    protected $fillable = ['name', 'description'];

    // HealthCondition.php
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_health_condition');
    }
}
