<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ContactController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\LocationController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\ProfileController;

use App\Models\Location;
use App\Models\SiteSetting;

$siteSettings = fn () => SiteSetting::pluck('value', 'key');

/*
|--------------------------------------------------------------------------
| Public Website
|--------------------------------------------------------------------------
*/

Route::get('/', function () use ($siteSettings) {
    return Inertia::render('Home', [
        'locations' => Location::where('is_active', true)
            ->orderByDesc('is_featured')
            ->latest()
            ->get(),

        'settings' => $siteSettings(),
    ]);
});

Route::get('/about', function () use ($siteSettings) {
    return Inertia::render('About', [
        'locations' => Location::where('is_active', true)
            ->orderByDesc('is_featured')
            ->latest()
            ->get(),

        'settings' => $siteSettings(),
    ]);
});

Route::get('/contact', function () use ($siteSettings) {
    return Inertia::render('Contact', [
        'locations' => Location::where('is_active', true)
            ->orderByDesc('is_featured')
            ->latest()
            ->get(),

        'settings' => $siteSettings(),
    ]);
})->name('contact');

/*
|--------------------------------------------------------------------------
| Contact Messages
|--------------------------------------------------------------------------
*/

Route::post('/contact', [
    ContactController::class,
    'store',
])->name('contact.store');

/*
|--------------------------------------------------------------------------
| Newsletter Subscription
|--------------------------------------------------------------------------
*/

Route::post('/newsletter/subscribe', [
    NewsletterController::class,
    'store',
])->name('newsletter.subscribe');

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

        /*
        |--------------------------------------------------------------------------
        | Admin Analytics Dashboard
        |--------------------------------------------------------------------------
        */

        Route::get('/dashboard', [
            DashboardController::class,
            'index',
        ])->name('dashboard');

        /*
        |--------------------------------------------------------------------------
        | Location Bulk Actions
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        | These routes must come BEFORE the resource routes.
        |
        */

        Route::post('/locations/bulk-delete', [
            LocationController::class,
            'bulkDelete',
        ])->name('locations.bulk-delete');

        Route::post('/locations/bulk-activate', [
            LocationController::class,
            'bulkActivate',
        ])->name('locations.bulk-activate');

        Route::post('/locations/bulk-deactivate', [
            LocationController::class,
            'bulkDeactivate',
        ])->name('locations.bulk-deactivate');

        /*
        |--------------------------------------------------------------------------
        | Featured Location
        |--------------------------------------------------------------------------
        */

        Route::post('/locations/{location}/toggle-featured', [
            LocationController::class,
            'toggleFeatured',
        ])->name('locations.toggle-featured');

        /*
        |--------------------------------------------------------------------------
        | Location Management
        |--------------------------------------------------------------------------
        |
        | Provides:
        | index
        | store
        | update
        | destroy
        |
        | Index will contain:
        | - Search
        | - Active/inactive filter
        | - Featured filter
        | - Sorting
        | - Pagination
        | - Statistics
        |
        */

        Route::resource('locations', LocationController::class)
            ->only([
                'index',
                'store',
                'update',
                'destroy',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Site Settings
        |--------------------------------------------------------------------------
        */

        Route::get('/settings', [
            SiteSettingController::class,
            'edit',
        ])->name('settings.edit');

        Route::put('/settings', [
            SiteSettingController::class,
            'update',
        ])->name('settings.update');
    });

/*
|--------------------------------------------------------------------------
| Legal Pages
|--------------------------------------------------------------------------
*/

Route::get('/privacy-policy', function () {
    return Inertia::render('PrivacyPolicy');
});

Route::get('/terms-condition', function () {
    return Inertia::render('TermsCondition');
});

Route::get('/refund-policy', function () {
    return Inertia::render('RefundPolicy');
});

/*
|--------------------------------------------------------------------------
| Authentication Dashboard
|--------------------------------------------------------------------------
*/

Route::middleware('auth')
    ->get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })
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

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

require __DIR__ . '/auth.php';