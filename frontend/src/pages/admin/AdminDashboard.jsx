import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminStats } from '../../api/admin'

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getAdminStats().then(setStats).catch(console.error)
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back to InsignReview admin</p>
      </div>

      {stats ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Posts" value={stats.posts} icon="📝" color="text-blue-400" />
            <StatCard label="Categories" value={stats.categories} icon="🗂️" color="text-green-400" />
            <StatCard label="Comments" value={stats.comments} icon="💬" color="text-yellow-400" />
            <StatCard label="Subscribers" value={stats.subscribers} icon="📧" color="text-red-400" />
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">Top Posts by Views</h2>
              <Link to="/admin/posts" className="text-red-400 text-sm hover:text-red-300">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {stats.topPosts.map((post, i) => (
                <div key={post.id} className="flex items-center gap-4 py-2 border-b border-gray-800 last:border-0">
                  <span className="text-gray-600 text-sm w-5 text-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/admin/posts/${post.id}/edit`}
                      className="text-gray-200 text-sm hover:text-white truncate block"
                    >
                      {post.title}
                    </Link>
                  </div>
                  <span className="text-gray-400 text-xs">{post.views.toLocaleString()} views</span>
                  <span className="text-yellow-400 text-xs font-medium">{post.rating}/10</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Link
              to="/admin/posts/new"
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              + Write New Post
            </Link>
            <Link
              to="/admin/categories"
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              Manage Categories
            </Link>
          </div>
        </>
      ) : (
        <div className="text-gray-500 text-center py-20">Loading stats...</div>
      )}
    </div>
  )
}
