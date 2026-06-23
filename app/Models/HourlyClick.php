<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HourlyClick extends Model
{
    protected $fillable = [
        'contact_link_id',
        'date_hour',
        'clicks',
    ];

    public function contactLink(): BelongsTo
    {
        return $this->belongsTo(ContactLink::class);
    }
}
