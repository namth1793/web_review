import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTopAffiliatePosts } from '../api'
import Sidebar from '../components/Sidebar'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days < 30) return `${days} days ago`
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`
}

export default function TopAffiliate() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTopAffiliatePosts().then(setPosts).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="bg-primary text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <span className="text-white">Top Affiliate Programs</span>
          </div>
          <h1 className="text-3xl font-extrabold uppercase tracking-wide">TOP AFFILIATE PROGRAMS</h1>
          <p className="text-gray-400 mt-2">Hand-picked affiliate programs reviewed and rated by our expert team.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded shadow-sm animate-pulse h-40" />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-5">
                {posts.map((post, i) => {
                  const highlights = JSON.parse(post.review_highlights || '[]')
                  const scoreColor = post.rating >= 8.5 ? '#22c55e' : post.rating >= 7 ? '#f59e0b' : '#ef4444'
                  return (
                    <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                      <div className="flex flex-col md:flex-row">
                        {/* Rank + image */}
                        <div className="relative md:w-72 shrink-0">
                          <div className="absolute top-3 left-3 z-10 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                            #{i + 1}
                          </div>
                          <Link to={`/post/${post.slug}`} className="block h-48 md:h-full overflow-hidden">
                            <img src={post.featured_image} alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={e => e.target.src = 'https://picsum.photos/400/300?grayscale'} />
                          </Link>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="cat-tag text-xs" style={{ backgroundColor: post.category_color || '#6b7280' }}>
                                  {post.category_name}
                                </span>
                                <span className="text-xs text-gray-400">{timeAgo(post.created_at)}</span>
                              </div>
                              <Link to={`/post/${post.slug}`}>
                                <h2 className="font-extrabold text-lg text-gray-800 group-hover:text-accent transition-colors leading-snug mb-2">
                                  {post.title}
                                </h2>
                              </Link>
                              <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>

                              {/* Highlights */}
                              {highlights.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {highlights.map((h, j) => (
                                    <span key={j} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                      <strong>{h.label}:</strong> {h.value}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div className="flex items-center gap-3">
                                <Link to={`/post/${post.slug}`}
                                  className="bg-accent hover:bg-red-600 text-white text-sm font-bold px-4 py-2 rounded transition-colors">
                                  Read Review →
                                </Link>
                                {post.cta_text && (
                                  <a href={post.cta_url || '#'}
                                    className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-2 rounded transition-colors">
                                    {post.cta_text}
                                  </a>
                                )}
                              </div>
                            </div>

                            {/* Score */}
                            <div className="text-center shrink-0">
                              <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center text-xl font-extrabold" style={{ borderColor: scoreColor, color: scoreColor }}>
                                {post.rating.toFixed(1)}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">SCORE</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-white rounded p-12 text-center text-gray-400">
                No top affiliate reviews found.
              </div>
            )}
          </div>

          <div>
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
