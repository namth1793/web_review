import { Link } from 'react-router-dom'

export default function BreakingNewsTicker({ posts = [] }) {
  if (!posts.length) return null
  const tickerText = posts.map(p => p.title).join('   ●   ')

  return (
    <div className="bg-white border-b border-gray-200 py-2">
      <div className="max-w-7xl mx-auto px-4 flex items-center overflow-hidden">
        <span className="bg-accent text-white text-xs font-bold px-3 py-1 uppercase tracking-wider shrink-0 mr-4">
          Breaking News
        </span>
        <div className="overflow-hidden flex-1">
          <div className="ticker-animation text-sm text-gray-700">
            {posts.map((p, i) => (
              <span key={p.id}>
                {i > 0 && <span className="mx-4 text-accent">●</span>}
                <Link to={`/post/${p.slug}`} className="hover:text-accent">
                  {p.title}
                </Link>
              </span>
            ))}
            <span className="mx-4 text-accent">●</span>
            {posts.map((p, i) => (
              <span key={`r-${p.id}`}>
                {i > 0 && <span className="mx-4 text-accent">●</span>}
                <Link to={`/post/${p.slug}`} className="hover:text-accent">
                  {p.title}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
