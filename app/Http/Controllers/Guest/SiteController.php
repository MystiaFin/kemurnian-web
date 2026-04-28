<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Fasilitas;
use App\Models\Hero;
use App\Models\Kurikulum;
use App\Models\News;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use Inertia\Inertia;

class SiteController extends Controller
{
    private const CATEGORY_FILTERS = [
        'sekolah-kemurnian' => ['TK Kemurnian', 'SD Kemurnian', 'SMP Kemurnian'],
        'sekolah-kemurnian-ii' => ['TK Kemurnian II', 'SD Kemurnian II', 'SMP Kemurnian II'],
        'sekolah-kemurnian-iii' => ['TK Kemurnian III', 'SD Kemurnian III'],
    ];

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
        $latestNews = $this->getLatestNews();
        $enrollment = Enrollment::first();

        return Inertia::render('Guest/Home', [
            'hero' => $hero,
            'kurikulum' => $kurikulum,
            'latestNews' => $latestNews,
            'enrollment' => $enrollment ? $this->formatEnrollment($enrollment) : null,
            'searchPages' => $this->buildSearchPages(),
        ]);
    }

    public function about()
    {
        return Inertia::render('Guest/About', [
            'searchPages' => $this->buildSearchPages(),
        ]);
    }

    public function enrollment()
    {
        $enrollment = Enrollment::first();

        return Inertia::render('Guest/Enrollment', [
            'enrollment' => $enrollment ? $this->formatEnrollment($enrollment) : null,
            'searchPages' => $this->buildSearchPages(),
        ]);
    }

    public function newsIndex()
    {
        $allNews = $this->mapNewsCollection(News::orderBy('date', 'desc')->get());
        $initialNews = $allNews->slice(0, 12)->values();

        return Inertia::render('Guest/News/Index', [
            'allNews' => $allNews,
            'initialNews' => $initialNews,
            'searchPages' => $this->buildSearchPages(),
        ]);
    }

    public function newsCategory(string $slug)
    {
        $filters = self::CATEGORY_FILTERS[$slug] ?? null;
        if (!$filters) {
            abort(404);
        }

        $filtered = $this->mapNewsCollection(
            News::whereIn('from', $filters)->orderBy('date', 'desc')->get()
        );
        $initialNews = $filtered->slice(0, 12)->values();

        return Inertia::render('Guest/News/Category', [
            'category' => $slug,
            'allNews' => $filtered,
            'initialNews' => $initialNews,
            'searchPages' => $this->buildSearchPages(),
        ]);
    }

    public function newsDetail(int $id)
    {
        $news = News::find($id);
        $formatted = $news ? $this->mapNewsRecord($news) : null;

        $recent = $this->getLatestNews();
        $otherNews = $recent->filter(function ($item) use ($id) {
            return (int) $item['id'] !== $id;
        })->values();

        return Inertia::render('Guest/News/Detail', [
            'news' => $formatted,
            'otherNews' => $otherNews,
            'searchPages' => $this->buildSearchPages(),
        ]);
    }

    public function kurikulumDetail(int $id)
    {
        $kurikulum = Kurikulum::find($id);

        return Inertia::render('Guest/KurikulumDetail', [
            'kurikulum' => $kurikulum,
            'searchPages' => $this->buildSearchPages(),
        ]);
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
                    'image_urls' => $this->mapImageUrl($item->getRawOriginal('image_url')),
                ];
            })
            ->values();

        return Inertia::render('Guest/Schools/Index', [
            'sekolah' => $sekolah,
            'fasilitas' => $fasilitas,
            'searchPages' => $this->buildSearchPages(),
        ]);
    }

    public function unitDetail(string $detail)
    {
        return Inertia::render('Guest/Unit/Detail', [
            'detail' => $detail,
            'searchPages' => $this->buildSearchPages(),
        ]);
    }

    private function mapImageUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        $baseUrl = rtrim(config('app.url'), '/') . '/uploads/';
        return $baseUrl . ltrim($path, '/');
    }

    private function mapImageUrls(?array $paths): array
    {
        if (!$paths) {
            return [];
        }

        return array_values(array_filter(array_map(function ($path) {
            return $this->mapImageUrl($path);
        }, $paths)));
    }

    private function mapNewsRecord(News $news): array
    {
        $raw = $news->getRawOriginal('image_urls');
        $paths = is_array($raw) ? $raw : (is_string($raw) ? json_decode($raw, true) : []);

        return [
            'id' => $news->id,
            'title' => $news->title,
            'body' => $news->body,
            'date' => $news->date?->format('Y-m-d'),
            'from' => $news->from,
            'embed' => $news->embed,
            'image_urls' => $this->mapImageUrls(is_array($paths) ? $paths : []),
        ];
    }

    private function mapNewsCollection($collection)
    {
        return $collection->map(function (News $news) {
            return $this->mapNewsRecord($news);
        });
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

    private function getLatestNews()
    {
        $latestDate = News::orderBy('date', 'desc')->value('date');

        if (!$latestDate) {
            return $this->mapNewsCollection(News::orderBy('date', 'desc')->limit(9)->get());
        }

        $cutoff = Carbon::parse($latestDate)->subYears(2)->toDateString();

        return $this->mapNewsCollection(
            News::where('date', '>=', $cutoff)->orderBy('date', 'desc')->limit(9)->get()
        );
    }

    private function buildSearchPages(): array
    {
        $pages = [
            ['title' => 'Home', 'url' => '/'],
            ['title' => 'About', 'url' => '/about'],
            ['title' => 'News', 'url' => '/news'],
            ['title' => 'Enrollment', 'url' => '/enrollment'],
        ];

        $kurikulums = Kurikulum::orderBy('order')->get(['id', 'title']);
        foreach ($kurikulums as $item) {
            $pages[] = [
                'title' => $item->title,
                'url' => '/kurikulum/' . $item->id,
            ];
        }

        $news = News::orderBy('date', 'desc')->get(['id', 'title']);
        foreach ($news as $item) {
            $pages[] = [
                'title' => $item->title,
                'url' => '/news-detail/' . $item->id,
            ];
        }

        return $pages;
    }
}
