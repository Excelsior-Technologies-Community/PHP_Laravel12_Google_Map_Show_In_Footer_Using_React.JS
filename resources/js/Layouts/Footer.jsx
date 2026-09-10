import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'
import ContactForm from '@/Components/ContactForm'
import LocationMap from '@/Components/LocationMap'

export default function Footer({ locations = [], settings = {} }) {
    return (
        <footer className="mt-16 bg-slate-950 text-slate-300">
            <div className="container mx-auto grid gap-10 px-6 py-12 md:grid-cols-4">

                {/* Company About */}
                <div>
                    <h3 className="text-white text-lg font-semibold mb-3">
                        MyCompany
                    </h3>
                    <p className="text-sm leading-relaxed">
                        We help businesses grow by building fast, secure and
                        scalable web applications using Laravel & React.
                    </p>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="text-white font-semibold mb-3">Legal</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/privacy-policy" className="hover:text-white">Privacy Policy</a></li>
                        <li><a href="/terms-condition" className="hover:text-white">Terms & Conditions</a></li>
                        <li><a href="/refund-policy" className="hover:text-white">Refund Policy</a></li>
                    </ul>
                </div>

                {/* Social Media Icons */}
                <div>
                    <h4 className="text-white font-semibold mb-3">Follow Us</h4>
                    <div className="flex gap-4 text-xl">
                        <a href={settings.facebook_url || 'https://facebook.com'} target="_blank" rel="noreferrer" className="hover:text-blue-500">
                            <FaFacebookF />
                        </a>
                        <a href={settings.instagram_url || 'https://instagram.com'} target="_blank" rel="noreferrer" className="hover:text-pink-500">
                            <FaInstagram />
                        </a>
                        <a href={settings.twitter_url || 'https://twitter.com'} target="_blank" rel="noreferrer" className="hover:text-sky-400">
                            <FaTwitter />
                        </a>
                    </div>
                </div>

                {/* Map */}
                <div className="md:col-span-2">
                    <h4 className="mb-3 font-semibold text-white">Our Locations</h4>
                    <LocationMap locations={locations} className="h-40" />
                    <div className="mt-3 space-y-2 text-sm">{locations.map((location) => <a key={location.id} href={`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`} target="_blank" rel="noreferrer" className="block hover:text-cyan-400">{location.name} · Get directions</a>)}</div>
                </div>
            </div>

            <details className="container mx-auto border-t border-slate-800 px-6 py-6">
                <summary className="cursor-pointer font-semibold text-white">Send us a message</summary>
                <div className="mt-5 max-w-2xl"><ContactForm /></div>
            </details>

            {/* Bottom */}
            <div className="border-t border-gray-700 text-center py-4 text-sm">
                © {new Date().getFullYear()} MyCompany. All rights reserved.
            </div>
        </footer>
    )
}
