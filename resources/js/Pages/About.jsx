import AppLayout from '@/Layouts/AppLayout'

export default function About({ locations = [], settings = {} }) {
    return (
        <AppLayout locations={locations} settings={settings}>
            {/* Page Header */}
            <section className="text-center py-16">
                <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">
                    {settings.about_title || 'About Us'}
                </h1>
                <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-300">
                    We are a passionate team dedicated to building modern,
                    reliable, and scalable web applications for businesses
                    worldwide.
                </p>
            </section>

            {/* About Content (ONLY TEXT) */}
            <section className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">
                    Who We Are
                </h2>

                <p className="mb-4 leading-relaxed text-slate-600 dark:text-slate-300">
                    {settings.about_content || 'MyCompany is a technology-driven company focused on delivering high-quality digital solutions. We specialize in Laravel and React to create fast, secure, and scalable web applications.'}
                </p>

                <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                    Our mission is to help startups and enterprises transform
                    their ideas into powerful digital products that make a real impact.
                </p>
            </section>

            {/* Values */}
            <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow dark:border-slate-700 dark:bg-slate-800">
                    <h3 className="text-xl font-semibold mb-2">💡 Innovation</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                        We use modern technologies to build future-ready solutions.
                    </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow dark:border-slate-700 dark:bg-slate-800">
                    <h3 className="text-xl font-semibold mb-2">🤝 Trust</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                        Transparency and honesty are at the core of everything we do.
                    </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow dark:border-slate-700 dark:bg-slate-800">
                    <h3 className="text-xl font-semibold mb-2">🎯 Quality</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                        We deliver reliable, maintainable, and high-quality products.
                    </p>
                </div>
            </section>
        </AppLayout>
    )
}
