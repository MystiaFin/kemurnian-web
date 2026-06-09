<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Enums\SchoolGroup;
use App\Enums\SchoolLevel;
use Illuminate\Database\Eloquent\Model;

class ContactLinks extends Model
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
}
