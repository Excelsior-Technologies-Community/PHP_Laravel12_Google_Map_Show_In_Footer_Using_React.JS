import { useForm } from '@inertiajs/react'

const fields = [
    ['home_title', 'Home title'], ['home_description', 'Home description'], ['about_title', 'About title'], ['about_content', 'About content'],
    ['facebook_url', 'Facebook URL'], ['instagram_url', 'Instagram URL'], ['twitter_url', 'Twitter URL'],
]

export default function Settings({ settings = {} }) {
    const { data, setData, put, processing, errors } = useForm(Object.fromEntries(fields.map(([key]) => [key, settings[key] || ''])))
    const submit = (event) => { event.preventDefault(); put('/admin/settings') }

    return <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900"><div className="mx-auto max-w-3xl"><div className="mb-8 flex items-center justify-between"><div><p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">Admin panel</p><h1 className="text-3xl font-black">Content & social links</h1></div><a href="/admin/locations" className="font-semibold text-cyan-700">Manage locations →</a></div><form onSubmit={submit} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">{fields.map(([key, label]) => <div key={key}><label className="mb-1 block text-sm font-medium">{label}</label>{key.includes('description') || key.includes('content') ? <textarea rows="5" value={data[key]} onChange={(event) => setData(key, event.target.value)} className="w-full rounded-lg border-slate-300" /> : <input type={key.endsWith('_url') ? 'url' : 'text'} value={data[key]} onChange={(event) => setData(key, event.target.value)} className="w-full rounded-lg border-slate-300" />}{errors[key] && <p className="text-sm text-red-500">{errors[key]}</p>}</div>)}<button disabled={processing} className="rounded-lg bg-cyan-600 px-5 py-3 font-semibold text-white">Save changes</button></form></div></main>
}