import { useEffect, useState } from 'react'
import {
  getAdminCategories, createAdminCategory,
  updateAdminCategory, deleteAdminCategory
} from '../../api/admin'

const COLORS = [
  '#3b82f6', '#22c55e', '#f97316', '#ec4899', '#a855f7',
  '#14b8a6', '#ef4444', '#eab308', '#6366f1', '#f59e0b'
]

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const empty = { name: '', slug: '', description: '', color: '#3b82f6' }

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [autoSlug, setAutoSlug] = useState(true)

  function load() {
    getAdminCategories().then(setCategories).catch(console.error)
  }

  useEffect(() => { load() }, [])

  function startCreate() {
    setEditing('new')
    setForm(empty)
    setAutoSlug(true)
    setError('')
  }

  function startEdit(cat) {
    setEditing(cat.id)
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', color: cat.color || '#3b82f6' })
    setAutoSlug(false)
    setError('')
  }

  function setField(field, value) {
    setForm(f => {
      const next = { ...f, [field]: value }
      if (field === 'name' && autoSlug) next.slug = slugify(value)
      return next
    })
  }

  async function handleSave() {
    if (!form.name || !form.slug) { setError('Name and slug required'); return }
    setSaving(true)
    setError('')
    try {
      if (editing === 'new') {
        await createAdminCategory(form)
      } else {
        await updateAdminCategory(editing, form)
      }
      setEditing(null)
      load()
    } catch (e) {
      setError(e.response?.data?.error || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(cat) {
    if (!confirm(`Delete category "${cat.name}"? (Only possible if it has no posts)`)) return
    try {
      await deleteAdminCategory(cat.id)
      load()
    } catch (e) {
      alert(e.response?.data?.error || 'Delete failed')
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-gray-400 text-sm mt-1">{categories.length} categories</p>
        </div>
        <button
          onClick={startCreate}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          + New Category
        </button>
      </div>

      {/* Create/Edit Form */}
      {editing && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold text-sm mb-4">
            {editing === 'new' ? 'Create Category' : 'Edit Category'}
          </h2>
          {error && (
            <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-3 py-2 text-sm mb-4">
              {error}
            </div>
          )}
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-gray-300 text-xs font-medium mb-1.5">Name</label>
                <input
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                  placeholder="Home & Living"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-300 text-xs font-medium mb-1.5">Slug</label>
                <input
                  value={form.slug}
                  onChange={e => { setAutoSlug(false); setField('slug', e.target.value) }}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-red-500"
                  placeholder="home-living"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 text-xs font-medium mb-1.5">Description</label>
              <input
                value={form.description}
                onChange={e => setField('description', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                placeholder="Short description of this category..."
              />
            </div>
            <div>
              <label className="block text-gray-300 text-xs font-medium mb-2">Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setField('color', c)}
                    className="w-7 h-7 rounded-full border-2 transition"
                    style={{
                      backgroundColor: c,
                      borderColor: form.color === c ? 'white' : 'transparent'
                    }}
                  />
                ))}
                <input
                  type="text"
                  value={form.color}
                  onChange={e => setField('color', e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white rounded px-2 text-xs w-24 font-mono focus:outline-none focus:border-red-500"
                  placeholder="#hex"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="text-gray-400 hover:text-white text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Category List */}
      <div className="space-y-2">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex items-center gap-4"
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: cat.color || '#6366f1' }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm">{cat.name}</span>
                <span className="text-gray-600 text-xs font-mono">/{cat.slug}</span>
              </div>
              {cat.description && (
                <p className="text-gray-500 text-xs mt-0.5 truncate">{cat.description}</p>
              )}
            </div>
            <span className="text-gray-500 text-xs">{cat.post_count} posts</span>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(cat)}
                className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 rounded hover:bg-gray-700 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat)}
                className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-gray-700 transition"
                disabled={cat.post_count > 0}
                title={cat.post_count > 0 ? 'Cannot delete: has posts' : 'Delete'}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
