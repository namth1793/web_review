import { Link } from 'react-router-dom'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) > 1 ? 's' : ''} ago`
}

function CategoryTag({ name, color }) {
  return (
    <span className="cat-tag text-xs" style={{ backgroundColor: color || '#6b7280' }}>
      {name}
    </span>
  )
}

function RatingBadge({ rating }) {
  if (!rating) return null
  const color = rating >= 8.5 ? '#22c55e' : rating >= 7 ? '#f59e0b' : '#ef4444'
  return (
    <span className="absolute top-3 right-3 text-white text-sm font-bold px-2 py-1 rounded" style={{ backgroundColor: color }}>
      {rating.toFixed(1)}
    </span>
  )
}

// Large hero card (left featured)
function LargeCard({ post }) {
  return (
    <Link to={`/post/${post.slug}`} className="block relative group rounded overflow-hidden h-full min-h-[400px] bg-gray-800">
      <div className="article-img-wrap h-full">
        <img src={post.featured_image} alt={post.title}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100"
          onError={e => e.target.src = 'https://picsum.photos/800/500?grayscale'}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <CategoryTag name={post.category_name} color={post.category_color} />
        <h2 className="text-white text-xl font-bold mt-2 mb-2 leading-snug group-hover:text-red-300 transition-colors line-clamp-3">
          {post.title}
        </h2>
        <div className="flex items-center gap-3 text-gray-300 text-xs">
          <span>BY {post.author_name?.toUpperCase()}</span>
          <span>•</span>
          <span>{timeAgo(post.created_at)}</span>
        </div>
      </div>
      <RatingBadge rating={post.rating} />
    </Link>
  )
}

// Small stacked card (right side of hero)
function SmallCard({ post }) {
  return (
    <Link to={`/post/${post.slug}`} className="flex gap-3 group bg-white rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="article-img-wrap w-28 h-24 shrink-0">
        <img src={post.featured_image} alt={post.title}
          className="w-full h-full object-cover"
          onError={e => e.target.src = 'https://picsum.photos/200/150?grayscale'}
        />
      </div>
      <div className="flex-1 py-2 pr-2 flex flex-col justify-between">
        <div>
          <CategoryTag name={post.category_name} color={post.category_color} />
          <h3 className="text-gray-800 font-semibold text-sm mt-1 leading-snug group-hover:text-accent line-clamp-2">
            {post.title}
          </h3>
        </div>
        <span className="text-gray-400 text-xs">{timeAgo(post.created_at)}</span>
      </div>
    </Link>
  )
}

// Normal grid card
function NormalCard({ post }) {
  return (
    <div className="bg-white rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      <Link to={`/post/${post.slug}`} className="block relative">
        <div className="article-img-wrap h-48">
          <img src={post.featured_image} alt={post.title}
            className="w-full h-full object-cover"
            onError={e => e.target.src = 'https://picsum.photos/800/500?grayscale'}
          />
        </div>
        <RatingBadge rating={post.rating} />
      </Link>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <CategoryTag name={post.category_name} color={post.category_color} />
        </div>
        <Link to={`/post/${post.slug}`}>
          <h3 className="font-bold text-gray-800 text-base leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center gap-3 text-xs text-gray-400 border-t pt-3">
          <span className="font-semibold text-gray-600">BY {post.author_name?.toUpperCase()}</span>
          <span>•</span>
          <span>{timeAgo(post.created_at)}</span>
          <span className="ml-auto flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            {post.views?.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            {post.comments_count}
          </span>
        </div>
      </div>
    </div>
  )
}

// Horizontal compact card for sidebar/list
function HorizontalCard({ post }) {
  return (
    <Link to={`/post/${post.slug}`} className="flex gap-3 group">
      <div className="article-img-wrap w-20 h-16 shrink-0 rounded overflow-hidden">
        <img src={post.featured_image} alt={post.title}
          className="w-full h-full object-cover"
          onError={e => e.target.src = 'https://picsum.photos/200/150?grayscale'}
        />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-800 group-hover:text-accent leading-snug line-clamp-2">{post.title}</h4>
        <span className="text-gray-400 text-xs mt-1 block">{timeAgo(post.created_at)}</span>
      </div>
    </Link>
  )
}

export default function ArticleCard({ post, size = 'normal' }) {
  if (!post) return null
  if (size === 'large') return <LargeCard post={post} />
  if (size === 'small') return <SmallCard post={post} />
  if (size === 'horizontal') return <HorizontalCard post={post} />
  return <NormalCard post={post} />
}
