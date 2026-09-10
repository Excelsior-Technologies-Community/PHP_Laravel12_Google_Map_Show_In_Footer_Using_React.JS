import { useForm } from '@inertiajs/react'
import { useState } from 'react'

const blank = { name: '', address: '', latitude: '', longitude: '', phone: '', is_active: true }

export default function Locations({ locations = [] }) {
    const [editing, setEditing] = useState(null)
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm(blank)

    const submit = (event) => {
        event.preventDefault()
        editing ? put(`/admin/locations/${editing.id}`, { onSuccess: () => { setEditing(null); reset() } }) : post('/admin/locations', { onSuccess: () => reset() })
    }

    const edit = (location) => {
        setEditing(location)
        setData({ name: location.name, address: location.address, latitude: location.latitude, longitude: location.longitude, phone: location.phone || '', is_active: location.is_active })
    }

    return (
        <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex items-center justify-between"><div><p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">Admin panel</p><h1 className="text-3xl font-black">Map locations</h1></div><a href="/" className="text-sm font-semibold text-cyan-700">View website →</a></div>
                <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                    <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold">{editing ? 'Edit location' : 'Add location'}</h2>
                        {['name', 'address', 'latitude', 'longitude', 'phone'].map((field) => <div key={field}><label className="mb-1 block text-sm font-medium capitalize">{field}</label><input required={field !== 'phone'} value={data[field]} onChange={(event) => setData(field, event.target.value)} className="w-full rounded-lg border-slate-300" />{errors[field] && <p className="text-sm text-red-500">{errors[field]}</p>}</div>)}
                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.is_active} onChange={(event) => setData('is_active', event.target.checked)} /> Show on public map</label>
                        <div className="flex gap-3"><button disabled={processing} className="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white">{editing ? 'Update' : 'Add location'}</button>{editing && <button type="button" onClick={() => { setEditing(null); reset() }} className="rounded-lg border px-4 py-2">Cancel</button>}</div>
                    </form>
                    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm"><table className="w-full text-left text-sm"><thead className="border-b bg-slate-50"><tr><th className="p-4">Name</th><th className="p-4">Coordinates</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>{locations.map((location) => <tr key={location.id} className="border-b last:border-0"><td className="p-4"><strong>{location.name}</strong><br /><span className="text-slate-500">{location.address}</span></td><td className="p-4">{location.latitude}, {location.longitude}</td><td className="p-4">{location.is_active ? 'Active' : 'Hidden'}</td><td className="p-4"><button onClick={() => edit(location)} className="mr-3 font-semibold text-cyan-700">Edit</button><button onClick={() => destroy(`/admin/locations/${location.id}`)} className="font-semibold text-red-600">Delete</button></td></tr>)}</tbody></table>{locations.length === 0 && <p className="p-8 text-center text-slate-500">No locations yet.</p>}</div>
                </div>
            </div>
        </main>
    )
}