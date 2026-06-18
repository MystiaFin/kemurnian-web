<?php

use Illuminate\Support\Facades\Route;

// Admin
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HeroController;
use App\Http\Controllers\Admin\KurikulumController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\EnrollmentController;
use App\Http\Controllers\Admin\FasilitasController;
use App\Http\Controllers\Admin\AlumniController;
use App\Http\Controllers\Admin\ContactLinksController;

// Guest
use App\Http\Controllers\Guest\HomeController;
use App\Http\Controllers\Guest\EnrollmentController as PublicEnrollmentController;
use App\Http\Controllers\Guest\NewsController as PublicNewsController;
use App\Http\Controllers\Guest\KurikulumController as PublicKurikulumController;
use App\Http\Controllers\Guest\SchoolController;
use App\Http\Controllers\Guest\AlumniController as PublicAlumniController;
use App\Http\Controllers\Guest\ContactLinksController as PublicContactLinksController;

Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/', [DashboardController::class, 'index']);
});

// Admin
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Hero
    Route::get('/hero', [HeroController::class, 'index'])->name('hero');
    Route::get('/hero/create', [HeroController::class, 'create'])->name('hero.create');
    Route::post('/hero', [HeroController::class, 'store'])->name('hero.store');
    Route::get('/hero/edit/{id}', [HeroController::class, 'edit'])->name('hero.edit');
    Route::put('/hero/{id}', [HeroController::class, 'update'])->name('hero.update');
    Route::delete('/hero/{id}', [HeroController::class, 'destroy'])->name('hero.destroy');
    Route::post('/hero/reorder', [HeroController::class, 'reorder'])->name('hero.reorder');

    // Kurikulum
    Route::get('/kurikulum', [KurikulumController::class, 'index'])->name('kurikulum');
    Route::get('/kurikulum/create', [KurikulumController::class, 'create'])->name('kurikulum.create');
    Route::post('/kurikulum', [KurikulumController::class, 'store'])->name('kurikulum.store');
    Route::get('/kurikulum/edit/{id}', [KurikulumController::class, 'edit'])->name('kurikulum.edit');
    Route::put('/kurikulum/{id}', [KurikulumController::class, 'update'])->name('kurikulum.update');
    Route::delete('/kurikulum/{id}', [KurikulumController::class, 'destroy'])->name('kurikulum.destroy');

    // News
    Route::get('/news', [NewsController::class, 'index'])->name('news');
    Route::get('/news/create', [NewsController::class, 'create'])->name('news.create');
    Route::post('/news', [NewsController::class, 'store'])->name('news.store');
    Route::get('/news/edit/{id}', [NewsController::class, 'edit'])->name('news.edit');
    Route::put('/news/{id}', [NewsController::class, 'update'])->name('news.update');
    Route::delete('/news/{id}', [NewsController::class, 'destroy'])->name('news.destroy');

    // Enrollment
    Route::get('/enrollment', [EnrollmentController::class, 'index'])->name('enrollment');
    Route::get('/enrollment/create', [EnrollmentController::class, 'create'])->name('enrollment.create');
    Route::post('/enrollment', [EnrollmentController::class, 'store'])->name('enrollment.store');
    Route::get('/enrollment/edit/{id}', [EnrollmentController::class, 'edit'])->name('enrollment.edit');
    Route::put('/enrollment/{id}', [EnrollmentController::class, 'update'])->name('enrollment.update');
    Route::delete('/enrollment/{id}/image', [EnrollmentController::class, 'deleteImage'])->name('enrollment.image.delete');

    // Fasilitas
    Route::get('/fasilitas', [FasilitasController::class, 'index'])->name('fasilitas');
    Route::get('/fasilitas/create', [FasilitasController::class, 'create'])->name('fasilitas.create');
    Route::post('/fasilitas', [FasilitasController::class, 'store'])->name('fasilitas.store');
    Route::delete('/fasilitas/{id}', [FasilitasController::class, 'destroy'])->name('fasilitas.destroy');

    // Alumni
    Route::get('/alumni', [AlumniController::class, 'index'])->name('alumni');
    Route::get('/alumni/create', [AlumniController::class, 'create'])->name('alumni.create');
    Route::post('/alumni', [AlumniController::class, 'store'])->name('alumni.store');
    Route::get('/alumni/edit/{id}', [AlumniController::class, 'edit'])->name('alumni.edit');
    Route::put('/alumni/{id}', [AlumniController::class, 'update'])->name('alumni.update');
    Route::delete('/alumni/{id}', [AlumniController::class, 'destroy'])->name('alumni.destroy');
    Route::post('/alumni/universities', [AlumniController::class, 'storeUniversity'])->name('alumni.universities.store');
    Route::patch('/alumni/universities/{university}', [AlumniController::class, 'updateUniversity'])->name('alumni.universities.update');
    Route::post('/alumni/job-titles', [AlumniController::class, 'storeJobTitle'])->name('alumni.job-titles.store');
    Route::patch('/alumni/job-titles/{jobTitle}', [AlumniController::class, 'updateJobTitle'])->name('alumni.job-titles.update');

    // Contact Links
    Route::get('/contact-links', [ContactLinksController::class, 'index'])->name('contact-links');
    Route::get('/contact-links/create', [ContactLinksController::class, 'create'])->name('contact-links.create');
    Route::post('/contact-links', [ContactLinksController::class, 'store'])->name('contact-links.store');
    Route::put('/contact-links/{contactLink}', [ContactLinksController::class, 'update'])
        ->name('contact-links.update');
});

