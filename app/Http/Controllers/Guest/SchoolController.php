<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Fasilitas;
use App\Services\GuestPageData;
use Inertia\Inertia;

class SchoolController extends Controller
{
    public function __construct(private GuestPageData $pageData)
    {
    }

    public function sekolah(string $sekolah)
    {
        $fasilitas = Fasilitas::where('nama_sekolah', $sekolah)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function (Fasilitas $item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'image_urls' => $this->pageData->mapImageUrl($item->getRawOriginal('image_url')),
                ];
            })
            ->values();

        return Inertia::render('Guest/Schools/Index', [
            'sekolah' => $sekolah,
            'fasilitas' => $fasilitas,
            'searchPages' => $this->pageData->buildSearchPages(),
        ]);
    }

    public function unitDetail(string $detail)
    {
        return Inertia::render('Guest/Unit/Detail', [
            'detail' => $detail,
            'searchPages' => $this->pageData->buildSearchPages(),
        ]);
    }
}
