<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MealPlan extends Model
{
    protected $fillable = ['utilisateur_id', 'meal_id', 'date', 'type_repas'];

    public function user()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    public function meal()
    {
        return $this->belongsTo(Meal::class, 'meal_id');
    }
}