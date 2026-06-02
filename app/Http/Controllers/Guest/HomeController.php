<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Hero;
use App\Models\Kurikulum;
use App\Services\GuestPageData;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __construct(private GuestPageData $pageData)
    {
    }

    public function home()
    {
        $hero = Hero::orderBy('order')->get()->map(function (Hero $item) {
            return [
                'id' => $item->id,
                'header_text' => $item->header_text,
                'button_text' => $item->button_text,
                'href_text' => $item->href,
                'image_urls' => $item->desktop_image,
                'tablet_image_urls' => $item->tablet_image,
                'mobile_image_urls' => $item->mobile_image,
                'order' => $item->order,
            ];
        })->values();

        $kurikulum = Kurikulum::orderBy('order')->get();
        $latestNews = $this->pageData->getLatestNews();
        $enrollment = Enrollment::first();

        return Inertia::render('Guest/Home', [
            'hero' => $hero,
            'kurikulum' => $kurikulum,
            'latestNews' => $latestNews,
            'enrollment' => $enrollment ? $this->pageData->formatEnrollment($enrollment) : null,
            'searchPages' => $this->pageData->buildSearchPages(),
        ]);
    }

    public function about()
    {
        return Inertia::render('Guest/About', [
            'searchPages' => $this->pageData->buildSearchPages(),
        ]);
    }
}
