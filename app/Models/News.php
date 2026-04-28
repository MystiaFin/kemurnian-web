<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $fillable = [
        'title',
        'body',
        'date',
        'from',
        'embed',
        'image_urls',
    ];

    protected $casts = [
        'image_urls' => 'array',
        'date' => 'date',
    ];
}
