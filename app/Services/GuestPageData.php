<?php

namespace App\Services;

use App\Models\Enrollment;
use App\Models\Kurikulum;
use App\Models\News;
use Carbon\Carbon;

class GuestPageData
{
    public function buildSearchPages(): array
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

    public function mapImageUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        $baseUrl = rtrim(config('app.url'), '/') . '/uploads/';
        return $baseUrl . ltrim($path, '/');
    }

    public function mapImageUrls(?array $paths): array
    {
        if (!$paths) {
            return [];
        }

        return array_values(array_filter(array_map(function ($path) {
            return $this->mapImageUrl($path);
        }, $paths)));
    }

    public function mapNewsRecord(News $news): array
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

    public function mapNewsCollection($collection)
    {
        return $collection->map(function (News $news) {
            return $this->mapNewsRecord($news);
        });
    }

    public function formatEnrollment(Enrollment $enrollment): array
    {
        return [
            'id' => $enrollment->id,
            'title' => $enrollment->title,
            'body' => $enrollment->body,
            'date' => $enrollment->date?->format('Y-m-d'),
            'image_url' => $this->mapImageUrl($enrollment->getRawOriginal('image_url')),
        ];
    }

    public function getLatestNews()
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
}
