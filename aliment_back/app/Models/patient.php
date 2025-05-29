<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class patient extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'user_id',
        'état_santé',
        'maladie'
    ];

    protected $hidden = ['mot_de_passe'];
    public function user() 
    {
        return $this->belongsTo(User::class);
    }

    public function healthConditions()
    {
        return $this->hasMany(HealthCondition::class);
    }

    public function mealPlans()
    {
        return $this->hasMany(MealPlan::class);
    }

    public function healthParameters()
    {
        return $this->hasMany(HealthParameter::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
