<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EnrollmentController extends Controller
{
    public function index()
    {
        $enrollment = Enrollment::first();

        return Inertia::render('Admin/Enrollment/Index', [
            'enrollment' => $enrollment ? $this->formatEnrollment($enrollment) : null,
        ]);
    }

    public function create()
    {
        $existing = Enrollment::first();
        if ($existing) {
            return redirect()->route('admin.enrollment.edit', $existing->id);
        }

        return Inertia::render('Admin/Enrollment/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'body' => 'required|string',
            'date' => 'required|date',
            'image' => 'nullable|image|max:10240',
        ]);

        $path = $this->storeImage($request);

        Enrollment::create([
            'title' => $request->title,
            'body' => $this->sanitizeBody($request->body),
            'date' => $request->date,
            'image_url' => $path,
        ]);

        return redirect()->route('admin.enrollment')->with('success', 'Enrollment created successfully');
    }

    public function edit($id)
    {
        $enrollment = Enrollment::findOrFail($id);

        return Inertia::render('Admin/Enrollment/Edit', [
            'enrollment' => $this->formatEnrollment($enrollment),
            'image_path' => $enrollment->getRawOriginal('image_url'),
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string',
            'body' => 'required|string',
            'date' => 'required|date',
            'image' => 'nullable|image|max:10240',
            'deleteImage' => 'nullable',
        ]);

        $enrollment = Enrollment::findOrFail($id);
        $path = $enrollment->getRawOriginal('image_url');
        $newPath = $this->storeImage($request);
        $deleteImage = filter_var($request->input('deleteImage'), FILTER_VALIDATE_BOOLEAN);

        if ($newPath) {
            $this->deleteImageFile($path);
            $path = $newPath;
        } elseif ($deleteImage) {
            $this->deleteImageFile($path);
            $path = null;
        }

        $enrollment->update([
            'title' => $request->title,
            'body' => $this->sanitizeBody($request->body),
            'date' => $request->date,
            'image_url' => $path,
        ]);

        return redirect()->route('admin.enrollment')->with('success', 'Enrollment updated successfully');
    }

    public function deleteImage($id)
    {
        $enrollment = Enrollment::findOrFail($id);
        $path = $enrollment->getRawOriginal('image_url');

        $this->deleteImageFile($path);
        $enrollment->update(['image_url' => null]);

        return back()->with('success', 'Enrollment image deleted successfully');
    }

    private function sanitizeBody(?string $body): ?string
    {
        if ($body === null) {
            return null;
        }

        $cleaned = preg_replace('/&nbsp;|\xC2\xA0/i', ' ', $body);
        return $cleaned !== null ? trim($cleaned) : $body;
    }

    private function storeImage(Request $request): ?string
    {
        $file = $request->file('image');
        if (!$file || !$file->isValid()) {
            return null;
        }

        $folder = 'enrollment';
        $filename = now()->timestamp . '_' . $file->hashName();
        $relativePath = $folder . '/' . $filename;

        Storage::disk('public_html')->putFileAs($folder, $file, $filename);

        return $relativePath;
    }

    private function deleteImageFile(?string $path): void
    {
        if (!$path) {
            return;
        }

        Storage::disk('public_html')->delete(ltrim($path, '/'));
    }

    private function mapImageUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        $baseUrl = rtrim(config('app.url'), '/') . '/uploads/';
        return $baseUrl . ltrim($path, '/');
    }

    private function formatEnrollment(Enrollment $enrollment): array
    {
        return [
            'id' => $enrollment->id,
            'title' => $enrollment->title,
            'body' => $enrollment->body,
            'date' => $enrollment->date?->format('Y-m-d'),
            'image_url' => $this->mapImageUrl($enrollment->getRawOriginal('image_url')),
        ];
    }
}
