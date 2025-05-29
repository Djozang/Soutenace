<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = ['utilisateur_id', 'type', 'message', 'lu'];

    public function user()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }
}