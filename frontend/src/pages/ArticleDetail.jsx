import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPost, getRelatedPosts, getComments, addComment } from '../api'
import ArticleCard from '../components/ArticleCard'
import Sidebar from '../components/Sidebar'
import RatingDisplay from '../components/RatingDisplay'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  return `${months} month${months > 1 ? 's' : ''} ago`
}

function ShareButtons({ title, url }) {
  const encodedUrl = encodeURIComponent(window.location.href)
  const encodedTitle = encodeURIComponent(title)
  return (
    <div className="flex flex-wrap gap-2 my-5">
      <span className="text-sm font-bold text-gray-500 mr-1 self-center">SHARE:</span>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z"/></svg>
        Facebook
      </a>
      <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 bg-gray-900 text-white px-4 py-1.5 rounded text-sm hover:bg-black">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        Twitter
      </a>
      <a href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 bg-green-500 text-white px-4 py-1.5 rounded text-sm hover:bg-green-600">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.562 4.11 1.527 5.825L.057 24l6.352-1.496A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.813 9.813 0 01-5.001-1.371l-.357-.213-3.717.875.94-3.617-.234-.371A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
        WhatsApp
      </a>
      <a href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
        className="flex items-center gap-2 bg-gray-500 text-white px-4 py-1.5 rounded text-sm hover:bg-gray-600">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
        Email
      </a>
    </div>
  )
}

