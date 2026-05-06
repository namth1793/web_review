import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })

export const getPosts = (params = {}) => api.get('/posts', { params }).then(r => r.data)
export const getFeaturedPosts = () => api.get('/posts/featured').then(r => r.data)
export const getTrendingPosts = () => api.get('/posts/trending').then(r => r.data)
export const getPopularPosts = () => api.get('/posts/popular').then(r => r.data)
export const getTopAffiliatePosts = () => api.get('/posts/top-affiliate').then(r => r.data)
export const getPost = (slug) => api.get(`/posts/${slug}`).then(r => r.data)
export const getRelatedPosts = (slug) => api.get(`/posts/${slug}/related`).then(r => r.data)

export const getCategories = () => api.get('/categories').then(r => r.data)
export const getCategory = (slug) => api.get(`/categories/${slug}`).then(r => r.data)
export const getCategoryPosts = (slug, page = 1) => api.get(`/categories/${slug}/posts`, { params: { page } }).then(r => r.data)

export const getTags = () => api.get('/tags').then(r => r.data)
export const getTagPosts = (slug, page = 1) => api.get(`/tags/${slug}/posts`, { params: { page } }).then(r => r.data)

export const getComments = (postId) => api.get('/comments', { params: { post_id: postId } }).then(r => r.data)
export const addComment = (data) => api.post('/comments', data).then(r => r.data)

export const subscribeNewsletter = (email) => api.post('/newsletter', { email }).then(r => r.data)

export const searchPosts = (q, page = 1) => api.get('/search', { params: { q, page } }).then(r => r.data)
