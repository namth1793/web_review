import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCategories, getTags, subscribeNewsletter } from '../api'

export default function Footer() {
  const [cats, setCats] = useState([])
  const [tags, setTags] = useState([])
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    getCategories().then(setCats).catch(() => {})
    getTags().then(setTags).catch(() => {})
  }, [])

  async function handleSubscribe(e) {
    e.preventDefault()
    try {
      await subscribeNewsletter(email)
      setMsg('Subscribed!'); setEmail('')
    } catch { setMsg('Already subscribed or error.') }
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <footer className="bg-primary text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: About */}
        <div>
          <div className="text-2xl font-extrabold mb-3">
            <span className="text-white">INSIGN</span><span className="text-accent">REVIEW</span>
          </div>
          <p className="text-sm leading-relaxed mb-4 text-gray-400">InsignReview is a specialized platform dedicated to reviewing affiliate programs, SaaS tools, trading platforms, travel services, and lifestyle products.</p>
          <div className="flex gap-3 mb-5">
            {[
              { title: 'Facebook', d: 'M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z' },
              { title: 'Twitter', d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
              { title: 'YouTube', d: 'M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z' }
            ].map(s => (
              <a key={s.title} href="#" title={s.title} className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-accent transition-colors">
                <svg className="w-4 h-4 fill-current text-gray-300" viewBox="0 0 24 24"><path d={s.d} /></svg>
              </a>
            ))}
          </div>
          <div className="text-sm text-gray-400 space-y-1">
            <p>📍 Via Appia Antica, 224, 00179 Roma, Italy</p>
            <p>📞 +1 312 749 8649</p>
          </div>
        </div>

        {/* Col 2: Useful Links */}
        <div>
          <h4 className="widget-title mb-4 text-white">USEFUL LINKS</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: 'Home', to: '/' },
              { label: 'Top Affiliate', to: '/top-affiliate' },
              { label: 'About Us', to: '/about' },
              { label: 'Privacy Policy', to: '/' },
              { label: 'Terms & Conditions', to: '/' },
              { label: 'Our Team', to: '/about' },
            ].map(l => (
              <li key={l.label}>
                <Link to={l.to} className="hover:text-white flex items-center gap-2">
                  <span className="text-accent">›</span> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Categories */}
        <div>
          <h4 className="widget-title mb-4 text-white">CATEGORIES</h4>
          <ul className="space-y-2 text-sm">
            {cats.map(cat => (
              <li key={cat.slug}>
                <Link to={`/category/${cat.slug}`} className="hover:text-white flex justify-between">
                  <span className="flex items-center gap-2"><span className="text-accent">›</span> {cat.name}</span>
                  <span className="text-gray-500 text-xs">({cat.post_count})</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Tags + Newsletter */}
        <div>
          <h4 className="widget-title mb-4 text-white">NEWSLETTER</h4>
          <p className="text-sm text-gray-400 mb-3">Subscribe for the latest reviews delivered to your inbox.</p>
          <form onSubmit={handleSubscribe} className="mb-6">
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full bg-gray-700 text-white px-3 py-2 text-sm rounded-t outline-none placeholder-gray-400 border border-gray-600" />
            <button type="submit" className="w-full bg-accent hover:bg-red-600 text-white text-sm font-bold py-2 rounded-b">SUBSCRIBE</button>
          </form>
          {msg && <p className="text-xs text-green-400 mb-3">{msg}</p>}

          <h4 className="widget-title mb-3 text-white">TAGS</h4>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 12).map(tag => (
              <Link key={tag.slug} to={`/tag/${tag.slug}`}
                className="text-xs bg-gray-700 hover:bg-accent text-gray-300 hover:text-white px-2 py-1 rounded transition-colors">
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-2">
          <p>© {new Date().getFullYear()} InsignReview. All Rights Reserved.</p>
          <div className="flex gap-4 items-center">
            <Link to="/" className="hover:text-gray-300">Privacy Policy</Link>
            <Link to="/" className="hover:text-gray-300">Terms of Service</Link>
            <Link to="/about" className="hover:text-gray-300">Contact</Link>
            <Link to="/admin/login" className="hover:text-gray-300 border border-gray-600 hover:border-gray-400 px-2.5 py-1 rounded transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
