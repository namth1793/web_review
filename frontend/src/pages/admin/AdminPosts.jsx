import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminPosts, deleteAdminPost, getAdminCategories } from '../../api/admin'

export default function AdminPosts() {
  const [data, setData] = useState({ posts: [], total: 0 })
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    getAdminCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    getAdminPosts({ page, search, category, limit: 15 })
      .then(setData)
      .finally(() => setLoading(false))
  }, [page, search, category])

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"?`)) return
    setDeleting(id)
    try {
      await deleteAdminPost(id)
      setData(d => ({ ...d, posts: d.posts.filter(p => p.id !== id), total: d.total - 1 }))
    } catch (e) {
      alert('Failed to delete post')
    } finally {
      setDeleting(null)
    }
  }

  const totalPages = Math.ceil(data.total / 15)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Posts</h1>
          <p className="text-gray-400 text-sm mt-1">{data.total} total posts</p>
        </div>
        <Link
          to="/admin/posts/new"
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          + New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:border-red-500"
        />
        <select
          value={category}
          onChange={e => { setCategory(e.target.value); setPage(1) }}
          className="bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
        >
          <option value="">All categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-gray-500 text-center py-16">Loading...</div>
        ) : data.posts.length === 0 ? (
          <div className="text-gray-500 text-center py-16">No posts found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-400 text-xs font-medium px-5 py-3">Title</th>
                <th className="text-left text-gray-400 text-xs font-medium px-3 py-3">Category</th>
                <th className="text-left text-gray-400 text-xs font-medium px-3 py-3">Rating</th>
                <th className="text-left text-gray-400 text-xs font-medium px-3 py-3">Views</th>
                <th className="text-left text-gray-400 text-xs font-medium px-3 py-3">Date</th>
                <th className="text-right text-gray-400 text-xs font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.posts.map(post => (
                <tr key={post.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-white text-sm font-medium line-clamp-1">{post.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">/post/{post.slug}</p>
                      {post.website_url && (
                        <a
                          href={post.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 text-xs hover:underline"
                        >
                          {post.website_url.replace('https://', '')}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-gray-300 text-xs bg-gray-800 px-2 py-1 rounded">
                      {post.category_name}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-yellow-400 text-sm font-medium">{post.rating}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-gray-400 text-sm">{post.views?.toLocaleString()}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-gray-500 text-xs">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/post/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-700 transition"
                      >
                        View
                      </a>
                      <Link
                        to={`/admin/posts/${post.id}/edit`}
                        className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 rounded hover:bg-gray-700 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={deleting === post.id}
                        className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-gray-700 transition disabled:opacity-40"
                      >
                        {deleting === post.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <span className="text-gray-500 text-sm">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded text-sm disabled:opacity-40 hover:bg-gray-700 transition"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded text-sm disabled:opacity-40 hover:bg-gray-700 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
