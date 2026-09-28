import { useForm } from '@inertiajs/react'
import { useState } from 'react'

const blank = {
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    phone: '',
    is_active: true,
}

export default function Locations({
    locations = [],
    statistics = {},
    mostViewedLocation = null,
    mostRequestedLocation = null,
}) {
    const [editing, setEditing] = useState(null)

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

    const submit = (event) => {
        event.preventDefault()

        if (editing) {
            put(
                `/admin/locations/${editing.id}`,
                {
                    onSuccess: () => {
                        setEditing(null)
                        reset()
                    },
                }
            )
        } else {
            post('/admin/locations', {
                onSuccess: () => reset(),
            })
        }
    }

    const edit = (location) => {
        setEditing(location)

        setData({
            name: location.name,
            address: location.address,
            latitude: location.latitude,
            longitude: location.longitude,
            phone: location.phone || '',
            is_active: location.is_active,
        })

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    const cancelEdit = () => {
        setEditing(null)
        reset()
    }

    const deleteLocation = (location) => {
        if (
            window.confirm(
                `Are you sure you want to delete ${location.name}?`
            )
        ) {
            destroy(
                `/admin/locations/${location.id}`
            )
        }
    }

    return (
        <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
                            Admin panel
                        </p>

                        <h1 className="text-3xl font-black">
                            Location Management
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage locations and monitor map activity.
                        </p>
                    </div>

                    <a
                        href="/"
                        className="font-semibold text-cyan-700"
                    >
                        View website →
                    </a>
                </div>

                {/* Statistics */}
                <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Total Locations
                        </p>

                        <p className="mt-2 text-3xl font-black text-slate-900">
                            {statistics.total_locations || 0}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Active Locations
                        </p>

                        <p className="mt-2 text-3xl font-black text-emerald-600">
                            {statistics.active_locations || 0}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Hidden Locations
                        </p>

                        <p className="mt-2 text-3xl font-black text-slate-600">
                            {statistics.hidden_locations || 0}
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
                            Direction Requests
                        </p>

                        <p className="mt-2 text-3xl font-black text-violet-600">
                            {statistics.total_direction_requests || 0}
                        </p>
                    </div>

                </section>

                {/* Analytics Highlights */}
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
                                {mostViewedLocation.map_views} map views
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
                                {mostRequestedLocation.direction_requests} direction requests
                            </p>
                        )}
                    </div>

                </section>

                {/* Management Area */}
                <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">

                    {/* Form */}
                    <form
                        onSubmit={submit}
                        className="space-y-4 rounded-2xl bg-white p-6 shadow-sm"
                    >
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
                                {editing
                                    ? 'Update'
                                    : 'Create'}
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
                                    required={
                                        field !== 'phone'
                                    }
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

                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(event) =>
                                    setData(
                                        'is_active',
                                        event.target.checked
                                    )
                                }
                            />

                            Show on public map
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

                    {/* Locations Table */}
                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

                        <div className="border-b border-slate-200 p-5">
                            <h2 className="text-xl font-bold">
                                All Locations
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Map usage and direction statistics are shown below.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">

                                <thead className="border-b bg-slate-50">
                                    <tr>
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
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {locations.map(
                                        (location) => (
                                            <tr
                                                key={location.id}
                                                className="border-b last:border-0"
                                            >
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
                                                                {location.phone}
                                                            </span>
                                                        </>
                                                    )}
                                                </td>

                                                <td className="p-4 whitespace-nowrap">
                                                    {location.latitude}
                                                    <br />
                                                    {location.longitude}
                                                </td>

                                                <td className="p-4">
                                                    <div className="space-y-1">
                                                        <p>
                                                            👁️{' '}
                                                            <strong>
                                                                {location.map_views || 0}
                                                            </strong>{' '}
                                                            views
                                                        </p>

                                                        <p>
                                                            🧭{' '}
                                                            <strong>
                                                                {location.direction_requests || 0}
                                                            </strong>{' '}
                                                            directions
                                                        </p>
                                                    </div>
                                                </td>

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

                                                <td className="p-4 whitespace-nowrap">
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
                                    )}
                                </tbody>

                            </table>
                        </div>

                        {locations.length === 0 && (
                            <p className="p-8 text-center text-slate-500">
                                No locations yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}