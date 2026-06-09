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
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // TODO: empty order by. decide later
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

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $university = University::orderBy('name')->get(['id', 'name']);
        $jobTitle = JobTitle::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Alumni/Create', [
            'university' => $university,
            'jobTitle' => $jobTitle,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $currentYear = now()->year;

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'graduation_year' => ['required', 'integer', 'min:1900', 'max:' . ($currentYear + 1)],
            'university_id' => ['nullable', 'exists:university,id'],
            'job_title_id' => ['nullable', 'exists:job_title,id'],
            'motto' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'max:10240'],
        ]);

        $validated['image_url'] = $this->storeImage($request);
        unset($validated['image']);

        Alumni::create($validated);

        return redirect()->route('admin.alumni');
    }

    public function storeUniversity(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $university = University::create($validated);

        return response()->json($university);
    }

    public function storeJobTitle(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $jobTitle = JobTitle::create($validated);

        return response()->json($jobTitle);
    }

    public function updateUniversity(Request $request, University $university): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $university->update($validated);

        return response()->json($university);
    }

    public function updateJobTitle(Request $request, JobTitle $jobTitle): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $jobTitle->update($validated);

        return response()->json($jobTitle);
    }

    private function storeImage(Request $request): ?string
    {
        $file = $request->file('image');
        if (!$file || !$file->isValid()) {
            return null;
        }

        $folder = 'alumni';
        $filename = now()->timestamp . '_' . $file->hashName();
        $relativePath = $folder . '/' . $filename;

        Storage::disk('public_html')->putFileAs($folder, $file, $filename);

        return $relativePath;
    }

    private function mapImageUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        $baseUrl = rtrim(config('app.url'), '/') . '/uploads/';
        return $baseUrl . ltrim($path, '/');
    }

    private function deleteImageFile(?string $path): void
    {
        if (!$path) {
            return;
        }

        Storage::disk('public_html')->delete(ltrim($path, '/'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Alumni $alumni)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Alumni $alumni)
    {
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

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Alumni $alumni)
    {
        $currentYear = now()->year;

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'graduation_year' => ['required', 'integer', 'min:1900', 'max:' . ($currentYear + 1)],
            'university_id' => ['nullable', 'exists:university,id'],
            'job_title_id' => ['nullable', 'exists:job_title,id'],
            'motto' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'max:10240'],
            'deleteImage' => ['nullable'],
        ]);

        $existingPath = $alumni->getRawOriginal('image_url');
        $newPath = $this->storeImage($request);
        $deleteImage = filter_var($request->input('deleteImage'), FILTER_VALIDATE_BOOLEAN);

        if ($newPath) {
            $this->deleteImageFile($existingPath);
            $validated['image_url'] = $newPath;
        } elseif ($deleteImage) {
            $this->deleteImageFile($existingPath);
            $validated['image_url'] = null;
        }

        unset($validated['image'], $validated['deleteImage']);

        $alumni->update($validated);

        return redirect()->route('admin.alumni');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Alumni $alumni)
    {
        $path = $alumni->getRawOriginal('image_url');
        $this->deleteImageFile($path);

        $alumni->delete();

        return back()->with('success', 'Alumni entry deleted successfully');
    }
}
