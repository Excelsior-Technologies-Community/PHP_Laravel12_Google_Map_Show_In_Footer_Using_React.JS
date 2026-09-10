import AppLayout from '@/Layouts/AppLayout'
import ContactForm from '@/Components/ContactForm'
import { useState } from 'react'
import LocationMap from '@/Components/LocationMap'

export default function Contact({ locations = [], settings = {} }) {
    const [origin, setOrigin] = useState('')
    const [destination, setDestination] = useState('')
    return (
        <AppLayout locations={locations} settings={settings}>
            <section className="mx-auto grid max-w-6xl gap-10 py-12 lg:grid-cols-[0.85fr_1.15fr]">
                <div>
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">Let&apos;s talk</p>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Contact our team</h1>
                    <p className="mt-4 text-slate-600 dark:text-slate-300">Use the same contact form available in the footer. We&apos;ll reply by email, and you can also reach us by SMS.</p>
                    <a href="sms:+919999999999" className="mt-6 inline-block font-semibold text-cyan-700 dark:text-cyan-400">Send an SMS instead →</a>
                    <div className="mt-8 rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">
                        <h2 className="font-bold text-slate-900 dark:text-white">Find a route</h2>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <input value={origin} onChange={(event) => setOrigin(event.target.value)} placeholder="Starting point" className="rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900" />
                            <select value={destination} onChange={(event) => setDestination(event.target.value)} className="rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900"><option value="">Choose destination</option>{locations.map((location) => <option key={location.id} value={`${location.latitude},${location.longitude}`}>{location.name}</option>)}</select>
                        </div>
                        <a target="_blank" rel="noreferrer" href={origin && destination ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}` : '#'} className={`mt-3 inline-block rounded-lg px-4 py-2 text-sm font-semibold text-white ${origin && destination ? 'bg-cyan-600' : 'cursor-not-allowed bg-slate-400'}`}>Show route</a>
                    </div>
                    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700"><LocationMap locations={locations} className="h-64" /></div>
                    <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">{locations.map((location) => <p key={location.id}><strong>{location.name}:</strong> {location.address}</p>)}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none sm:p-8"><ContactForm /></div>
            </section>
        </AppLayout>
    )
}