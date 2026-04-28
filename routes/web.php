<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HeroController;
use App\Http\Controllers\Admin\KurikulumController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\EnrollmentController;
use App\Http\Controllers\Admin\FasilitasController;
use App\Http\Controllers\Guest\SiteController;

Route::prefix('admin')->group(function () {
    Route::get('/', [DashboardController::class, 'index']);
});

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Hero
    Route::get('/hero', [HeroController::class, 'index'])->name('hero');
    Route::get('/hero/create', [HeroController::class, 'create'])->name('hero.create');
    Route::post('/hero', [HeroController::class, 'store'])->name('hero.store');
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
});

Route::get('/', [SiteController::class, 'home'])->name('home');
Route::get('/about', [SiteController::class, 'about'])->name('about');
Route::get('/enrollment', [SiteController::class, 'enrollment'])->name('enrollment.public');

Route::get('/news', [SiteController::class, 'newsIndex'])->name('news.public');
Route::get('/news/category/{slug}', [SiteController::class, 'newsCategory'])->name('news.category');
Route::get('/news-detail/{id}', [SiteController::class, 'newsDetail'])->whereNumber('id')->name('news.detail');

Route::get('/kurikulum/{id}', [SiteController::class, 'kurikulumDetail'])->whereNumber('id')->name('kurikulum.detail');
Route::get('/unit/{detail}', [SiteController::class, 'unitDetail'])->name('unit.detail');
Route::get('/{sekolah}', [SiteController::class, 'sekolah'])
    ->where('sekolah', 'sekolah-kemurnian-(1|2|3)')
    ->name('sekolah.detail');
