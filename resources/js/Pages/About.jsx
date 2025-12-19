import AppLayout from '@/Layouts/AppLayout'

export default function About() {
    return (
        <AppLayout>
            {/* Page Header */}
            <section className="text-center py-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    About Us
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
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

                <p className="text-gray-600 leading-relaxed mb-4">
                    MyCompany is a technology-driven company focused on delivering
                    high-quality digital solutions. We specialize in Laravel and
                    React to create fast, secure, and scalable web applications.
                </p>

                <p className="text-gray-600 leading-relaxed">
                    Our mission is to help startups and enterprises transform
                    their ideas into powerful digital products that make a real impact.
                </p>
            </section>

            {/* Values */}
            <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-6 border rounded-lg hover:shadow">
                    <h3 className="text-xl font-semibold mb-2">💡 Innovation</h3>
                    <p className="text-gray-600">
                        We use modern technologies to build future-ready solutions.
                    </p>
                </div>

                <div className="p-6 border rounded-lg hover:shadow">
                    <h3 className="text-xl font-semibold mb-2">🤝 Trust</h3>
                    <p className="text-gray-600">
                        Transparency and honesty are at the core of everything we do.
                    </p>
                </div>

                <div className="p-6 border rounded-lg hover:shadow">
                    <h3 className="text-xl font-semibold mb-2">🎯 Quality</h3>
                    <p className="text-gray-600">
                        We deliver reliable, maintainable, and high-quality products.
                    </p>
                </div>
            </section>
        </AppLayout>
    )
}
