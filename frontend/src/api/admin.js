import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const adminLogin = (email, password) =>
  api.post('/admin/login', { email, password }).then(r => r.data)
export const adminMe = () => api.get('/admin/me').then(r => r.data)

// Stats
export const getAdminStats = () => api.get('/admin/stats').then(r => r.data)

// Posts
export const getAdminPosts = (params = {}) =>
  api.get('/admin/posts', { params }).then(r => r.data)
export const getAdminPost = (id) => api.get(`/admin/posts/${id}`).then(r => r.data)
export const createAdminPost = (data) => api.post('/admin/posts', data).then(r => r.data)
export const updateAdminPost = (id, data) =>
  api.put(`/admin/posts/${id}`, data).then(r => r.data)
export const deleteAdminPost = (id) => api.delete(`/admin/posts/${id}`).then(r => r.data)

// Categories
export const getAdminCategories = () => api.get('/admin/categories').then(r => r.data)
export const createAdminCategory = (data) =>
  api.post('/admin/categories', data).then(r => r.data)
export const updateAdminCategory = (id, data) =>
  api.put(`/admin/categories/${id}`, data).then(r => r.data)
export const deleteAdminCategory = (id) =>
  api.delete(`/admin/categories/${id}`).then(r => r.data)

// Authors
export const getAdminAuthors = () => api.get('/admin/authors').then(r => r.data)

// Image upload
export const adminUploadImage = (file) => {
  const form = new FormData()
  form.append('image', file)
  return api.post('/admin/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data)
}
