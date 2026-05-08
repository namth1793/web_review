import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCategories } from '../api'

const categories = [
  { name: 'Tech', slug: 'tech' },
  { name: 'Finance', slug: 'finance' },
  { name: 'Travel', slug: 'travel' },
  { name: 'Fashion', slug: 'fashion' },
  { name: 'Creative', slug: 'creative' },
  { name: 'Health', slug: 'health' },
  { name: 'Dating', slug: 'dating' },
  { name: 'Gaming', slug: 'gaming' },
  { name: 'Music', slug: 'music' },
  { name: 'Home & Living', slug: 'home-living' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [mobileCatOpen, setMobileCatOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const dropRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setCatOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) { navigate(`/search?q=${encodeURIComponent(search.trim())}`); setSearchOpen(false); setSearch('') }
  }

  return (
    <header>
      {/* Top utility bar */}
      <div className="bg-primary text-gray-300 text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>📍 Via Appia Antica, 224, 00179 Roma, Italy &nbsp;|&nbsp; 📞 +1 312 749 8649</span>
          <div className="flex items-center gap-3">
            {/* Social icons */}
            <a href="#" className="hover:text-white" title="Facebook">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z"/></svg>
            </a>
            <a href="#" className="hover:text-white" title="Twitter">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="hover:text-white" title="YouTube">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>
            </a>
            <a href="#" className="hover:text-white" title="Instagram">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 text-2xl font-extrabold tracking-tight">
            <span className="text-primary">INSIGN</span>
            <span className="text-accent">REVIEW</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 text-sm font-600 text-gray-700 hover:text-accent font-semibold">Home</Link>
            <Link to="/top-affiliate" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-accent">Top Affiliate</Link>

            {/* Categories dropdown */}
            <div ref={dropRef} className="relative">
              <button
                onMouseEnter={() => setCatOpen(true)}
                onMouseLeave={() => setCatOpen(false)}
                onClick={() => setCatOpen(v => !v)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-accent flex items-center gap-1"
              >
                Categories
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {catOpen && (
                <div
                  onMouseEnter={() => setCatOpen(true)}
                  onMouseLeave={() => setCatOpen(false)}
                  className="absolute top-full left-0 w-64 bg-white shadow-xl border-t-2 border-accent z-50 py-2"
                >
                  {categories.map(cat => (
                    <Link key={cat.slug} to={`/category/${cat.slug}`} onClick={() => setCatOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent font-medium">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/about" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-accent">About Us</Link>
          </nav>

          {/* Search + mobile toggle */}
          <div className="flex items-center gap-2">
            {searchOpen && (
              <form onSubmit={handleSearch} className="hidden md:flex items-center border border-gray-300 rounded overflow-hidden">
                <input
                  autoFocus value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search reviews..." className="px-3 py-1.5 text-sm outline-none w-48"
                />
                <button type="submit" className="px-3 py-1.5 bg-accent text-white text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              </form>
            )}
            <button onClick={() => setSearchOpen(v => !v)} className="hidden md:block p-2 text-gray-600 hover:text-accent">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <button onClick={() => setMobileOpen(v => !v)} className="md:hidden p-2 text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <form onSubmit={handleSearch} className="flex border-b">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="flex-1 px-4 py-3 text-sm outline-none" />
            <button type="submit" className="px-4 bg-accent text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </form>
          <Link to="/" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-semibold border-b hover:bg-gray-50">Home</Link>
          <Link to="/top-affiliate" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-semibold border-b hover:bg-gray-50">Top Affiliate</Link>
          <button onClick={() => setMobileCatOpen(v => !v)} className="w-full text-left px-4 py-3 text-sm font-semibold border-b hover:bg-gray-50 flex justify-between">
            Categories
            <svg className={`w-4 h-4 transition-transform ${mobileCatOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {mobileCatOpen && (
            <div className="bg-gray-50 border-b">
              {categories.map(cat => (
                <Link key={cat.slug} to={`/category/${cat.slug}`} onClick={() => setMobileOpen(false)}
                  className="block px-8 py-2.5 text-sm text-gray-600 hover:text-accent">
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
          <Link to="/about" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-semibold hover:bg-gray-50">About Us</Link>
        </div>
      )}
    </header>
  )
}
