export default function Pagination({ page, total, limit, onPage }) {
  const totalPages = Math.ceil(total / limit)
  if (totalPages <= 1) return null

  const pages = []
  for (let i = 1; i <= totalPages; i++) pages.push(i)

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button onClick={() => onPage(page - 1)} disabled={page === 1}
        className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-accent hover:text-white hover:border-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        ‹
      </button>
      {pages.map(p => (
        <button key={p} onClick={() => onPage(p)}
          className={`px-3 py-2 text-sm border rounded transition-colors ${p === page ? 'bg-accent text-white border-accent' : 'border-gray-300 hover:bg-accent hover:text-white hover:border-accent'}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onPage(page + 1)} disabled={page === totalPages}
        className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-accent hover:text-white hover:border-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        ›
      </button>
    </div>
  )
}
