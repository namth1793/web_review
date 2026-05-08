import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { adminMe } from '../../api/admin'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/posts', label: 'Posts', icon: '📝' },
  { to: '/admin/posts/new', label: 'New Post', icon: '✏️' },
  { to: '/admin/categories', label: 'Categories', icon: '🗂️' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { navigate('/admin/login'); return }
    adminMe().then(setAdmin).catch(() => {
      localStorage.removeItem('admin_token')
      navigate('/admin/login')
    })
  }, [navigate])

  function logout() {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <span className="text-white font-bold text-sm">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          {admin && (
            <div className="mb-3">
              <p className="text-white text-xs font-medium truncate">{admin.username}</p>
              <p className="text-gray-500 text-xs truncate">{admin.email}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full text-left text-gray-400 hover:text-red-400 text-xs px-3 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Sign Out
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-gray-500 hover:text-gray-300 text-xs px-3 py-1.5 mt-1 transition"
          >
            ← View Site
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
