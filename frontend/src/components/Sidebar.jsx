import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCategories, getTags, getPosts, subscribeNewsletter } from '../api'
import ArticleCard from './ArticleCard'

function Widget({ title, children }) {
  return (
    <div className="bg-white shadow-sm mb-5">
      <div className="widget-title">{title}</div>
      <div className="p-4">{children}</div>
    </div>
  )
}

export default function Sidebar() {
  const [cats, setCats] = useState([])
  const [tags, setTags] = useState([])
  const [recent, setRecent] = useState([])
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getCategories().then(setCats).catch(() => {})
    getTags().then(setTags).catch(() => {})
    getPosts({ limit: 4 }).then(d => setRecent(d.posts || [])).catch(() => {})
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) { navigate(`/search?q=${encodeURIComponent(search.trim())}`); setSearch('') }
  }

  async function handleSubscribe(e) {
    e.preventDefault()
    try { await subscribeNewsletter(email); setMsg('Subscribed!'); setEmail('') }
    catch { setMsg('Already subscribed.') }
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <aside>
      {/* Search */}
      <Widget title="SEARCH">
        <form onSubmit={handleSearch} className="flex">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reviews..."
            className="flex-1 border border-gray-200 px-3 py-2 text-sm outline-none rounded-l" />
          <button type="submit" className="bg-accent text-white px-4 py-2 rounded-r hover:bg-red-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </form>
      </Widget>

      {/* Social */}
      <Widget title="FOLLOW US">
        <div className="space-y-2">
          <a href="#" className="flex items-center justify-between bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z"/></svg>
              <span className="font-semibold">Facebook</span>
            </div>
            <span className="font-bold">12,847</span>
          </a>
          <a href="#" className="flex items-center justify-between bg-gray-800 text-white px-3 py-2 rounded text-sm hover:bg-gray-900">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              <span className="font-semibold">Twitter / X</span>
            </div>
            <span className="font-bold">8,234</span>
          </a>
          <a href="#" className="flex items-center justify-between bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>
              <span className="font-semibold">YouTube</span>
            </div>
            <span className="font-bold">25,600</span>
          </a>
        </div>
      </Widget>

      {/* Categories */}
      <Widget title="CATEGORIES">
        <ul className="space-y-1">
          {cats.map(cat => (
            <li key={cat.slug}>
              <Link to={`/category/${cat.slug}`} className="flex justify-between items-center py-1.5 border-b border-gray-100 text-sm text-gray-600 hover:text-accent">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{cat.post_count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Widget>

      {/* Recent News */}
      <Widget title="RECENT NEWS">
        <div className="space-y-3">
          {recent.map(p => (
            <ArticleCard key={p.id} post={p} size="horizontal" />
          ))}
        </div>
      </Widget>

      {/* Newsletter */}
      <Widget title="DAILY NEWSLETTER">
        <p className="text-sm text-gray-500 mb-3">Get the best reviews delivered to your inbox.</p>
        <form onSubmit={handleSubscribe}>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full border border-gray-200 px-3 py-2 text-sm outline-none rounded mb-2" />
          <button type="submit" className="w-full bg-accent hover:bg-red-600 text-white text-sm font-bold py-2 rounded">SUBSCRIBE</button>
        </form>
        {msg && <p className="text-xs text-green-600 mt-2">{msg}</p>}
      </Widget>

      {/* Tags */}
      <Widget title="POPULAR TAGS">
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Link key={tag.slug} to={`/tag/${tag.slug}`}
              className="text-xs bg-gray-100 hover:bg-accent hover:text-white text-gray-600 px-2.5 py-1 rounded transition-colors">
              {tag.name}
            </Link>
          ))}
        </div>
      </Widget>
    </aside>
  )
}
