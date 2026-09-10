import AppLayout from '@/Layouts/AppLayout'

export default function Home({ locations = [], settings = {} }) {
    return (
        <AppLayout locations={locations} settings={settings}>
            {/* Hero Section */}
            <section className="text-center py-24">
                <h1 className="mb-4 text-4xl font-extrabold text-slate-900 dark:text-white">
                    {settings.home_title || 'Build Modern Web Applications'}
                </h1>

                <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                    {settings.home_description || 'We create fast, secure, and scalable web solutions using Laravel 12 and React.js to help your business grow online.'}
                </p>
            </section>

            {/* Features */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 text-center">
                <div className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow dark:border-slate-700 dark:bg-slate-800">
                    <h3 className="text-xl font-semibold mb-2">🚀 Fast Performance</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                        Optimized code and modern technologies ensure lightning-fast speed.
                    </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow dark:border-slate-700 dark:bg-slate-800">
                    <h3 className="text-xl font-semibold mb-2">🔐 Secure System</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                        Built with security best practices to keep your data safe.
                    </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow dark:border-slate-700 dark:bg-slate-800">
                    <h3 className="text-xl font-semibold mb-2">⚙️ Scalable</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                        Easily scalable architecture that grows with your business.
                    </p>
                </div>
            </section>
        </AppLayout>
    )
}
