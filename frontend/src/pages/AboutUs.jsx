import { Link } from 'react-router-dom'

const team = [
  {
    name: 'Alex Kim',
    role: 'Founder & Senior Tech Reviewer',
    avatar: 'https://i.pravatar.cc/150?img=8',
    bio: 'Alex has 8+ years reviewing SaaS tools, AI platforms, cloud services, and developer tools. He founded InsignReview to provide honest, data-driven affiliate reviews that help creators and businesses make smarter decisions.',
    twitter: '#', linkedin: '#'
  },
  {
    name: 'Sarah Johnson',
    role: 'Finance & Lifestyle Writer',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Sarah covers finance platforms, prop firms, travel services, fashion, health, and dating apps. With a background in financial journalism, she brings analytical rigor and practical insight to every review she publishes.',
    twitter: '#', linkedin: '#'
  }
]

const stats = [
  { value: '15+', label: 'Expert Reviews' },
  { value: '2', label: 'Specialist Writers' },
  { value: '9', label: 'Categories Covered' },
  { value: '100K+', label: 'Monthly Readers' },
]

export default function AboutUs() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-1 text-3xl font-extrabold mb-2">
            <span>INSIGN</span><span className="text-accent">REVIEW</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-4">About Us</h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            InsignReview is a specialized platform dedicated to reviewing affiliate programs,
            SaaS tools, trading platforms, travel services, and lifestyle products — with honesty and depth.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-accent">Home</Link>
          <span>›</span>
          <span className="text-gray-600">About Us</span>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="section-title mb-5">OUR MISSION</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600 text-sm leading-relaxed">
            <div>
              <p className="mb-4">InsignReview was founded with a clear mission: to provide comprehensive, unbiased reviews of affiliate programs and digital products that help our readers make smarter decisions.</p>
              <p>We believe that the best affiliate reviews go beyond surface-level summaries. Every review on InsignReview includes real testing, pricing analysis, pros and cons, competitor comparisons, and clear recommendations for who should — and shouldn't — use each product.</p>
            </div>
            <div>
              <p className="mb-4">Our team of specialist writers covers tech tools, finance platforms, travel services, fashion brands, health apps, and dating platforms — each bringing domain expertise to their category.</p>
              <p>We maintain editorial independence from the products we review. While some posts contain affiliate links that help support our work, our ratings and opinions are never influenced by commercial relationships.</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-3xl font-extrabold text-accent mb-1">{s.value}</div>
              <div className="text-sm text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="section-title mb-6">MEET OUR AUTHORS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.map(member => (
              <div key={member.name} className="border border-gray-100 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <img src={member.avatar} alt={member.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 shadow"
                    onError={e => e.target.src = 'https://i.pravatar.cc/150?img=1'} />
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">{member.name}</h3>
                    <p className="text-accent text-sm font-medium">{member.role}</p>
                    <div className="flex gap-2 mt-2">
                      <a href={member.twitter} className="w-7 h-7 bg-gray-800 rounded flex items-center justify-center hover:bg-accent transition-colors">
                        <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </a>
                      <a href={member.linkedin} className="w-7 h-7 bg-blue-700 rounded flex items-center justify-center hover:bg-accent transition-colors">
                        <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="section-title mb-6">OUR VALUES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: '🎯', title: 'Honest Reviews', desc: 'We test products thoroughly and give honest ratings — even when they disappoint.' },
              { icon: '📊', title: 'Data-Driven', desc: 'Every review includes pricing analysis, feature comparisons, and objective scoring.' },
              { icon: '🔒', title: 'Editorial Independence', desc: 'Our ratings are never influenced by affiliate relationships or sponsorship deals.' },
            ].map(v => (
              <div key={v.title} className="text-center p-5 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-3">{v.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
