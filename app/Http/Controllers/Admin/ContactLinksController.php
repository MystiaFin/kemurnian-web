<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactLink;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Enums\SchoolGroup;
use App\Enums\SchoolLevel;

class ContactLinksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $schoolGroups = [];
        foreach (SchoolGroup::cases() as $group) {
            $schoolGroups[] = [
                'value' => $group->value,
                'label' => $group->label(),
            ];
        }

        $schoolLevels = [];
        foreach (SchoolLevel::cases() as $level) {
            $schoolLevels[] = [
                'value' => $level->value,
                'label' => $level->label(),
            ];
        }

        return Inertia::render('Admin/ContactLinks/Index', [
            'contactLinks' => ContactLink::all(),
            'schoolGroups' => $schoolGroups,
            'schoolLevels' => $schoolLevels,
        ]);
    }

    public function create()
    {
        $schoolGroups = [];
        foreach (SchoolGroup::cases() as $group) {
            $schoolGroups[] = [
                'value' => $group->value,
                'label' => $group->label(),
            ];
        }

        $schoolLevels = [];
        foreach (SchoolLevel::cases() as $level) {
            $schoolLevels[] = [
                'value' => $level->value,
                'label' => $level->label(),
            ];
        }

        return Inertia::render('Admin/ContactLinks/Create', [
            'schoolGroups' => $schoolGroups,
            'schoolLevels' => $schoolLevels,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'school_group' => 'required|string|max:255',
            'school_level' => 'required|string|max:255',
            'url' => 'required|url|max:255',
        ]);

        ContactLink::create([
            'name' => $request->name,
            'school_group' => $request->school_group,
            'school_level' => $request->school_level,
            'url' => $request->url,
        ]);

        return redirect()->route('admin.contact-links')->with('success', 'Contact link created!');
    }

    /**
     * Display the specified resource.
     */
    public function show(ContactLink $contactLink)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ContactLink $contactLink)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ContactLink $contactLink)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'school_group' => 'required|string|max:255',
            'school_level' => 'required|string|max:255',
            'url' => 'required|url|max:255',
        ]);

        $contactLink->update($validated);

        return back()->with('success', 'Contact link updated.');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ContactLink $contactLink)
    {
        //
    }
}
