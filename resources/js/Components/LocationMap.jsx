import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const markerIcon = L.divIcon({
    className: 'location-marker',
    html: '<span></span>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
})

export default function LocationMap({ locations = [], className = 'h-64' }) {
    const mapElement = useRef(null)

    useEffect(() => {
        const center = locations[0] ? [locations[0].latitude, locations[0].longitude] : [23.0225, 72.5714]
        const map = L.map(mapElement.current, { scrollWheelZoom: false }).setView(center, locations.length > 1 ? 10 : 13)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map)

        locations.forEach((location) => {
            L.marker([location.latitude, location.longitude], { icon: markerIcon })
                .addTo(map)
                .bindPopup(`<strong>${location.name}</strong><br />${location.address}<br /><a href="https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}" target="_blank" rel="noreferrer">Get directions</a>`)
        })

        return () => map.remove()
    }, [locations])

    return (
        <div ref={mapElement} className={`${className} overflow-hidden rounded-xl`} />
    )
}