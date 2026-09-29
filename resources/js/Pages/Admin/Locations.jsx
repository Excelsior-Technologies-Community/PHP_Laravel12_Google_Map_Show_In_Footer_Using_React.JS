import { router, useForm } from '@inertiajs/react'
import { useState } from 'react'

const blank = {
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    phone: '',
    is_active: true,
    is_featured: false,
}

export default function Locations({
    locations = {},
    statistics = {},
    mostViewedLocation = null,
    mostRequestedLocation = null,
    filters = {},
}) {
    const [editing, setEditing] = useState(null)
    const [selectedIds, setSelectedIds] = useState([])

    /*
    |--------------------------------------------------------------------------
    | Laravel paginate() returns an object:
    |
    | locations.data
    | locations.current_page
    | locations.last_page
    | locations.total
    |--------------------------------------------------------------------------
    */

    const locationList = Array.isArray(locations)
        ? locations
        : locations?.data ?? []

    const currentPage = locations?.current_page ?? 1
    const lastPage = locations?.last_page ?? 1
    const totalLocations = locations?.total ?? locationList.length

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm(blank)

    /*
    |--------------------------------------------------------------------------
    | Create / Update
    |--------------------------------------------------------------------------
    */

    const submit = (event) => {
        event.preventDefault()

        if (editing) {
            put(`/admin/locations/${editing.id}`, {
                onSuccess: () => {
                    setEditing(null)
                    reset()
                },
            })
        } else {
            post('/admin/locations', {
                onSuccess: () => {
                    reset()
                },
            })
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Edit
    |--------------------------------------------------------------------------
    */

    const edit = (location) => {
        setEditing(location)

        setData({
            name: location.name || '',
            address: location.address || '',
            latitude: location.latitude ?? '',
            longitude: location.longitude ?? '',
            phone: location.phone || '',
            is_active: Boolean(location.is_active),
            is_featured: Boolean(location.is_featured),
        })

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    /*
    |--------------------------------------------------------------------------
    | Cancel Edit
    |--------------------------------------------------------------------------
    */

    const cancelEdit = () => {
        setEditing(null)
        reset()
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Single Location
    |--------------------------------------------------------------------------
    */

    const deleteLocation = (location) => {
        if (
            window.confirm(
                `Are you sure you want to delete "${location.name}"?`
            )
        ) {
            destroy(`/admin/locations/${location.id}`)
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Search / Filters / Sorting
    |--------------------------------------------------------------------------
    */

    const applyFilters = (event) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        router.get(
            '/admin/locations',
            {
                search: formData.get('search') || '',
                status: formData.get('status') || '',
                featured: formData.get('featured') || '',
                sort: formData.get('sort') || 'created_at',
                direction: formData.get('direction') || 'desc',
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        )
    }

    const clearFilters = () => {
        router.get(
            '/admin/locations',
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        )
    }

    /*
    |--------------------------------------------------------------------------
    | Select / Deselect
    |--------------------------------------------------------------------------
    */

    const toggleSelection = (id) => {
        setSelectedIds((current) =>
            current.includes(id)
                ? current.filter((selectedId) => selectedId !== id)
                : [...current, id]
        )
    }

    const toggleSelectAll = () => {
        const pageIds = locationList.map((location) => location.id)

        const allSelected = pageIds.every((id) =>
            selectedIds.includes(id)
        )

        if (allSelected) {
            setSelectedIds((current) =>
                current.filter((id) => !pageIds.includes(id))
            )
        } else {
            setSelectedIds((current) => [
                ...new Set([...current, ...pageIds]),
            ])
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Bulk Actions
    |--------------------------------------------------------------------------
    */

    const bulkAction = (action, message) => {
        if (selectedIds.length === 0) {
            window.alert('Please select at least one location.')
            return
        }

        if (!window.confirm(message)) {
            return
        }

        router.post(
            `/admin/locations/${action}`,
            {
                ids: selectedIds,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedIds([])
                },
            }
        )
    }

    const bulkDelete = () => {
        bulkAction(
            'bulk-delete',
            `Are you sure you want to delete ${selectedIds.length} selected location(s)?`
        )
    }

    const bulkActivate = () => {
        bulkAction(
            'bulk-activate',
            `Activate ${selectedIds.length} selected location(s)?`
        )
    }

    const bulkDeactivate = () => {
        bulkAction(
            'bulk-deactivate',
            `Deactivate ${selectedIds.length} selected location(s)?`
        )
    }

    /*
    |--------------------------------------------------------------------------
    | Featured Location
    |--------------------------------------------------------------------------
    */

    const toggleFeatured = (location) => {
        router.post(
            `/admin/locations/${location.id}/toggle-featured`,
            {},
            {
                preserveScroll: true,
            }
        )
    }

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const goToPage = (page) => {
        if (page < 1 || page > lastPage || page === currentPage) {
            return
        }

        router.get(
            '/admin/locations',
            {
                search: filters.search || '',
                status: filters.status || '',
                featured: filters.featured || '',
                sort: filters.sort || 'created_at',
                direction: filters.direction || 'desc',
                page,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        )
    }

    const pageNumbers = []

    for (let page = 1; page <= lastPage; page++) {
        pageNumbers.push(page)
    }

    const allCurrentPageSelected =
        locationList.length > 0 &&
        locationList.every((location) =>
            selectedIds.includes(location.id)
        )

    return (
        <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
            <div className="mx-auto max-w-7xl">

                {/* =========================================================
                    HEADER
                ========================================================== */}

                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
                            Admin panel
                        </p>

                        <h1 className="text-3xl font-black">
                            Location Management
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Search, filter, sort and manage your locations.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <a
                            href="/admin/dashboard"
                            className="font-semibold text-violet-700"
                        >
                            Analytics →
                        </a>

                        <a
                            href="/"
                            className="font-semibold text-cyan-700"
                        >
                            View website →
                        </a>
                    </div>
                </div>

                {/* =========================================================
                    STATISTICS
                ========================================================== */}

                <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Total Locations
                        </p>

                        <p className="mt-2 text-3xl font-black">
                            {statistics.total_locations || 0}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Active
                        </p>

                        <p className="mt-2 text-3xl font-black text-emerald-600">
                            {statistics.active_locations || 0}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Hidden
                        </p>

                        <p className="mt-2 text-3xl font-black text-slate-600">
                            {statistics.hidden_locations || 0}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Featured
                        </p>

                        <p className="mt-2 text-3xl font-black text-amber-500">
                            {statistics.featured_locations || 0}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Map Views
                        </p>

                        <p className="mt-2 text-3xl font-black text-cyan-600">
                            {statistics.total_map_views || 0}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Directions
                        </p>

                        <p className="mt-2 text-3xl font-black text-violet-600">
                            {statistics.total_direction_requests || 0}
                        </p>
                    </div>

                </section>

                {/* =========================================================
                    ANALYTICS HIGHLIGHTS
                ========================================================== */}

                <section className="mb-8 grid gap-6 md:grid-cols-2">

                    <div className="rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-700 p-6 text-white shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-wider text-cyan-100">
                            Most Viewed Location
                        </p>

                        <h2 className="mt-2 text-2xl font-black">
                            {mostViewedLocation?.name || 'No data yet'}
                        </h2>

                        {mostViewedLocation && (
                            <p className="mt-2 text-cyan-100">
                                {mostViewedLocation.map_views || 0} map views
                            </p>
                        )}
                    </div>

                    <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-violet-700 p-6 text-white shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-wider text-violet-100">
                            Most Requested Location
                        </p>

                        <h2 className="mt-2 text-2xl font-black">
                            {mostRequestedLocation?.name || 'No data yet'}
                        </h2>

                        {mostRequestedLocation && (
                            <p className="mt-2 text-violet-100">
                                {mostRequestedLocation.direction_requests || 0}{' '}
                                direction requests
                            </p>
                        )}
                    </div>

                </section>

                {/* =========================================================
                    SEARCH / FILTER / SORT
                ========================================================== */}

                <form
                    onSubmit={applyFilters}
                    className="mb-8 rounded-2xl bg-white p-6 shadow-sm"
                >
                    <div className="mb-5">
                        <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
                            Search & Filters
                        </p>

                        <h2 className="text-xl font-bold">
                            Find Locations
                        </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

                        {/* Search */}

                        <div className="lg:col-span-2">
                            <label className="mb-1 block text-sm font-medium">
                                Search
                            </label>

                            <input
                                type="text"
                                name="search"
                                defaultValue={filters.search || ''}
                                placeholder="Search name, address or phone..."
                                className="w-full rounded-lg border-slate-300"
                            />
                        </div>

                        {/* Status */}

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Status
                            </label>

                            <select
                                name="status"
                                defaultValue={filters.status || ''}
                                className="w-full rounded-lg border-slate-300"
                            >
                                <option value="">
                                    All Status
                                </option>

                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>
                            </select>
                        </div>

                        {/* Featured */}

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Featured
                            </label>

                            <select
                                name="featured"
                                defaultValue={filters.featured || ''}
                                className="w-full rounded-lg border-slate-300"
                            >
                                <option value="">
                                    All Locations
                                </option>

                                <option value="yes">
                                    Featured
                                </option>

                                <option value="no">
                                    Not Featured
                                </option>
                            </select>
                        </div>

                        {/* Sort */}

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Sort By
                            </label>

                            <select
                                name="sort"
                                defaultValue={
                                    filters.sort || 'created_at'
                                }
                                className="w-full rounded-lg border-slate-300"
                            >
                                <option value="created_at">
                                    Date
                                </option>

                                <option value="name">
                                    Name
                                </option>

                                <option value="map_views">
                                    Map Views
                                </option>

                                <option value="direction_requests">
                                    Directions
                                </option>
                            </select>
                        </div>

                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">

                        <select
                            name="direction"
                            defaultValue={
                                filters.direction || 'desc'
                            }
                            className="rounded-lg border-slate-300"
                        >
                            <option value="desc">
                                Descending
                            </option>

                            <option value="asc">
                                Ascending
                            </option>
                        </select>

                        <button
                            type="submit"
                            className="rounded-lg bg-cyan-600 px-5 py-2 font-semibold text-white hover:bg-cyan-700"
                        >
                            Apply Filters
                        </button>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded-lg border border-slate-300 px-5 py-2 font-semibold"
                        >
                            Clear
                        </button>

                    </div>
                </form>

                {/* =========================================================
                    MANAGEMENT AREA
                ========================================================== */}

                <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">

                    {/* =====================================================
                        CREATE / EDIT FORM
                    ====================================================== */}

                    <form
                        onSubmit={submit}
                        className="space-y-4 rounded-2xl bg-white p-6 shadow-sm"
                    >
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
                                {editing ? 'Update' : 'Create'}
                            </p>

                            <h2 className="text-xl font-bold">
                                {editing
                                    ? 'Edit Location'
                                    : 'Add Location'}
                            </h2>
                        </div>

                        {[
                            'name',
                            'address',
                            'latitude',
                            'longitude',
                            'phone',
                        ].map((field) => (
                            <div key={field}>
                                <label className="mb-1 block text-sm font-medium capitalize">
                                    {field}
                                </label>

                                <input
                                    required={field !== 'phone'}
                                    type={
                                        field === 'latitude' ||
                                        field === 'longitude'
                                            ? 'number'
                                            : 'text'
                                    }
                                    step={
                                        field === 'latitude' ||
                                        field === 'longitude'
                                            ? 'any'
                                            : undefined
                                    }
                                    value={data[field]}
                                    onChange={(event) =>
                                        setData(
                                            field,
                                            event.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border-slate-300"
                                />

                                {errors[field] && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors[field]}
                                    </p>
                                )}
                            </div>
                        ))}

                        {/* Active */}

                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={Boolean(data.is_active)}
                                onChange={(event) =>
                                    setData(
                                        'is_active',
                                        event.target.checked
                                    )
                                }
                            />

                            Show on public map
                        </label>

                        {/* Featured */}

                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={Boolean(data.is_featured)}
                                onChange={(event) =>
                                    setData(
                                        'is_featured',
                                        event.target.checked
                                    )
                                }
                            />

                            Mark as featured location
                        </label>

                        <div className="flex gap-3">

                            <button
                                disabled={processing}
                                className="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-60"
                            >
                                {processing
                                    ? 'Saving...'
                                    : editing
                                      ? 'Update Location'
                                      : 'Add Location'}
                            </button>

                            {editing && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="rounded-lg border border-slate-300 px-4 py-2"
                                >
                                    Cancel
                                </button>
                            )}

                        </div>
                    </form>

                    {/* =====================================================
                        LOCATION TABLE
                    ====================================================== */}

                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

                        <div className="border-b border-slate-200 p-5">

                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                                <div>
                                    <h2 className="text-xl font-bold">
                                        All Locations
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Showing {locationList.length} of{' '}
                                        {totalLocations} locations.
                                    </p>
                                </div>

                                {selectedIds.length > 0 && (
                                    <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
                                        {selectedIds.length} selected
                                    </span>
                                )}

                            </div>
                        </div>

                        {/* =================================================
                            BULK ACTIONS
                        ================================================== */}

                        <div className="border-b border-slate-200 bg-slate-50 p-4">

                            <div className="flex flex-wrap gap-2">

                                <button
                                    type="button"
                                    onClick={bulkActivate}
                                    disabled={
                                        selectedIds.length === 0
                                    }
                                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Bulk Activate
                                </button>

                                <button
                                    type="button"
                                    onClick={bulkDeactivate}
                                    disabled={
                                        selectedIds.length === 0
                                    }
                                    className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Bulk Deactivate
                                </button>

                                <button
                                    type="button"
                                    onClick={bulkDelete}
                                    disabled={
                                        selectedIds.length === 0
                                    }
                                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Bulk Delete
                                </button>

                            </div>
                        </div>

                        {/* =================================================
                            TABLE
                        ================================================== */}

                        <div className="overflow-x-auto">

                            <table className="w-full text-left text-sm">

                                <thead className="border-b bg-slate-50">

                                    <tr>

                                        <th className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    allCurrentPageSelected
                                                }
                                                onChange={
                                                    toggleSelectAll
                                                }
                                            />
                                        </th>

                                        <th className="p-4">
                                            Location
                                        </th>

                                        <th className="p-4">
                                            Coordinates
                                        </th>

                                        <th className="p-4">
                                            Analytics
                                        </th>

                                        <th className="p-4">
                                            Status
                                        </th>

                                        <th className="p-4">
                                            Featured
                                        </th>

                                        <th className="p-4">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {locationList.length > 0 ? (
                                        locationList.map(
                                            (location) => (
                                                <tr
                                                    key={location.id}
                                                    className="border-b last:border-0"
                                                >

                                                    {/* Select */}

                                                    <td className="p-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIds.includes(
                                                                location.id
                                                            )}
                                                            onChange={() =>
                                                                toggleSelection(
                                                                    location.id
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    {/* Location */}

                                                    <td className="p-4">

                                                        <strong>
                                                            {location.name}
                                                        </strong>

                                                        <br />

                                                        <span className="text-slate-500">
                                                            {location.address}
                                                        </span>

                                                        {location.phone && (
                                                            <>
                                                                <br />

                                                                <span className="text-xs text-slate-400">
                                                                    {
                                                                        location.phone
                                                                    }
                                                                </span>
                                                            </>
                                                        )}

                                                    </td>

                                                    {/* Coordinates */}

                                                    <td className="whitespace-nowrap p-4">
                                                        {location.latitude}
                                                        <br />
                                                        {location.longitude}
                                                    </td>

                                                    {/* Analytics */}

                                                    <td className="p-4">

                                                        <div className="space-y-1">

                                                            <p>
                                                                👁️{' '}
                                                                <strong>
                                                                    {location.map_views ||
                                                                        0}
                                                                </strong>{' '}
                                                                views
                                                            </p>

                                                            <p>
                                                                🧭{' '}
                                                                <strong>
                                                                    {location.direction_requests ||
                                                                        0}
                                                                </strong>{' '}
                                                                directions
                                                            </p>

                                                        </div>

                                                    </td>

                                                    {/* Status */}

                                                    <td className="p-4">

                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                                location.is_active
                                                                    ? 'bg-emerald-100 text-emerald-700'
                                                                    : 'bg-slate-200 text-slate-600'
                                                            }`}
                                                        >
                                                            {location.is_active
                                                                ? 'Active'
                                                                : 'Hidden'}
                                                        </span>

                                                    </td>

                                                    {/* Featured */}

                                                    <td className="p-4">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleFeatured(
                                                                    location
                                                                )
                                                            }
                                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                                location.is_featured
                                                                    ? 'bg-amber-100 text-amber-700'
                                                                    : 'bg-slate-100 text-slate-500'
                                                            }`}
                                                        >
                                                            {location.is_featured
                                                                ? '★ Featured'
                                                                : '☆ Feature'}
                                                        </button>

                                                    </td>

                                                    {/* Actions */}

                                                    <td className="whitespace-nowrap p-4">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                edit(
                                                                    location
                                                                )
                                                            }
                                                            className="mr-3 font-semibold text-cyan-700"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteLocation(
                                                                    location
                                                                )
                                                            }
                                                            className="font-semibold text-red-600"
                                                        >
                                                            Delete
                                                        </button>

                                                    </td>

                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="p-10 text-center text-slate-500"
                                            >
                                                No locations found.
                                            </td>
                                        </tr>
                                    )}

                                </tbody>

                            </table>

                        </div>

                        {/* =================================================
                            NUMERIC PAGINATION
                        ================================================== */}

                        {lastPage > 1 && (
                            <div className="flex flex-wrap justify-center gap-2 border-t border-slate-200 p-5">

                                {pageNumbers.map((page) => (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() =>
                                            goToPage(page)
                                        }
                                        className={`h-10 min-w-10 rounded-lg px-3 font-semibold ${
                                            page === currentPage
                                                ? 'bg-cyan-600 text-white'
                                                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                            </div>
                        )}

                    </div>
                </div>
            </div>
        </main>
    )
}