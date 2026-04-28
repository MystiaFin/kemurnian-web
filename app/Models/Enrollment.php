<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    protected $fillable = [
        'title',
        'body',
        'date',
        'image_url',
    ];

    protected $casts = [
        'date' => 'date',
    ];
}
