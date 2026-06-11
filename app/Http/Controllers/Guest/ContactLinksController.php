<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContactLink;
use App\Enums\SchoolGroup;
use Inertia\Inertia;

class ContactLinksController extends Controller
{
    public function index()
    {
        return Inertia::render('Guest/ContactLinks', [
            'contactLinks' => ContactLink::all(),
            'schoolGroups' => collect(SchoolGroup::cases())->map(fn($g) => [
                'value' => $g->value,
                'label' => $g->label(),
            ])->values(),
        ]);
    }
}