export default function ArticleDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [related, setRelated] = useState([])
  const [comments, setComments] = useState([])
  const [form, setForm] = useState({ name: '', email: '', website: '', content: '' })
  const [formMsg, setFormMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    window.scrollTo(0, 0)
    getPost(slug).then(p => { setPost(p); setLoading(false) }).catch(() => setLoading(false))
    getRelatedPosts(slug).then(setRelated).catch(() => {})
  }, [slug])

  useEffect(() => {
    if (post?.id) getComments(post.id).then(setComments).catch(() => {})
  }, [post])

  async function handleComment(e) {
    e.preventDefault()
    try {
      const c = await addComment({ ...form, post_id: post.id })
      setComments(prev => [...prev, c])
      setForm({ name: '', email: '', website: '', content: '' })
      setFormMsg('Your comment has been posted!')
      setTimeout(() => setFormMsg(''), 3000)
    } catch { setFormMsg('Error posting comment. Please try again.') }
  }

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="h-96 bg-gray-200 rounded mb-4" />
    </div>
  )

  if (!post) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-400">Article not found</h1>
      <Link to="/" className="text-accent mt-4 block hover:underline">← Back to Home</Link>
    </div>
  )

  const pros = JSON.parse(post.pros || '[]')
  const cons = JSON.parse(post.cons || '[]')
  const highlights = JSON.parse(post.review_highlights || '[]')

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link to="/" className="hover:text-accent">Home</Link>
          <span>›</span>
          <Link to={`/category/${post.category_slug}`} className="hover:text-accent capitalize">{post.category_name}</Link>
          <span>›</span>
          <span className="text-gray-600 line-clamp-1">{post.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded shadow-sm overflow-hidden">
              <div className="p-6 pb-0">
                {/* Category + title */}
                <span className="cat-tag text-xs" style={{ backgroundColor: post.category_color || '#6b7280' }}>
                  {post.category_name}
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-3 mb-3 leading-tight">
                  {post.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <img src={post.author_avatar} alt={post.author_name} className="w-7 h-7 rounded-full" onError={e => e.target.style.display='none'} />
                    <span className="font-semibold text-gray-600">BY {post.author_name?.toUpperCase()}</span>
                  </div>
                  <span>•</span>
                  <span>{timeAgo(post.created_at)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    {post.views?.toLocaleString()} views
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                    {post.comments_count} comments
                  </span>
                </div>
              </div>

              {/* Rating banner */}
              {post.rating > 0 && (
                <div className="mx-6 my-5 bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
                  <div className="text-center">
                    <div className="text-5xl font-extrabold">{post.rating.toFixed(1)}</div>
                    <div className="text-sm font-medium opacity-80 mt-1">OVERALL SCORE / 10</div>
                  </div>
                  <div className="flex-1 flex flex-wrap justify-center gap-4 text-center">
                    {highlights.map((h, i) => (
                      <div key={i} className="bg-white/20 rounded-lg px-4 py-2 min-w-[100px]">
                        <div className="font-bold text-lg">{h.value}</div>
                        <div className="text-xs opacity-80">{h.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured image */}
              <div className="px-6 mb-5">
                <img src={post.featured_image} alt={post.title} className="w-full rounded-lg"
                  onError={e => e.target.src = 'https://picsum.photos/800/500?grayscale'} />
              </div>

              {/* CTA Button */}
              {post.cta_text && (
                <div className="px-6 mb-5 text-center">
                  <a href={post.cta_url || '#'}
                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg text-base transition-colors shadow-md hover:shadow-lg">
                    {post.cta_text} →
                  </a>
                </div>
              )}

              {/* Share buttons */}
              <div className="px-6">
                <ShareButtons title={post.title} />
              </div>

              {/* Article content */}
              <div className="px-6 py-4">
                <div className="prose-content" dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              {/* Pros & Cons */}
              {(pros.length > 0 || cons.length > 0) && (
                <div className="mx-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pros.length > 0 && (
                    <div className="border border-green-200 rounded-lg overflow-hidden">
                      <div className="bg-green-600 text-white px-4 py-2 font-bold text-sm uppercase tracking-wide">
                        ✓ Pros
                      </div>
                      <ul className="p-4 space-y-2">
                        {pros.map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-green-500 font-bold mt-0.5">✓</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {cons.length > 0 && (
                    <div className="border border-red-200 rounded-lg overflow-hidden">
                      <div className="bg-red-500 text-white px-4 py-2 font-bold text-sm uppercase tracking-wide">
                        ✗ Cons
                      </div>
                      <ul className="p-4 space-y-2">
                        {cons.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-red-400 font-bold mt-0.5">✗</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="px-6 mb-5 flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-bold text-gray-500">TAGS:</span>
                  {post.tags.map(tag => (
                    <Link key={tag.slug} to={`/tag/${tag.slug}`}
                      className="text-xs bg-gray-100 hover:bg-accent hover:text-white text-gray-600 px-3 py-1 rounded transition-colors">
                      {tag.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Bottom share */}
              <div className="px-6 border-t">
                <ShareButtons title={post.title} />
              </div>

              {/* Author bio */}
              <div className="mx-6 mb-6 p-5 bg-gray-50 rounded-lg flex gap-4">
                <img src={post.author_avatar} alt={post.author_name} className="w-16 h-16 rounded-full shrink-0 object-cover"
                  onError={e => e.target.src = 'https://i.pravatar.cc/150?img=1'} />
                <div>
                  <div className="font-bold text-gray-800">{post.author_name}</div>
                  <div className="text-xs text-gray-500 mb-2">{post.author_role}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{post.author_bio}</p>
                </div>
              </div>
            </article>

            {/* Related posts */}
            {related.length > 0 && (
              <div className="mt-8">
                <h2 className="section-title mb-5">YOU MAY ALSO LIKE</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {related.map(p => <ArticleCard key={p.id} post={p} />)}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="mt-8 bg-white rounded shadow-sm p-6">
              <h2 className="section-title mb-5">{comments.length} COMMENTS</h2>
              {comments.length > 0 ? (
                <div className="space-y-4 mb-8">
                  {comments.map((c, i) => (
                    <div key={c.id || i} className="flex gap-4 p-4 bg-gray-50 rounded">
                      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-gray-800 text-sm">{c.name}</span>
                          <span className="text-xs text-gray-400">{timeAgo(c.created_at)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm mb-6">No comments yet. Be the first to comment!</p>
              )}

              <h3 className="font-bold text-lg text-gray-800 mb-4 border-t pt-6">Leave a Comment</h3>
              <form onSubmit={handleComment} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border border-gray-200 px-3 py-2 text-sm rounded outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-gray-200 px-3 py-2 text-sm rounded outline-none focus:border-accent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website (optional)</label>
                  <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                    className="w-full border border-gray-200 px-3 py-2 text-sm rounded outline-none focus:border-accent" placeholder="https://" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comment *</label>
                  <textarea required rows={5} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    className="w-full border border-gray-200 px-3 py-2 text-sm rounded outline-none focus:border-accent resize-none" />
                </div>
                {formMsg && <p className={`text-sm ${formMsg.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{formMsg}</p>}
                <button type="submit" className="bg-accent hover:bg-red-600 text-white font-bold px-6 py-2 rounded transition-colors">
                  POST COMMENT
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
