<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HealthParameter extends Model
{
    protected $fillable = ['utilisateur_id', 'tension', 'poids', 'température', 'date_enregistrement'];

    public function user()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }
}