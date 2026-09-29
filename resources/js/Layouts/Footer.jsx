import { useForm, usePage } from '@inertiajs/react'
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedinIn,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
} from 'react-icons/fa'

export default function Footer() {
    const { settings = {}, locations = [] } = usePage().props

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        email: '',
    })

    const submitNewsletter = (e) => {
        e.preventDefault()

        post(route('newsletter.subscribe'), {
            preserveScroll: true,
            onSuccess: () => {
                reset()
            },
        })
    }

    const featuredLocation =
        locations.find(
            (location) => location.is_featured
        ) || locations[0]

    const mapUrl = featuredLocation
        ? `https://www.google.com/maps?q=${featuredLocation.latitude},${featuredLocation.longitude}&output=embed`
        : 'https://www.google.com/maps?q=Ahmedabad&output=embed'

    return (
        <footer className="mt-16 bg-gray-950 text-gray-300">

            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-2 lg:grid-cols-5">

                {/* Company */}
                <div>
                    <h3 className="mb-4 text-xl font-bold text-white">
                        {settings.company_name || 'MyCompany'}
                    </h3>

                    <p className="text-sm leading-6">
                        {settings.company_description ||
                            'We build secure and scalable Laravel + React applications.'}
                    </p>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="mb-4 font-semibold text-white">
                        Contact Us
                    </h4>

                    <div className="space-y-3 text-sm">

                        {settings.email && (
                            <a
                                href={`mailto:${settings.email}`}
                                className="flex items-center gap-2 hover:text-white"
                            >
                                <FaEnvelope />
                                {settings.email}
                            </a>
                        )}

                        {settings.phone && (
                            <a
                                href={`tel:${settings.phone}`}
                                className="flex items-center gap-2 hover:text-white"
                            >
                                <FaPhone />
                                {settings.phone}
                            </a>
                        )}

                        {featuredLocation && (
                            <div className="flex gap-2">
                                <FaMapMarkerAlt className="mt-1" />

                                <span>
                                    {featuredLocation.address}
                                </span>
                            </div>
                        )}

                    </div>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="mb-4 font-semibold text-white">
                        Legal
                    </h4>

                    <div className="space-y-2 text-sm">

                        <a
                            href="/privacy-policy"
                            className="block hover:text-white"
                        >
                            Privacy Policy
                        </a>

                        <a
                            href="/terms-condition"
                            className="block hover:text-white"
                        >
                            Terms & Conditions
                        </a>

                        <a
                            href="/refund-policy"
                            className="block hover:text-white"
                        >
                            Refund Policy
                        </a>

                    </div>
                </div>

                {/* Social */}
                <div>
                    <h4 className="mb-4 font-semibold text-white">
                        Follow Us
                    </h4>

                    <div className="flex gap-3">

                        {settings.facebook_url && (
                            <a
                                href={settings.facebook_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-gray-800 p-3 hover:bg-gray-700"
                            >
                                <FaFacebookF />
                            </a>
                        )}

                        {settings.instagram_url && (
                            <a
                                href={settings.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-gray-800 p-3 hover:bg-gray-700"
                            >
                                <FaInstagram />
                            </a>
                        )}

                        {settings.twitter_url && (
                            <a
                                href={settings.twitter_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-gray-800 p-3 hover:bg-gray-700"
                            >
                                <FaTwitter />
                            </a>
                        )}

                        {settings.linkedin_url && (
                            <a
                                href={settings.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-gray-800 p-3 hover:bg-gray-700"
                            >
                                <FaLinkedinIn />
                            </a>
                        )}

                    </div>
                </div>

                {/* Map */}
                <div>
                    <h4 className="mb-4 font-semibold text-white">
                        Our Location
                    </h4>

                    <iframe
                        src={mapUrl}
                        className="h-40 w-full rounded-lg"
                        loading="lazy"
                        title="Google Map"
                    />
                </div>

            </div>

            {/* Newsletter */}
            <div className="border-t border-gray-800">
                <div className="mx-auto max-w-7xl px-6 py-8">

                    <div className="mb-4">
                        <h4 className="text-lg font-semibold text-white">
                            Subscribe to our newsletter
                        </h4>

                        <p className="mt-1 text-sm text-gray-400">
                            Get the latest updates directly in your inbox.
                        </p>
                    </div>

                    <form
                        onSubmit={submitNewsletter}
                        className="flex flex-col gap-3 sm:flex-row"
                    >
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) =>
                                setData(
                                    'email',
                                    e.target.value
                                )
                            }
                            placeholder="Enter your email"
                            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
                        />

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                        >
                            {processing
                                ? 'Subscribing...'
                                : 'Subscribe'}
                        </button>
                    </form>

                    {errors.email && (
                        <p className="mt-2 text-sm text-red-400">
                            {errors.email}
                        </p>
                    )}

                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 py-5 text-center text-sm">
                © {new Date().getFullYear()}{' '}
                {settings.company_name || 'MyCompany'}.
                All rights reserved.
            </div>

        </footer>
    )
}