<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Hero extends Model
{
    protected $fillable = [
        'header_text',
        'button_text',
        'href',
        'desktop_image',
        'tablet_image',
        'mobile_image',
        'order',
    ];
    protected function desktopImage(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ? config('app.url') . '/uploads/' . $value : null,
        );
    }

    protected function tabletImage(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ? config('app.url') . '/uploads/' . $value : null,
        );
    }

    protected function mobileImage(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ? config('app.url') . '/uploads/' . $value : null,
        );
    }
}
