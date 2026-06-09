<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HourlyClick extends Model
{
    protected $fillable = [
        'contact_link_id',
        'date_hour',
        'clicks',
    ];
}
