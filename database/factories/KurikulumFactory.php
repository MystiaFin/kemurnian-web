<?php

namespace Database\Factories;

use App\Models\Kurikulum;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Kurikulum>
 */
class KurikulumFactory extends Factory
{
    protected $model = Kurikulum::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->words(3, true);

        return [
            'title' => ucfirst($title),
            'body' => fake()->paragraphs(4, true),
            'preview' => fake()->optional()->sentence(18),
            'order' => fake()->numberBetween(1, 20),
        ];
    }
}
