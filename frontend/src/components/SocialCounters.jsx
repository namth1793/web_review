export default function SocialCounters() {
  const counters = [
    {
      label: 'FANS', count: '12,847', platform: 'Facebook', color: '#1877f2',
      icon: <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z"/>
    },
    {
      label: 'FOLLOWERS', count: '8,234', platform: 'Twitter / X', color: '#000000',
      icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    },
    {
      label: 'SUBSCRIBERS', count: '25,600', platform: 'YouTube', color: '#ff0000',
      icon: <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/>
    },
  ]

  return (
    <div className="bg-gray-100 border-y border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {counters.map(c => (
            <a key={c.platform} href="#"
              className="flex items-center gap-4 bg-white p-5 rounded shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: c.color }}>
                <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">{c.icon}</svg>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-primary">{c.count}</div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{c.label}</div>
                <div className="text-xs text-gray-400">{c.platform}</div>
              </div>
              <div className="ml-auto">
                <span className="text-xs font-bold px-3 py-1.5 rounded border-2 text-gray-500 border-gray-300 group-hover:border-accent group-hover:text-accent transition-colors">
                  FOLLOW
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
