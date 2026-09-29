<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Location;
use App\Models\NewsletterSubscriber;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $statistics = [
            'locations' => Location::count(),

            'active_locations' => Location::where(
                'is_active',
                true
            )->count(),

            'map_views' => Location::sum('map_views'),

            'direction_requests' =>
                Location::sum('direction_requests'),

            'contact_messages' =>
                ContactMessage::count(),

            'unread_messages' =>
                ContactMessage::where(
                    'is_read',
                    false
                )->count(),

            'newsletter_subscribers' =>
                NewsletterSubscriber::where(
                    'is_active',
                    true
                )->count(),
        ];

        $popularLocations = Location::orderByDesc(
            'map_views'
        )
            ->limit(5)
            ->get();

        $recentMessages = ContactMessage::latest()
            ->limit(5)
            ->get();

        return Inertia::render(
            'Admin/Dashboard',
            [
                'statistics' => $statistics,
                'popularLocations' => $popularLocations,
                'recentMessages' => $recentMessages,
            ]
        );
    }
}