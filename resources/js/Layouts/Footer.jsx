import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-16">
            <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

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
                        <a href="https://facebook.com" target="_blank" className="hover:text-blue-500">
                            <FaFacebookF />
                        </a>
                        <a href="https://instagram.com" target="_blank" className="hover:text-pink-500">
                            <FaInstagram />
                        </a>
                        <a href="https://twitter.com" target="_blank" className="hover:text-sky-400">
                            <FaTwitter />
                        </a>
                    </div>
                </div>

                {/* Map */}
                <div>
                    <h4 className="text-white font-semibold mb-3">Our Location</h4>
                    <iframe
                        title="Google Map"
                        src="https://www.google.com/maps?q=Ahmedabad&output=embed"
                        className="w-full h-32 rounded"
                        loading="lazy"
                    ></iframe>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-gray-700 text-center py-4 text-sm">
                © {new Date().getFullYear()} MyCompany. All rights reserved.
            </div>
        </footer>
    )
}