// Guest
Route::get('/', [HomeController::class, 'home'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/enrollment', [PublicEnrollmentController::class, 'enrollment'])->name('enrollment.public');
Route::get('/alumni', [PublicAlumniController::class, 'index'])->name('alumni.public');

Route::get('/news', [PublicNewsController::class, 'newsIndex'])->name('news.public');
Route::get('/news/category/{slug}', [PublicNewsController::class, 'newsCategory'])->name('news.category');
Route::get('/news-detail/{id}', [PublicNewsController::class, 'newsDetail'])->whereNumber('id')->name('news.detail');

Route::get('/kurikulum/{id}', [PublicKurikulumController::class, 'kurikulumDetail'])->whereNumber('id')->name('kurikulum.detail');
Route::get('/unit/{detail}', [SchoolController::class, 'unitDetail'])->name('unit.detail');
Route::get('/{sekolah}', [SchoolController::class, 'sekolah'])
    ->where('sekolah', 'sekolah-kemurnian-(1|2|3)')
    ->name('sekolah.detail');
Route::get('/contacts', [PublicContactLinksController::class, 'index'])->name('contact-links.public');

require __DIR__ . '/auth.php';

// Redirects
Route::redirect('/index.php', '/', 301);
Route::redirect('/about.html', '/about', 301);
Route::redirect('/sekolah-kemurnian-1.html', '/sekolah-kemurnian-1', 301);
Route::redirect('/sekolah-kemurnian-2.html', '/sekolah-kemurnian-2', 301);
Route::redirect('/sekolah-kemurnian-3.html', '/sekolah-kemurnian-3', 301);
Route::redirect('/promo-open-24.html', '/enrollment', 301);

// Curriculum Pages
Route::redirect('/kurikulum-tk.html', '/kurikulum/1', 301);
Route::redirect('/kurikulum-tkbil.html', '/kurikulum/2', 301);
Route::redirect('/kurikulum-sd.html', '/kurikulum/3', 301);
Route::redirect('/kurikulum-smp.html', '/kurikulum/4', 301);
Route::redirect('/kurikulum-sma.html', '/kurikulum/5', 301);
Route::redirect('/kurikulum-english.html', '/kurikulum/6', 301);

// News Pages
Route::redirect('/news.html', '/news', 301);

// Unit Kemurnian I
Route::redirect('/tk-kemurnian-1.html', '/unit/tk-kemurnian-i', 301);
Route::redirect('/sd-kemurnian-1.html', '/unit/sd-kemurnian-i', 301);
Route::redirect('/smp-kemurnian-1.html', '/unit/smp-kemurnian-i', 301);

// Unit Kemurnian II
Route::redirect('/tk-kemurnian-2.html', '/unit/tk-kemurnian-ii', 301);
Route::redirect('/sd-kemurnian-2.html', '/unit/sd-kemurnian-ii', 301);
Route::redirect('/smp-kemurnian-2.html', '/unit/smp-kemurnian-ii', 301);
Route::redirect('/sma-kemurnian-2.html', '/unit/sma-kemurnian-ii', 301);

// Unit Kemurnian III
Route::redirect('/tk-kemurnian-3.html', '/unit/tk-kemurnian-iii', 301);
Route::redirect('/sd-kemurnian-3.html', '/unit/sd-kemurnian-iii', 301);
