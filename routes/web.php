<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ContactController;
use App\Models\Location;
use App\Http\Controllers\Admin\LocationController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\ProfileController;
use App\Models\SiteSetting;

$siteSettings = fn () => SiteSetting::pluck('value', 'key');

Route::get('/', function () use ($siteSettings) {
    return Inertia::render('Home', ['locations' => Location::where('is_active', true)->get(), 'settings' => $siteSettings()]);
});

Route::get('/about', function () use ($siteSettings) {
    return Inertia::render('About', ['locations' => Location::where('is_active', true)->get(), 'settings' => $siteSettings()]);
});

Route::get('/contact', fn () => Inertia::render('Contact', [
    'locations' => Location::where('is_active', true)->get(),
    'settings' => $siteSettings(),
]))->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {
    Route::resource('locations', LocationController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::get('settings', [SiteSettingController::class, 'edit'])->name('settings.edit');
    Route::put('settings', [SiteSettingController::class, 'update'])->name('settings.update');
});

Route::get('/privacy-policy', fn () => inertia('PrivacyPolicy'));
Route::get('/terms-condition', fn () => inertia('TermsCondition'));
Route::get('/refund-policy', fn () => inertia('RefundPolicy'));

Route::middleware('auth')->get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
