<?php

namespace Database\Seeders;

use App\Models\Alumni;
use App\Models\JobTitles;
use App\Models\Universities;
use App\Models\Kurikulum;
use App\Models\User;
use App\Models\ContactLinks;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (app()->environment('local', 'testing')) {
            $this->command->info('Local environment detected. Generating fake data...');

            User::firstOrCreate(
                ['email' => 'admin@example.com'],
                [
                    'name' => 'Admin',
                    'password' => Hash::make('password'),
                    'is_admin' => true,
                    'email_verified_at' => now(),
                ]
            );

            Universities::factory()->count(5)->create();
            JobTitles::factory()->count(5)->create();
            Alumni::factory()->count(5)->create();
            Kurikulum::factory(4)->create();
            ContactLinks::factory()->count(5)->create();

            $this->command->info('Fake data seeded successfully!');

        } else {
            $this->command->warn('Production environment detected. Fake data seeding was skipped.');
        }
    }
}
