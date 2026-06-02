<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Kurikulum;
use App\Services\GuestPageData;
use Inertia\Inertia;

class KurikulumController extends Controller
{
    public function __construct(private GuestPageData $pageData)
    {
    }

    public function kurikulumDetail(int $id)
    {
        $kurikulum = Kurikulum::find($id);

        return Inertia::render('Guest/KurikulumDetail', [
            'kurikulum' => $kurikulum,
            'searchPages' => $this->pageData->buildSearchPages(),
        ]);
    }
}
