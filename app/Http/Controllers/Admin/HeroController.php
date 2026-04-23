<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Hero;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class HeroController extends Controller
{
    public function index()
    {
        $heroes = Hero::orderBy('order')->get();
        return Inertia::render('Admin/Hero/Index', [
            'heroes' => $heroes
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Hero/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'desktopImage' => 'required|image|max:10240',
            'tabletImage' => 'nullable|image|max:10240',
            'mobileImage' => 'nullable|image|max:10240',
        ]);

        $hero = new Hero();
        $hero->header_text = $request->headerText;
        $hero->button_text = $request->buttonText;
        $hero->href = $request->hrefText;
        $hero->order = Hero::max('order') + 1;

        if ($request->hasFile('desktopImage')) {
            $path = $request->file('desktopImage')->store('hero/desktop', 'public_html');
            $hero->desktop_image = $path;
        }
        if ($request->hasFile('tabletImage')) {
            $path = $request->file('tabletImage')->store('hero/tablet', 'public_html');
            $hero->tablet_image = $path;
        }
        if ($request->hasFile('mobileImage')) {
            $path = $request->file('mobileImage')->store('hero/mobile', 'public_html');
            $hero->mobile_image = $path;
        }
        $hero->save();

        return redirect()->route('admin.hero')->with('success', 'Hero banner created!');
    }

    public function destroy($id)
    {
        $hero = Hero::findOrFail($id);

        // Delete files from public_html
        foreach (['desktop_image', 'tablet_image', 'mobile_image'] as $field) {
            $raw = $hero->getRawOriginal($field);
            if ($raw) {
                Storage::disk('public_html')->delete($raw);
            }
        }

        $hero->delete();
        return back()->with('success', 'Hero banner deleted.');
    }

    public function reorder(Request $request)
    {
        foreach ($request->order as $index => $id) {
            Hero::where('id', $id)->update(['order' => $index + 1]);
        }
        return back()->with('success', 'Order saved.');
    }
}
