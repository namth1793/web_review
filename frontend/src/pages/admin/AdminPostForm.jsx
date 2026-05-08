import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getAdminPost, createAdminPost, updateAdminPost,
  getAdminCategories, getAdminAuthors, adminUploadImage
} from '../../api/admin'
import RichTextEditor from '../../components/admin/RichTextEditor'

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function parseJsonField(val) {
  if (!val) return []
  if (Array.isArray(val)) return val
  try { return JSON.parse(val) } catch { return [] }
}

export default function AdminPostForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [categories, setCategories] = useState([])
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [autoSlug, setAutoSlug] = useState(!isEdit)
  const [imgUploading, setImgUploading] = useState(false)
  const imgInputRef = useRef()

  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '',
    featured_image: '', author_id: 1, category_id: 1,
    rating: 8.0, is_featured: false, is_trending: false, is_top_affiliate: false,
    cta_text: '', cta_url: '', website_url: '',
    pros: ['', '', ''], cons: ['', '', ''],
    review_highlights: [{ label: '', value: '' }, { label: '', value: '' }, { label: '', value: '' }]
  })

  useEffect(() => {
    Promise.all([getAdminCategories(), getAdminAuthors()])
      .then(([cats, auths]) => { setCategories(cats); setAuthors(auths) })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!isEdit) return
    getAdminPost(id).then(post => {
      const pros = parseJsonField(post.pros)
      const cons = parseJsonField(post.cons)
      const highlights = parseJsonField(post.review_highlights)
      setForm({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        featured_image: post.featured_image || '',
        author_id: post.author_id || 1,
        category_id: post.category_id || 1,
        rating: post.rating || 0,
        is_featured: !!post.is_featured,
        is_trending: !!post.is_trending,
        is_top_affiliate: !!post.is_top_affiliate,
        cta_text: post.cta_text || '',
        cta_url: post.cta_url || '',
        website_url: post.website_url || '',
        pros: pros.length ? pros : ['', '', ''],
        cons: cons.length ? cons : ['', '', ''],
        review_highlights: highlights.length ? highlights : [{ label: '', value: '' }, { label: '', value: '' }, { label: '', value: '' }]
      })
    }).catch(console.error).finally(() => setLoading(false))
  }, [id, isEdit])

  function set(field, value) {
    setForm(f => {
      const next = { ...f, [field]: value }
      if (field === 'title' && autoSlug) next.slug = slugify(value)
      return next
    })
  }

  function setListItem(field, index, value) {
    setForm(f => { const arr = [...f[field]]; arr[index] = value; return { ...f, [field]: arr } })
  }

  function setHighlight(index, key, value) {
    setForm(f => {
      const arr = [...f.review_highlights]
      arr[index] = { ...arr[index], [key]: value }
      return { ...f, review_highlights: arr }
    })
  }

  function addListItem(field, empty) {
    setForm(f => ({ ...f, [field]: [...f[field], empty] }))
  }

  function removeListItem(field, index) {
    setForm(f => ({ ...f, [field]: f[field].filter((_, i) => i !== index) }))
  }

  async function handleFeaturedImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImgUploading(true)
    try {
      const data = await adminUploadImage(file)
      set('featured_image', data.url)
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message))
    } finally {
      setImgUploading(false)
      e.target.value = ''
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        pros: JSON.stringify(form.pros.filter(Boolean)),
        cons: JSON.stringify(form.cons.filter(Boolean)),
        review_highlights: JSON.stringify(form.review_highlights.filter(h => h.label && h.value))
      }
      if (isEdit) {
        await updateAdminPost(id, payload)
      } else {
        await createAdminPost(payload)
      }
      navigate('/admin/posts')
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-gray-400">Loading post...</div>

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Post' : 'New Post'}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {isEdit ? `Editing ID #${id}` : 'Create a new review article'}
            {isEdit && form.slug && (
              <a
                href={`/post/${form.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 text-blue-400 hover:underline"
              >
                View live →
              </a>
            )}
          </p>
        </div>
        <button onClick={() => navigate('/admin/posts')} className="text-gray-400 hover:text-white text-sm">
          ← Back
        </button>
      </div>

      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm mb-5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-xs uppercase tracking-widest text-gray-400">Basic Info</h2>

          <div>
            <label className="block text-gray-300 text-xs font-medium mb-1.5">Title *</label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition"
              placeholder="Product Name Review 2026: Subtitle Here"
              required
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-gray-300 text-xs font-medium mb-1.5">Slug *</label>
              <input
                value={form.slug}
                onChange={e => { setAutoSlug(false); set('slug', e.target.value) }}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-red-500 transition"
                placeholder="product-name-review-2026"
                required
              />
            </div>
            <div className="w-28">
              <label className="block text-gray-300 text-xs font-medium mb-1.5">Rating /10</label>
              <input
                type="number" min="0" max="10" step="0.1"
                value={form.rating}
                onChange={e => set('rating', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-medium mb-1.5">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={e => set('excerpt', e.target.value)}
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition resize-none"
              placeholder="Tóm tắt 1–2 câu hiển thị ở trang chủ và thẻ meta..."
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-gray-300 text-xs font-medium mb-1.5">Category</label>
              <select
                value={form.category_id}
                onChange={e => set('category_id', parseInt(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500"
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-gray-300 text-xs font-medium mb-1.5">Author</label>
              <select
                value={form.author_id}
                onChange={e => set('author_id', parseInt(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500"
              >
                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>

          {/* Featured image */}
          <div>
            <label className="block text-gray-300 text-xs font-medium mb-1.5">Featured Image</label>
            <div className="flex gap-3 items-start">
              <div className="flex-1 space-y-2">
                <input
                  value={form.featured_image}
                  onChange={e => set('featured_image', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition"
                  placeholder="https://... hoặc upload file bên dưới"
                />
                <label className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition border
                  ${imgUploading
                    ? 'border-gray-700 text-gray-600 cursor-wait'
                    : 'border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white'}`}
                >
                  {imgUploading ? '⏳ Uploading...' : '📤 Upload from file'}
                  <input
                    ref={imgInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFeaturedImageUpload}
                    disabled={imgUploading}
                  />
                </label>
              </div>
              {form.featured_image && (
                <img
                  src={form.featured_image}
                  alt="preview"
                  className="w-24 h-16 object-cover rounded-lg border border-gray-700 flex-shrink-0"
                  onError={e => { e.target.style.display = 'none' }}
                />
              )}
            </div>
          </div>

          <div className="flex gap-5">
            {['is_featured', 'is_trending', 'is_top_affiliate'].map(field => (
              <label key={field} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[field]}
                  onChange={e => set(field, e.target.checked)}
                  className="w-4 h-4 rounded accent-red-600"
                />
                <span className="text-gray-300 text-sm capitalize">
                  {field.replace('is_', '').replace('_', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-xs uppercase tracking-widest text-gray-400">Links & CTA</h2>
          <div>
            <label className="block text-gray-300 text-xs font-medium mb-1.5">Official Website URL</label>
            <input
              value={form.website_url}
              onChange={e => set('website_url', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition"
              placeholder="https://productname.com"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-gray-300 text-xs font-medium mb-1.5">CTA Button Text</label>
              <input
                value={form.cta_text}
                onChange={e => set('cta_text', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition"
                placeholder="Try ProductName Free"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-300 text-xs font-medium mb-1.5">CTA / Affiliate URL</label>
              <input
                value={form.cta_url}
                onChange={e => set('cta_url', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 transition"
                placeholder="https://productname.com?ref=insignreview"
              />
            </div>
          </div>
        </div>

        {/* Rich Text Content */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold text-xs uppercase tracking-widest text-gray-400">Nội dung bài viết</h2>
            <span className="text-gray-600 text-xs">Hỗ trợ heading, bold, italic, list, link, ảnh, bảng...</span>
          </div>
          <RichTextEditor
            value={form.content}
            onChange={val => set('content', val)}
          />
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-2 gap-4">
          {['pros', 'cons'].map(field => (
            <div key={field} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-white font-semibold text-xs uppercase tracking-widest text-gray-400 mb-3 capitalize">{field}</h2>
              <div className="space-y-2">
                {form[field].map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={item}
                      onChange={e => setListItem(field, i, e.target.value)}
                      className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-500 transition"
                      placeholder={`${field === 'pros' ? '✅' : '❌'} ${field === 'pros' ? 'Pro' : 'Con'} ${i + 1}`}
                    />
                    <button type="button" onClick={() => removeListItem(field, i)}
                      className="text-gray-600 hover:text-red-400 text-sm w-6">×</button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addListItem(field, '')}
                className="mt-3 text-gray-500 hover:text-gray-300 text-xs">
                + Thêm {field === 'pros' ? 'pro' : 'con'}
              </button>
            </div>
          ))}
        </div>

        {/* Review Highlights */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold text-xs uppercase tracking-widest text-gray-400 mb-3">Review Highlights (chỉ số nổi bật)</h2>
          <div className="space-y-2">
            {form.review_highlights.map((h, i) => (
              <div key={i} className="flex gap-3">
                <input
                  value={h.label}
                  onChange={e => setHighlight(i, 'label', e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-500 transition"
                  placeholder="Nhãn (vd: Giá khởi điểm)"
                />
                <input
                  value={h.value}
                  onChange={e => setHighlight(i, 'value', e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-500 transition"
                  placeholder="Giá trị (vd: $29/tháng)"
                />
                <button type="button" onClick={() => removeListItem('review_highlights', i)}
                  className="text-gray-600 hover:text-red-400 text-sm w-6">×</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addListItem('review_highlights', { label: '', value: '' })}
            className="mt-3 text-gray-500 hover:text-gray-300 text-xs">
            + Thêm highlight
          </button>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pb-8">
          <button
            type="submit"
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold px-8 py-2.5 rounded-lg transition text-sm"
          >
            {saving ? 'Đang lưu...' : isEdit ? '💾 Lưu thay đổi' : '🚀 Đăng bài'}
          </button>
          {isEdit && form.slug && (
            <a
              href={`/post/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm border border-blue-800 hover:border-blue-600 px-4 py-2.5 rounded-lg transition"
            >
              Xem bài trên web →
            </a>
          )}
          <button type="button" onClick={() => navigate('/admin/posts')}
            className="text-gray-400 hover:text-white text-sm">
            Huỷ
          </button>
        </div>
      </form>
    </div>
  )
}
