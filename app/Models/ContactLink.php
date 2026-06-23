<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Enums\SchoolGroup;
use App\Enums\SchoolLevel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ContactLink extends Model
{
    /** @use HasFactory<\Database\Factories\ContactLinkFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'url',
        'school_group',
        'school_level'
    ];

    protected $casts = [
        'school_group' => SchoolGroup::class,
        'school_level' => SchoolLevel::class,
    ];

    public function hourlyClicks(): HasMany
    {
        return $this->hasMany(HourlyClick::class);
    }
}
