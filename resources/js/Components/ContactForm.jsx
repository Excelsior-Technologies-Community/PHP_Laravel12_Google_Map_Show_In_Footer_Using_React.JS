import { useForm } from '@inertiajs/react'

export default function ContactForm() {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: '', email: '', phone: '', message: '',
    })

    const submit = (event) => {
        event.preventDefault()
        post('/contact')
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            {['name', 'email', 'phone'].map((field) => (
                <div key={field}>
                    <label className="mb-1 block text-sm font-medium capitalize">{field}</label>
                    <input type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'} value={data[field]} onChange={(event) => setData(field, event.target.value)} className="w-full rounded-lg border-gray-300 bg-white/80 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:border-slate-600 dark:bg-slate-900" />
                    {errors[field] && <p className="mt-1 text-sm text-red-500">{errors[field]}</p>}
                </div>
            ))}
            <div>
                <label className="mb-1 block text-sm font-medium">Message</label>
                <textarea rows="5" value={data.message} onChange={(event) => setData('message', event.target.value)} className="w-full rounded-lg border-gray-300 bg-white/80 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:border-slate-600 dark:bg-slate-900" />
                {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
            </div>
            <button disabled={processing} className="rounded-lg bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-60">{processing ? 'Sending...' : 'Send message'}</button>
            {recentlySuccessful && <p className="text-sm text-emerald-600">Message sent successfully.</p>}
        </form>
    )
}