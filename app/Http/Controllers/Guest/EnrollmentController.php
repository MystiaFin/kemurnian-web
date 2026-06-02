<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Services\GuestPageData;
use Inertia\Inertia;

class EnrollmentController extends Controller
{
    public function enrollment()
    {
        $enrollment = Enrollment::first();

        return Inertia::render('Guest/Enrollment', [
            'enrollment' => $enrollment ? $this->pageData()->formatEnrollment($enrollment) : null,
            'searchPages' => $this->pageData()->buildSearchPages(),
        ]);
    }

    private function pageData(): GuestPageData
    {
        return new GuestPageData();
    }
}
