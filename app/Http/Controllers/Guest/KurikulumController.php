<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Kurikulum;
use App\Services\GuestPageData;
use Inertia\Inertia;

class KurikulumController extends Controller
{
    public function kurikulumDetail(int $id)
    {
        $kurikulum = Kurikulum::find($id);

        return Inertia::render('Guest/KurikulumDetail', [
            'kurikulum' => $kurikulum,
            'searchPages' => $this->pageData()->buildSearchPages(),
        ]);
    }

    private function pageData(): GuestPageData
    {
        return new GuestPageData();
    }
}
