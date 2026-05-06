import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTagPosts } from '../api'
import ArticleCard from '../components/ArticleCard'
import Sidebar from '../components/Sidebar'
import Pagination from '../components/Pagination'

export default function TagPage() {
  const { slug } = useParams()
  const [posts, setPosts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const limit = 9

  useEffect(() => { setPage(1) }, [slug])

  useEffect(() => {
    setLoading(true)
    getTagPosts(slug, page)
      .then(d => { setPosts(d.posts || []); setTotal(d.total || 0) })
      .catch(() => { setPosts([]); setTotal(0) })
      .finally(() => setLoading(false))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug, page])

  const tagName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <div>
      <div className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <span className="text-white">Tag: {tagName}</span>
          </div>
          <h1 className="text-2xl font-extrabold">Posts tagged: <span className="text-accent">#{tagName}</span></h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded shadow-sm animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                      <div className="h-5 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {posts.map(post => <ArticleCard key={post.id} post={post} />)}
                </div>
                <Pagination page={page} total={total} limit={limit} onPage={setPage} />
              </>
            ) : (
              <div className="bg-white rounded p-12 text-center text-gray-400">
                <p>No posts found for this tag.</p>
                <Link to="/" className="text-accent mt-3 block hover:underline">← Back to Home</Link>
              </div>
            )}
          </div>
          <div><Sidebar /></div>
        </div>
      </div>
    </div>
  )
}
