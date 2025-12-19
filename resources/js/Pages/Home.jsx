import AppLayout from '@/Layouts/AppLayout'

export default function Home() {
    return (
        <AppLayout>
            {/* Hero Section */}
            <section className="text-center py-24">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                    Build Modern Web Applications
                </h1>

                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    We create fast, secure, and scalable web solutions using
                    Laravel 12 and React.js to help your business grow online.
                </p>
            </section>

            {/* Features */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 text-center">
                <div className="p-6 border rounded-lg hover:shadow">
                    <h3 className="text-xl font-semibold mb-2">🚀 Fast Performance</h3>
                    <p className="text-gray-600">
                        Optimized code and modern technologies ensure lightning-fast speed.
                    </p>
                </div>

                <div className="p-6 border rounded-lg hover:shadow">
                    <h3 className="text-xl font-semibold mb-2">🔐 Secure System</h3>
                    <p className="text-gray-600">
                        Built with security best practices to keep your data safe.
                    </p>
                </div>

                <div className="p-6 border rounded-lg hover:shadow">
                    <h3 className="text-xl font-semibold mb-2">⚙️ Scalable</h3>
                    <p className="text-gray-600">
                        Easily scalable architecture that grows with your business.
                    </p>
                </div>
            </section>
        </AppLayout>
    )
}
