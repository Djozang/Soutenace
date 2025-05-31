<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Admin;
use App\Models\Patient;
use App\Models\Nutritionniste;
use App\Models\HealthCondition;
use App\Models\MealPlan;
use App\Models\HealthParameter;
use App\Models\Notification;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasFactory;


    protected $fillable = [
        'nom',
        'email',
        'password',
        'role',
    ];

    protected $hidden = ['password'];

    public function admin()
    {
        return $this->hasOne(Admin::class);
    }

    public function patient()
    {
        return $this->hasOne(Patient::class);
    }
    public function nutritionniste()
    {
        return $this->hasOne(Nutritionniste::class);
    }

    public function healthCondition()
    {
        return $this->hasOne(HealthCondition::class);
    }

    public function healthConditions()
    {
        return $this->belongsToMany(HealthCondition::class, 'user_health_condition')
            ->withTimestamps();
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
