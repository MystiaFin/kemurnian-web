<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Alumni extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'graduation_year',
        'university_id',
        'job_title_id',
        'motto',
        'image_url',
    ];

    public function university(): BelongsTo
    {
        return $this->belongsTo(Universities::class, 'university_id');
    }

    public function jobTitle(): BelongsTo
    {
        return $this->belongsTo(JobTitle::class, 'job_title_id');
    }
}
