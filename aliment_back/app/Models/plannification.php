<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class plannification extends Model
{
    protected $fillable = [
        'repas_id',
        'type_de_repas',
        'date'

    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function repas()
    {
        return $this->hasMany(repas::class);
    }

    public function recettes()
    {
        return $this->hasMany(Recipe::class);
    }
}
