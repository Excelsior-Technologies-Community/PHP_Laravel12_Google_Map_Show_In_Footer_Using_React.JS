import { Link } from '@inertiajs/react'

export default function Header() {
    return (
        <header className="bg-white shadow">
            <div className="container mx-auto flex items-center justify-between px-6 py-4">

                {/* LOGO ONLY */}
                <Link href="/" className="flex items-center">
                    <img
                        src="/images/logo.png"
                        alt="Logo"
                        className="h-10"
                    />
                </Link>

                {/* Navigation */}
                <nav className="space-x-6 text-gray-600">
                    <Link href="/" className="hover:text-blue-600">Home</Link>
                    <Link href="/about" className="hover:text-blue-600">About</Link>
                    <Link href="/contact" className="hover:text-blue-600">Contact</Link>
                </nav>
            </div>
        </header>
    )
}
