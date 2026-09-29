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
    public function index(Request $request): Response
    {
        $query = Location::query();

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Status Filter
        |--------------------------------------------------------------------------
        */

        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            }

            if ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Featured Filter
        |--------------------------------------------------------------------------
        */

        if ($request->filled('featured')) {
            if ($request->featured === 'yes') {
                $query->where('is_featured', true);
            }

            if ($request->featured === 'no') {
                $query->where('is_featured', false);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Sorting
        |--------------------------------------------------------------------------
        */

        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');

        $allowedSorts = [
            'created_at',
            'name',
            'map_views',
            'direction_requests',
        ];

        if (!in_array($sort, $allowedSorts)) {
            $sort = 'created_at';
        }

        $direction = $direction === 'asc' ? 'asc' : 'desc';

        $locations = $query
            ->orderBy($sort, $direction)
            ->paginate(5)
            ->withQueryString();

        /*
        |--------------------------------------------------------------------------
        | Statistics
        |--------------------------------------------------------------------------
        */

        $statistics = [
            'total_locations' => Location::count(),

            'active_locations' => Location::where(
                'is_active',
                true
            )->count(),

            'hidden_locations' => Location::where(
                'is_active',
                false
            )->count(),

            'featured_locations' => Location::where(
                'is_featured',
                true
            )->count(),

            'total_map_views' => Location::sum('map_views'),

            'total_direction_requests' =>
                Location::sum('direction_requests'),
        ];

        $mostViewedLocation = Location::orderByDesc(
            'map_views'
        )->first();

        $mostRequestedLocation = Location::orderByDesc(
            'direction_requests'
        )->first();

        return Inertia::render('Admin/Locations', [
            'locations' => $locations,
            'statistics' => $statistics,
            'mostViewedLocation' => $mostViewedLocation,
            'mostRequestedLocation' => $mostRequestedLocation,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'featured' => $request->featured,
                'sort' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Location::create($this->validated($request));

        return back()->with(
            'success',
            'Location added successfully.'
        );
    }

    public function update(
        Request $request,
        Location $location
    ): RedirectResponse {
        $location->update($this->validated($request));

        return back()->with(
            'success',
            'Location updated successfully.'
        );
    }

    public function destroy(Location $location): RedirectResponse
    {
        $location->delete();

        return back()->with(
            'success',
            'Location deleted successfully.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Bulk Delete
    |--------------------------------------------------------------------------
    */

    public function bulkDelete(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:locations,id'],
        ]);

        Location::whereIn('id', $data['ids'])->delete();

        return back()->with(
            'success',
            'Selected locations deleted successfully.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Bulk Activate
    |--------------------------------------------------------------------------
    */

    public function bulkActivate(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:locations,id'],
        ]);

        Location::whereIn('id', $data['ids'])
            ->update([
                'is_active' => true,
            ]);

        return back()->with(
            'success',
            'Selected locations activated.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Bulk Deactivate
    |--------------------------------------------------------------------------
    */

    public function bulkDeactivate(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:locations,id'],
        ]);

        Location::whereIn('id', $data['ids'])
            ->update([
                'is_active' => false,
            ]);

        return back()->with(
            'success',
            'Selected locations deactivated.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Toggle Featured
    |--------------------------------------------------------------------------
    */

    public function toggleFeatured(
        Location $location
    ): RedirectResponse {
        $location->update([
            'is_featured' => !$location->is_featured,
        ]);

        return back()->with(
            'success',
            'Featured status updated.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Map View
    |--------------------------------------------------------------------------
    */

    public function trackView(Location $location): RedirectResponse
    {
        if (!$location->is_active) {
            abort(404);
        }

        $location->increment('map_views');

        $location->update([
            'last_viewed_at' => now(),
        ]);

        return back();
    }

    /*
    |--------------------------------------------------------------------------
    | Direction Request
    |--------------------------------------------------------------------------
    */

    public function trackDirection(
        Location $location
    ): RedirectResponse {
        if (!$location->is_active) {
            abort(404);
        }

        $location->increment('direction_requests');

        return back();
    }

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
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

            'is_featured' => [
                'boolean',
            ],
        ]);
    }
}