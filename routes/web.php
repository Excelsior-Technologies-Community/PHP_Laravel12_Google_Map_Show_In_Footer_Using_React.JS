<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/about', function () {
    return Inertia::render('About');
});

Route::get('/privacy-policy', fn () => inertia('PrivacyPolicy'));
Route::get('/terms-condition', fn () => inertia('TermsCondition'));
Route::get('/refund-policy', fn () => inertia('RefundPolicy'));
