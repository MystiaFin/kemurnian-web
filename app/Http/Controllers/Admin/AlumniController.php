<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Alumni;
use App\Models\JobTitle;
use App\Models\University;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AlumniController extends Controller
{
    public function index()
    {
        $alumni = Alumni::with(['university:id,name', 'jobTitle:id,name'])
            ->orderBy('graduation_year')
            ->get()
            ->map(function (Alumni $item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'graduation_year' => $item->graduation_year,
                    'university' => $item->university?->name,
                    'job_title' => $item->jobTitle?->name,
                    'motto' => $item->motto,
                    'image_url' => $this->mapImageUrl($item->getRawOriginal('image_url')),
                ];
            });

        return Inertia::render('Admin/Alumni/Index', [
            'alumni' => $alumni
        ]);
    }

    public function create()
    {
        $university = University::orderBy('name')->get(['id', 'name']);
        $jobTitle = JobTitle::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Alumni/Create', [
            'university' => $university,
            'jobTitle' => $jobTitle,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'graduation_year' => 'required|integer|min:1900|max:' . (now()->year + 1),
            'university_id' => 'nullable|exists:university,id',
            'job_title_id' => 'nullable|exists:job_title,id',
            'motto' => 'required|string|max:255',
            'image' => 'nullable|image|max:10240',
        ]);

        $alumni = new Alumni();
        $alumni->name = $request->name;
        $alumni->graduation_year = $request->graduation_year;
        $alumni->university_id = $request->university_id;
        $alumni->job_title_id = $request->job_title_id;
        $alumni->motto = $request->motto;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('alumni', 'public_html');
            $alumni->image_url = $path;
        }

        $alumni->save();

        return redirect()->route('admin.alumni')->with('success', 'Alumni entry created!');
    }

    public function edit($id)
    {
        $alumni = Alumni::findOrFail($id);
        $university = University::orderBy('name')->get(['id', 'name']);
        $jobTitles = JobTitle::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Alumni/Edit', [
            'alumni' => [
                'id' => $alumni->id,
                'name' => $alumni->name,
                'graduation_year' => $alumni->graduation_year,
                'university_id' => $alumni->university_id,
                'job_title_id' => $alumni->job_title_id,
                'motto' => $alumni->motto,
                'image_url' => $this->mapImageUrl($alumni->getRawOriginal('image_url')),
            ],
            'image_path' => $alumni->getRawOriginal('image_url'),
            'university' => $university,
            'jobTitles' => $jobTitles,
        ]);
    }

    public function update(Request $request, $id)
    {
        $alumni = Alumni::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'graduation_year' => 'required|integer|min:1900|max:' . (now()->year + 1),
            'university_id' => 'nullable|exists:university,id',
            'job_title_id' => 'nullable|exists:job_title,id',
            'motto' => 'required|string|max:255',
            'image' => 'nullable|image|max:10240',
        ]);

        $alumni->name = $request->name;
        $alumni->graduation_year = $request->graduation_year;
        $alumni->university_id = $request->university_id;
        $alumni->job_title_id = $request->job_title_id;
        $alumni->motto = $request->motto;

        if ($request->hasFile('image')) {
            $raw = $alumni->getRawOriginal('image_url');
            if ($raw) {
                Storage::disk('public_html')->delete($raw);
            }
            $path = $request->file('image')->store('alumni', 'public_html');
            $alumni->image_url = $path;
        }

        if (filter_var($request->input('deleteImage'), FILTER_VALIDATE_BOOLEAN)) {
            $raw = $alumni->getRawOriginal('image_url');
            if ($raw) {
                Storage::disk('public_html')->delete($raw);
            }
            $alumni->image_url = null;
        }

        $alumni->save();

        return redirect()->route('admin.alumni')->with('success', 'Alumni entry updated!');
    }

    public function destroy($id)
    {
        $alumni = Alumni::findOrFail($id);

        $raw = $alumni->getRawOriginal('image_url');
        if ($raw) {
            Storage::disk('public_html')->delete($raw);
        }

        $alumni->delete();

        return back()->with('success', 'Alumni entry deleted.');
    }

    public function storeUniversity(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $university = University::create(['name' => $request->name]);

        return response()->json($university);
    }

    public function storeJobTitle(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $jobTitle = JobTitle::create(['name' => $request->name]);

        return response()->json($jobTitle);
    }

    public function updateUniversity(Request $request, University $university): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $university->update(['name' => $request->name]);

        return response()->json($university);
    }

    public function updateJobTitle(Request $request, JobTitle $jobTitle): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $jobTitle->update(['name' => $request->name]);

        return response()->json($jobTitle);
    }

    private function mapImageUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        $baseUrl = rtrim(config('app.url'), '/') . '/uploads/';
        return $baseUrl . ltrim($path, '/');
    }
}
