<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    /**
     * Display locations and analytics.
     */
    public function index(): Response
    {
        $locations = Location::latest()->get();

        $statistics = [
            'total_locations' => Location::count(),
            'active_locations' => Location::where('is_active', true)->count(),
            'hidden_locations' => Location::where('is_active', false)->count(),
            'total_map_views' => Location::sum('map_views'),
            'total_direction_requests' => Location::sum('direction_requests'),
        ];

        $mostViewedLocation = Location::orderByDesc('map_views')
            ->first();

        $mostRequestedLocation = Location::orderByDesc('direction_requests')
            ->first();

        return Inertia::render('Admin/Locations', [
            'locations' => $locations,
            'statistics' => $statistics,
            'mostViewedLocation' => $mostViewedLocation,
            'mostRequestedLocation' => $mostRequestedLocation,
        ]);
    }

    /**
     * Add a new location.
     */
    public function store(Request $request): RedirectResponse
    {
        Location::create($this->validated($request));

        return back()->with('success', 'Location added successfully.');
    }

    /**
     * Update a location.
     */
    public function update(
        Request $request,
        Location $location
    ): RedirectResponse {
        $location->update($this->validated($request));

        return back()->with('success', 'Location updated successfully.');
    }

    /**
     * Delete a location.
     */
    public function destroy(Location $location): RedirectResponse
    {
        $location->delete();

        return back()->with('success', 'Location deleted successfully.');
    }

    /**
     * Track a map view.
     */
    public function trackView(Location $location): RedirectResponse
    {
        if (!$location->is_active) {
            abort(404);
        }

        $location->increment('map_views', 1);

        $location->update([
            'last_viewed_at' => now(),
        ]);

        return back();
    }

    /**
     * Track a Google Maps direction request.
     */
    public function trackDirection(Location $location): RedirectResponse
    {
        if (!$location->is_active) {
            abort(404);
        }

        $location->increment('direction_requests', 1);

        return back();
    }

    /**
     * Validate location data.
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
            ],

            'address' => [
                'required',
                'string',
                'max:500',
            ],

            'latitude' => [
                'required',
                'numeric',
                'between:-90,90',
            ],

            'longitude' => [
                'required',
                'numeric',
                'between:-180,180',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:30',
            ],

            'is_active' => [
                'boolean',
            ],
        ]);
    }
}