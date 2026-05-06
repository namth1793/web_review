export default function RatingDisplay({ rating, size = 'normal' }) {
  if (!rating) return null
  const stars = 5
  const filled = Math.round((rating / 10) * stars * 2) / 2
  const color = rating >= 8.5 ? '#22c55e' : rating >= 7 ? '#f59e0b' : '#ef4444'

  return (
    <div className={`flex items-center gap-2 ${size === 'large' ? 'flex-col' : ''}`}>
      <div className={`font-extrabold ${size === 'large' ? 'text-6xl' : 'text-2xl'}`} style={{ color }}>
        {rating.toFixed(1)}
        {size !== 'large' && <span className="text-base font-normal text-gray-400">/10</span>}
      </div>
      {size === 'large' && <div className="text-base text-gray-400 font-medium">/10 OVERALL SCORE</div>}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: stars }).map((_, i) => {
          const val = i + 1
          const isFull = filled >= val
          const isHalf = !isFull && filled >= val - 0.5
          return (
            <svg key={i} className={`${size === 'large' ? 'w-6 h-6' : 'w-4 h-4'}`} viewBox="0 0 24 24">
              {isFull ? (
                <path fill="#f59e0b" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              ) : isHalf ? (
                <>
                  <defs><clipPath id={`half-${i}`}><rect x="0" y="0" width="12" height="24"/></clipPath></defs>
                  <path fill="#d1d5db" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  <path fill="#f59e0b" clipPath={`url(#half-${i})`} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </>
              ) : (
                <path fill="#d1d5db" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              )}
            </svg>
          )
        })}
      </div>
    </div>
  )
}
