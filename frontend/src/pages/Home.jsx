import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getFeaturedPosts, getTrendingPosts, getPopularPosts, getPosts } from '../api'
import ArticleCard from '../components/ArticleCard'
import BreakingNewsTicker from '../components/BreakingNewsTicker'
import Sidebar from '../components/Sidebar'
import SocialCounters from '../components/SocialCounters'
import Pagination from '../components/Pagination'

function SectionTitle({ children }) {
  return <h2 className="section-title mb-6">{children}</h2>
}

function TabSection({ newPosts, popularPosts, trendingPosts }) {
  const [active, setActive] = useState('new')
  const tabs = [{ id: 'new', label: 'New Posts', posts: newPosts }, { id: 'popular', label: 'Popular Posts', posts: popularPosts }, { id: 'trending', label: 'Trending', posts: trendingPosts }]
  const current = tabs.find(t => t.id === active)

  return (
    <div>
      {/* Tab headers */}
      <div className="flex border-b border-gray-200 mb-5">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)}
            className={`px-5 py-3 text-sm font-bold uppercase tracking-wide border-b-2 -mb-px transition-colors ${active === t.id ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(current?.posts || []).slice(0, 6).map(post => (
          <ArticleCard key={post.id} post={post} size="normal" />
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [trending, setTrending] = useState([])
  const [popular, setPopular] = useState([])
  const [latest, setLatest] = useState([])
  const [newPosts, setNewPosts] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 6

  useEffect(() => {
    getFeaturedPosts().then(setFeatured).catch(() => {})
    getTrendingPosts().then(setTrending).catch(() => {})
    getPopularPosts().then(setPopular).catch(() => {})
    getPosts({ limit: 6, page: 1 }).then(d => { setNewPosts(d.posts || []) }).catch(() => {})
  }, [])

  useEffect(() => {
    getPosts({ page, limit }).then(d => { setLatest(d.posts || []); setTotal(d.total || 0) }).catch(() => {})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  const hero = featured[0]
  const heroSide = featured.slice(1, 4)

  return (
    <>
      <BreakingNewsTicker posts={featured} />

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Hero Section */}
        {hero && (
          <section className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4" style={{ minHeight: 420 }}>
              <div className="lg:col-span-3">
                <ArticleCard post={hero} size="large" />
              </div>
              <div className="lg:col-span-2 flex flex-col gap-3">
                {heroSide.map(post => (
                  <ArticleCard key={post.id} post={post} size="small" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Latest Reviews + Sidebar */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SectionTitle>LATEST REVIEWS</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {latest.map(post => (
                  <ArticleCard key={post.id} post={post} size="normal" />
                ))}
              </div>
              <Pagination page={page} total={total} limit={limit} onPage={setPage} />
            </div>
            <div>
              <Sidebar />
            </div>
          </div>
        </section>

        {/* Trending Section */}
        {trending.length > 0 && (
          <section className="mb-8">
            <div className="bg-primary rounded-lg p-6">
              <h2 className="text-white text-xl font-extrabold uppercase tracking-wide border-l-4 border-accent pl-3 mb-6">
                TRENDING AFFILIATE PROGRAMS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {trending.map(post => (
                  <div key={post.id} className="bg-white/10 backdrop-blur rounded overflow-hidden group hover:bg-white/20 transition-colors">
                    <Link to={`/post/${post.slug}`}>
                      <div className="article-img-wrap h-40">
                        <img src={post.featured_image} alt={post.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
                          onError={e => e.target.src = 'https://picsum.photos/400/300?grayscale'}
                        />
                      </div>
                    </Link>
                    <div className="p-4">
                      <span className="cat-tag text-xs" style={{ backgroundColor: post.category_color || '#6b7280' }}>
                        {post.category_name}
                      </span>
                      <Link to={`/post/${post.slug}`}>
                        <h3 className="text-white font-bold text-sm mt-2 leading-snug group-hover:text-red-300 line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-400 text-xs">By {post.author_name}</span>
                        {post.rating > 0 && (
                          <span className="text-white font-bold text-sm bg-green-600 px-2 py-0.5 rounded">
                            {post.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Social counters */}
      </div>

      <SocialCounters />

      {/* Explore more - tab section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SectionTitle>EXPLORE MORE</SectionTitle>
        <TabSection newPosts={newPosts} popularPosts={popular} trendingPosts={trending} />
      </div>
    </>
  )
}
