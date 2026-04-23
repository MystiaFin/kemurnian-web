<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HeroController;
use App\Http\Controllers\Admin\KurikulumController;

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
});

Route::get('/debug-hero', function () {
    $hero = \App\Models\Hero::first();
    return [
        'raw' => $hero->getRawOriginal('desktop_image'),
        'accessor' => $hero->desktop_image,
    ];
});
