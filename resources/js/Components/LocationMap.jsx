import { useEffect, useRef, useState } from 'react'
import { router } from '@inertiajs/react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const markerIcon = L.divIcon({
    className: 'location-marker',
    html: '<span></span>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
})

function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371

    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return earthRadius * c
}

export default function LocationMap({
    locations = [],
    className = 'h-64',
}) {
    const mapElement = useRef(null)
    const mapRef = useRef(null)
    const markersRef = useRef({})

    const [search, setSearch] = useState('')
    const [selectedLocation, setSelectedLocation] = useState(
        locations[0] || null
    )

    const [userLocation, setUserLocation] = useState(null)
    const [distance, setDistance] = useState(null)
    const [locationError, setLocationError] = useState('')

    const filteredLocations = locations.filter((location) => {
        const searchText = search.toLowerCase().trim()

        if (!searchText) {
            return true
        }

        return (
            location.name.toLowerCase().includes(searchText) ||
            location.address.toLowerCase().includes(searchText)
        )
    })

    /*
    |--------------------------------------------------------------------------
    | Initialize Map
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!mapElement.current) {
            return
        }

        const center = locations[0]
            ? [locations[0].latitude, locations[0].longitude]
            : [23.0225, 72.5714]

        const map = L.map(mapElement.current, {
            scrollWheelZoom: false,
        }).setView(
            center,
            locations.length > 1 ? 10 : 13
        )

        mapRef.current = map

        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution:
                    '&copy; OpenStreetMap contributors',
            }
        ).addTo(map)

        locations.forEach((location) => {
            const marker = L.marker(
                [
                    location.latitude,
                    location.longitude,
                ],
                {
                    icon: markerIcon,
                }
            )
                .addTo(map)
                .bindPopup(`
                    <strong>${location.name}</strong>
                    <br />
                    ${location.address}
                    ${
                        location.phone
                            ? `<br />${location.phone}`
                            : ''
                    }
                `)

            marker.on('click', () => {
                setSelectedLocation(location)

                router.post(
                    `/locations/${location.id}/track-view`,
                    {},
                    {
                        preserveScroll: true,
                        preserveState: true,
                    }
                )
            })

            markersRef.current[location.id] = marker
        })

        return () => {
            map.remove()
            mapRef.current = null
            markersRef.current = {}
        }
    }, [locations])

    /*
    |--------------------------------------------------------------------------
    | Select Location
    |--------------------------------------------------------------------------
    */

    const selectLocation = (location) => {
        setSelectedLocation(location)

        if (mapRef.current) {
            mapRef.current.flyTo(
                [
                    location.latitude,
                    location.longitude,
                ],
                15,
                {
                    duration: 1,
                }
            )

            const marker =
                markersRef.current[location.id]

            if (marker) {
                marker.openPopup()
            }
        }

        router.post(
            `/locations/${location.id}/track-view`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
            }
        )
    }

    /*
    |--------------------------------------------------------------------------
    | Use Current Location
    |--------------------------------------------------------------------------
    */

    const useMyLocation = () => {
        setLocationError('')

        if (!navigator.geolocation) {
            setLocationError(
                'Geolocation is not supported by your browser.'
            )

            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude =
                    position.coords.latitude

                const longitude =
                    position.coords.longitude

                setUserLocation({
                    latitude,
                    longitude,
                })

                if (selectedLocation) {
                    const calculatedDistance =
                        calculateDistance(
                            latitude,
                            longitude,
                            selectedLocation.latitude,
                            selectedLocation.longitude
                        )

                    setDistance(
                        calculatedDistance.toFixed(2)
                    )
                }

                if (mapRef.current) {
                    mapRef.current.flyTo(
                        [latitude, longitude],
                        13,
                        {
                            duration: 1,
                        }
                    )
                }
            },
            () => {
                setLocationError(
                    'Unable to access your location. Please allow location permission.'
                )
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            }
        )
    }

    /*
    |--------------------------------------------------------------------------
    | Recalculate Distance
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!userLocation || !selectedLocation) {
            setDistance(null)
            return
        }

        const calculatedDistance =
            calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                selectedLocation.latitude,
                selectedLocation.longitude
            )

        setDistance(
            calculatedDistance.toFixed(2)
        )
    }, [userLocation, selectedLocation])

    /*
    |--------------------------------------------------------------------------
    | Google Maps Directions
    |--------------------------------------------------------------------------
    */

    const openDirections = (location) => {
        router.post(
            `/locations/${location.id}/track-direction`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    const url =
                        `https://www.google.com/maps/dir/?api=1` +
                        `&destination=${location.latitude},${location.longitude}`

                    window.open(
                        url,
                        '_blank',
                        'noopener,noreferrer'
                    )
                },
            }
        )
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Search location
                </label>

                <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    placeholder="Search by office name or address..."
                    className="w-full rounded-lg border-slate-300 bg-white text-sm dark:border-slate-600 dark:bg-slate-900"
                />
            </div>

            {/* Location List */}
            <div className="grid gap-3 sm:grid-cols-2">
                {filteredLocations.map((location) => (
                    <button
                        type="button"
                        key={location.id}
                        onClick={() =>
                            selectLocation(location)
                        }
                        className={`rounded-xl border p-4 text-left transition ${
                            selectedLocation?.id ===
                            location.id
                                ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30'
                                : 'border-slate-200 bg-white hover:border-cyan-300 dark:border-slate-700 dark:bg-slate-800'
                        }`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h5 className="font-bold text-slate-900 dark:text-white">
                                    {location.name}
                                </h5>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {location.address}
                                </p>
                            </div>

                            <span className="rounded-full bg-cyan-100 px-2 py-1 text-xs font-semibold text-cyan-700">
                                View
                            </span>
                        </div>
                    </button>
                ))}

                {filteredLocations.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500 sm:col-span-2">
                        No locations found.
                    </div>
                )}
            </div>

            {/* Map */}
            <div
                ref={mapElement}
                className={`${className} overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700`}
            />

            {/* Selected Location */}
            {selectedLocation && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-cyan-600">
                                Selected Location
                            </p>

                            <h4 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                {selectedLocation.name}
                            </h4>

                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                {selectedLocation.address}
                            </p>

                            {selectedLocation.phone && (
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {selectedLocation.phone}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                openDirections(
                                    selectedLocation
                                )
                            }
                            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
                        >
                            Get Directions
                        </button>
                    </div>
                </div>
            )}

            {/* Distance Calculator */}
            <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-900">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">
                            📏 Distance Calculator
                        </h4>

                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            Find the approximate distance from your current location.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={useMyLocation}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-cyan-600 dark:hover:bg-cyan-700"
                    >
                        📍 Use My Location
                    </button>
                </div>

                {distance !== null && selectedLocation && (
                    <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-900 dark:bg-cyan-950/30">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Approximate distance to{' '}
                            <strong>
                                {selectedLocation.name}
                            </strong>
                        </p>

                        <p className="mt-1 text-3xl font-black text-cyan-700 dark:text-cyan-400">
                            {distance} km
                        </p>
                    </div>
                )}

                {locationError && (
                    <p className="mt-3 text-sm text-red-500">
                        {locationError}
                    </p>
                )}
            </div>
        </div>
    )
}