<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Fasilitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FasilitasController extends Controller
{
    private const SCHOOL_MAP = [
        'sekolah-kemurnian-1' => 'Sekolah Kemurnian I',
        'sekolah-kemurnian-2' => 'Sekolah Kemurnian II',
        'sekolah-kemurnian-3' => 'Sekolah Kemurnian III',
    ];

    public function index()
    {
        $schools = array_keys(self::SCHOOL_MAP);
        $grouped = [];

        foreach ($schools as $school) {
            $items = Fasilitas::where('nama_sekolah', $school)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function (Fasilitas $item) {
                    return [
                        'id' => $item->id,
                        'nama_sekolah' => $item->nama_sekolah,
                        'title' => $item->title,
                        'image_url' => $this->mapImageUrl($item->getRawOriginal('image_url')),
                    ];
                })
                ->values()
                ->all();

            $grouped[$school] = $items;
        }

        return Inertia::render('Admin/Fasilitas/Index', [
            'grouped' => $grouped,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Fasilitas/Create', [
            'schoolOptions' => self::SCHOOL_MAP,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_sekolah' => 'required|string',
            'images' => 'required',
            'images.*' => 'image|max:10240',
            'titles' => 'required',
            'titles.*' => 'required|string',
        ]);

        $school = $request->input('nama_sekolah');
        $folderName = self::SCHOOL_MAP[$school] ?? null;
        if (!$folderName) {
            return back()->with('error', 'Invalid school selection');
        }

        $files = $request->file('images', []);
        if ($files instanceof \Illuminate\Http\UploadedFile) {
            $files = [$files];
        }

        $titles = $request->input('titles', []);
        if (is_string($titles)) {
            $titles = [$titles];
        }
        if (count($files) !== count($titles)) {
            return back()->with('error', 'Number of images and titles must match');
        }

        $records = [];
        $now = now();
        $folder = 'fasilitas/' . $folderName;

        foreach ($files as $index => $file) {
            $title = $titles[$index] ?? null;
            if (!$file || !$file->isValid() || !$title) {
                continue;
            }

            $trimmedTitle = trim($title);
            if ($trimmedTitle === '') {
                continue;
            }

            $filename = $now->timestamp . '_' . $index . '_' . $file->hashName();
            $path = $this->storeFile($file, $folder, $filename);

            if (!$path) {
                continue;
            }

            $records[] = [
                'nama_sekolah' => $school,
                'title' => $trimmedTitle,
                'image_url' => $path,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        if (empty($records)) {
            return back()->with('error', 'No valid facilities to insert');
        }

        Fasilitas::insert($records);

        return redirect()->route('admin.fasilitas')->with('success', 'Facilities uploaded successfully');
    }

    public function destroy($id)
    {
        $facility = Fasilitas::findOrFail($id);
        $path = $facility->getRawOriginal('image_url');

        $this->deleteFile($path);
        $facility->delete();

        return back()->with('success', 'Facility deleted successfully');
    }

    private function storeFile($file, string $folder, string $filename): ?string
    {
        $relativePath = $folder . '/' . $filename;
        Storage::disk('public_html')->putFileAs($folder, $file, $filename);
        return $relativePath;
    }

    private function deleteFile(?string $path): void
    {
        if (!$path) {
            return;
        }

        $relativePath = ltrim($path, '/');
        Storage::disk('public_html')->delete($relativePath);
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
