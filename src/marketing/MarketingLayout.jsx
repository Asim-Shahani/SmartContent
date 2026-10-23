import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { cta } from './styles'

const NAV = [
  ['Features', '/#features'],
  ['How it works', '/#how-it-works'],
  ['Pricing', '/#pricing'],
  ['FAQ', '/#faq'],
  ['Claude', '/mcp'],
  ['Collections', '/free-collections'],
]

export default function MarketingLayout() {
  const { user } = useAuth()
  const { pathname, hash } = useLocation()

  // Scroll to a section when the link has a #hash, otherwise to the top
  useEffect(() => {
    if (hash) {
      const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: calm ? 'auto' : 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link to="/" className="text-lg font-bold tracking-tight">Smart Content</Link>
          <nav className="order-3 flex w-full flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 md:order-none md:w-auto">
            {NAV.map(([label, to]) => (
              <Link key={label} to={to} className="hover:text-gray-900">{label}</Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            {user ? (
              <Link to="/dashboard" className={cta}>Open app</Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold">Log in</Link>
                <Link to="/signup" className={cta}>Try it free</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <Outlet />

      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-gray-500">
          <span>© Smart Content. Research to script. Nothing else.</span>
          <nav className="flex flex-wrap gap-4">
            <Link to="/mcp">Claude connector</Link>
            <Link to="/free-collections">Collections</Link>
            <Link to="/affiliate">Affiliate program</Link>
            <Link to="/help">Help center</Link>
            <Link to="/login">Log in</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}