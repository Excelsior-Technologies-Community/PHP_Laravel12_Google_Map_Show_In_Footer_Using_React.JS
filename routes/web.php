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

/*
|--------------------------------------------------------------------------
| Public Website
|--------------------------------------------------------------------------
*/

Route::get('/', function () use ($siteSettings) {
    return Inertia::render('Home', [
        'locations' => Location::where('is_active', true)->get(),
        'settings' => $siteSettings(),
    ]);
});

Route::get('/about', function () use ($siteSettings) {
    return Inertia::render('About', [
        'locations' => Location::where('is_active', true)->get(),
        'settings' => $siteSettings(),
    ]);
});

Route::get('/contact', function () use ($siteSettings) {
    return Inertia::render('Contact', [
        'locations' => Location::where('is_active', true)->get(),
        'settings' => $siteSettings(),
    ]);
})->name('contact');

Route::post('/contact', [
    ContactController::class,
    'store',
])->name('contact.store');

/*
|--------------------------------------------------------------------------
| Location Analytics
|--------------------------------------------------------------------------
*/

Route::post('/locations/{location}/track-view', [
    LocationController::class,
    'trackView',
])->name('locations.track-view');

Route::post('/locations/{location}/track-direction', [
    LocationController::class,
    'trackDirection',
])->name('locations.track-direction');

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

Route::middleware('auth')
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::resource('locations', LocationController::class)
            ->only([
                'index',
                'store',
                'update',
                'destroy',
            ]);

        Route::get('settings', [
            SiteSettingController::class,
            'edit',
        ])->name('settings.edit');

        Route::put('settings', [
            SiteSettingController::class,
            'update',
        ])->name('settings.update');
    });

/*
|--------------------------------------------------------------------------
| Legal Pages
|--------------------------------------------------------------------------
*/

Route::get('/privacy-policy', fn () => inertia('PrivacyPolicy'));

Route::get('/terms-condition', fn () => inertia('TermsCondition'));

Route::get('/refund-policy', fn () => inertia('RefundPolicy'));

/*
|--------------------------------------------------------------------------
| Authentication Dashboard
|--------------------------------------------------------------------------
*/

Route::middleware('auth')
    ->get('/dashboard', fn () => Inertia::render('Dashboard'))
    ->name('dashboard');

/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    Route::get('/profile', [
        ProfileController::class,
        'edit',
    ])->name('profile.edit');

    Route::patch('/profile', [
        ProfileController::class,
        'update',
    ])->name('profile.update');

    Route::delete('/profile', [
        ProfileController::class,
        'destroy',
    ])->name('profile.destroy');
});

require __DIR__.'/auth.php';