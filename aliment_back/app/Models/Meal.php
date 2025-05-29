<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Meal extends Model
{
    protected $fillable = [
        'nom', 'description', 'calories', 'protéines', 'glucides', 'lipides', 'restrictions', 'fréquence'
    ];

    protected $casts = ['restrictions' => 'array'];

    public function recipes()
    {
        return $this->hasMany(Recipe::class, 'meal_id');
    }
}