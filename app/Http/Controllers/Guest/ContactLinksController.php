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
            'contactLinks' => ContactLink::orderBy('school_group')->get(),
            'schoolGroups' => collect(SchoolGroup::cases())->map(fn($group) => [
                'value' => $group->value,
                'label' => $group->label(),
            ])->values(),
        ]);
    }
}
