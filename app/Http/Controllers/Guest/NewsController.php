<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Services\GuestPageData;
use Inertia\Inertia;

class NewsController extends Controller
{
    private const CATEGORY_FILTERS = [
        'sekolah-kemurnian' => ['TK Kemurnian', 'SD Kemurnian', 'SMP Kemurnian'],
        'sekolah-kemurnian-ii' => ['TK Kemurnian II', 'SD Kemurnian II', 'SMP Kemurnian II'],
        'sekolah-kemurnian-iii' => ['TK Kemurnian III', 'SD Kemurnian III'],
    ];

    public function __construct(private GuestPageData $pageData)
    {
    }

    public function newsIndex()
    {
        $allNews = $this->pageData->mapNewsCollection(News::orderBy('date', 'desc')->get());
        $initialNews = $allNews->slice(0, 12)->values();

        return Inertia::render('Guest/News/Index', [
            'allNews' => $allNews,
            'initialNews' => $initialNews,
            'searchPages' => $this->pageData->buildSearchPages(),
        ]);
    }

    public function newsCategory(string $slug)
    {
        $filters = self::CATEGORY_FILTERS[$slug] ?? null;
        if (!$filters) {
            abort(404);
        }

        $filtered = $this->pageData->mapNewsCollection(
            News::whereIn('from', $filters)->orderBy('date', 'desc')->get()
        );
        $initialNews = $filtered->slice(0, 12)->values();

        return Inertia::render('Guest/News/Category', [
            'category' => $slug,
            'allNews' => $filtered,
            'initialNews' => $initialNews,
            'searchPages' => $this->pageData->buildSearchPages(),
        ]);
    }

    public function newsDetail(int $id)
    {
        $news = News::find($id);
        $formatted = $news ? $this->pageData->mapNewsRecord($news) : null;

        $recent = $this->pageData->getLatestNews();
        $otherNews = $recent->filter(function ($item) use ($id) {
            return (int) $item['id'] !== $id;
        })->values();

        return Inertia::render('Guest/News/Detail', [
            'news' => $formatted,
            'otherNews' => $otherNews,
            'searchPages' => $this->pageData->buildSearchPages(),
        ]);
    }
}
