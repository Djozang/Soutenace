<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nutritionniste extends Model
{
    protected $fillable = [
        'user_id',
        'spécialité',
    ];

    /**
     * Get the user associated with the nutritionniste.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    /**
     * Get the patients associated with the nutritionniste.
     */
    public function patients()
    {
        return $this->hasMany(Patient::class);

    }
}