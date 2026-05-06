import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ArticleDetail from './pages/ArticleDetail'
import AboutUs from './pages/AboutUs'
import TopAffiliate from './pages/TopAffiliate'
import TagPage from './pages/TagPage'
import SearchResults from './pages/SearchResults'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/post/:slug" element={<ArticleDetail />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/top-affiliate" element={<TopAffiliate />} />
          <Route path="/tag/:slug" element={<TagPage />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
