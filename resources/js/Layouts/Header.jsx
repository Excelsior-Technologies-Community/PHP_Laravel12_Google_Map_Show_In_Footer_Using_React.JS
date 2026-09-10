import { Link } from '@inertiajs/react'
import { useState } from 'react'

export default function Header() {
    const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

    const toggleTheme = () => {
        const next = !dark
        setDark(next)
        localStorage.setItem('theme', next ? 'dark' : 'light')
        document.documentElement.classList.toggle('dark', next)
        document.documentElement.style.colorScheme = next ? 'dark' : 'light'
    }

    return (
        <header className="border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
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
                <nav className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300 sm:gap-6">
                    <Link href="/" className="transition hover:text-cyan-600">Home</Link>
                    <Link href="/about" className="transition hover:text-cyan-600">About</Link>
                    <Link href="/contact" className="transition hover:text-cyan-600">Contact</Link>
                    <button type="button" onClick={toggleTheme} aria-label="Toggle dark mode" className="rounded-full border border-slate-300 px-3 py-1.5 text-xs transition hover:border-cyan-500 hover:text-cyan-600 dark:border-slate-600">{dark ? 'Light mode' : 'Dark mode'}</button>
                </nav>
            </div>
        </header>
    )
}
