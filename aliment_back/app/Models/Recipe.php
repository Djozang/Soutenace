<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    protected $fillable = ['repas_id', 'type_contenu', 'contenu', 'url_média', 'validé'];

    public function repas()
    {
        return $this->belongsTo(Meal::class, 'repas_id');
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}