<?php

namespace Database\Factories;

use App\Models\Alumni;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Universities;
use App\Models\JobTitles;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * @extends Factory<Alumni>
 */
class AlumniFactory extends Factory
{
    private static int $imageIndex = 0;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'graduation_year' => fake()->numberBetween(2000, 2024),
            'motto' => fake()->sentence(),
            'university_id' => Universities::inRandomOrder()->value('id'),
            'job_title_id' => JobTitles::inRandomOrder()->value('id'),
            'image_url' => $this->storeAlumniImage(),
        ];
    }

    private function storeAlumniImage(): ?string
    {
        $dir = base_path('database/seeders/assets/alumni');
        if (!is_dir($dir)) {
            return null;
        }

        $files = glob($dir . '/*.{jpg,jpeg,png,webp}', GLOB_BRACE) ?: [];
        $files = array_values(array_filter($files, 'is_file'));
        if (!$files) {
            return null;
        }

        $source = $this->pickSeedImage($files);
        $contents = file_get_contents($source);
        if ($contents === false) {
            return null;
        }

        $extension = pathinfo($source, PATHINFO_EXTENSION) ?: 'jpg';
        $filename = 'alumni/' . Str::uuid()->toString() . '.' . $extension;

        try {
            Storage::disk('public_html')->put($filename, $contents);
            return $filename;
        } catch (\Throwable $e) {
            if (!app()->environment('local')) {
                return null;
            }
        }

        $localPath = public_path('uploads/' . $filename);
        $localDir = dirname($localPath);
        if (!is_dir($localDir)) {
            mkdir($localDir, 0775, true);
        }

        if (file_put_contents($localPath, $contents) === false) {
            return null;
        }

        return $filename;
    }

    private function pickSeedImage(array $files): string
    {
        sort($files, SORT_NATURAL | SORT_FLAG_CASE);

        $index = self::$imageIndex % count($files);
        self::$imageIndex += 1;

        return $files[$index];
    }
}
