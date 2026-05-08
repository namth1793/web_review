const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'insignreview_admin_secret_2026';

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.admin = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email);
  if (!admin || !bcrypt.compareSync(password, admin.password_hash))
    return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, admin: { id: admin.id, username: admin.username, email: admin.email } });
});

// GET /api/admin/me
router.get('/me', authMiddleware, (req, res) => {
  const admin = db.prepare('SELECT id, username, email FROM admins WHERE id = ?').get(req.admin.id);
  res.json(admin);
});

// ===================== CATEGORIES =====================

// GET /api/admin/categories
router.get('/categories', authMiddleware, (req, res) => {
  const cats = db.prepare('SELECT c.*, (SELECT COUNT(*) FROM posts p WHERE p.category_id = c.id) as post_count FROM categories c ORDER BY c.name').all();
  res.json(cats);
});

// POST /api/admin/categories
router.post('/categories', authMiddleware, (req, res) => {
  const { name, slug, description, color } = req.body;
  if (!name || !slug) return res.status(400).json({ error: 'Name and slug required' });
  try {
    const result = db.prepare('INSERT INTO categories (name, slug, description, color) VALUES (?, ?, ?, ?)').run(name, slug, description || '', color || '#6366f1');
    res.json({ id: result.lastInsertRowid, name, slug, description, color });
  } catch (e) {
    res.status(400).json({ error: 'Slug already exists' });
  }
});

// PUT /api/admin/categories/:id
router.put('/categories/:id', authMiddleware, (req, res) => {
  const { name, slug, description, color } = req.body;
  if (!name || !slug) return res.status(400).json({ error: 'Name and slug required' });
  try {
    db.prepare('UPDATE categories SET name=?, slug=?, description=?, color=? WHERE id=?').run(name, slug, description || '', color || '#6366f1', req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: 'Slug already exists' });
  }
});

// DELETE /api/admin/categories/:id
router.delete('/categories/:id', authMiddleware, (req, res) => {
  const postCount = db.prepare('SELECT COUNT(*) as c FROM posts WHERE category_id = ?').get(req.params.id);
  if (postCount.c > 0) return res.status(400).json({ error: 'Cannot delete category with posts' });
  db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ===================== POSTS =====================

const postFields = `
  p.id, p.title, p.slug, p.excerpt, p.featured_image, p.rating, p.views,
  p.comments_count, p.is_featured, p.is_trending, p.is_top_affiliate,
  p.cta_text, p.cta_url, p.website_url, p.created_at,
  c.name as category_name, c.slug as category_slug
`;

// GET /api/admin/posts
router.get('/posts', authMiddleware, (req, res) => {
  const { page = 1, limit = 20, category, search } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let where = [];
  let params = [];
  if (category) { where.push('c.slug = ?'); params.push(category); }
  if (search) { where.push('(p.title LIKE ? OR p.slug LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const total = db.prepare(`SELECT COUNT(*) as count FROM posts p LEFT JOIN categories c ON p.category_id = c.id ${whereClause}`).get(...params);
  const posts = db.prepare(`SELECT ${postFields} FROM posts p LEFT JOIN categories c ON p.category_id = c.id ${whereClause} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`).all(...params, parseInt(limit), offset);
  res.json({ posts, total: total.count, page: parseInt(page), limit: parseInt(limit) });
});

// GET /api/admin/posts/:id
router.get('/posts/:id', authMiddleware, (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  const tags = db.prepare('SELECT t.id, t.name, t.slug FROM tags t JOIN post_tags pt ON t.id = pt.tag_id WHERE pt.post_id = ?').all(post.id);
  res.json({ ...post, tags });
});

// POST /api/admin/posts
router.post('/posts', authMiddleware, (req, res) => {
  const {
    title, slug, excerpt, content, featured_image, author_id, category_id,
    rating, is_featured, is_trending, is_top_affiliate,
    pros, cons, review_highlights, cta_text, cta_url, website_url
  } = req.body;
  if (!title || !slug) return res.status(400).json({ error: 'Title and slug required' });
  try {
    const result = db.prepare(`
      INSERT INTO posts (title, slug, excerpt, content, featured_image, author_id, category_id,
        rating, is_featured, is_trending, is_top_affiliate, pros, cons, review_highlights,
        cta_text, cta_url, website_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title, slug, excerpt || '', content || '', featured_image || '',
      author_id || 1, category_id || 1,
      parseFloat(rating) || 0,
      is_featured ? 1 : 0, is_trending ? 1 : 0, is_top_affiliate ? 1 : 0,
      typeof pros === 'string' ? pros : JSON.stringify(pros || []),
      typeof cons === 'string' ? cons : JSON.stringify(cons || []),
      typeof review_highlights === 'string' ? review_highlights : JSON.stringify(review_highlights || []),
      cta_text || '', cta_url || '', website_url || ''
    );
    res.json({ id: result.lastInsertRowid, success: true });
  } catch (e) {
    res.status(400).json({ error: e.message || 'Slug already exists' });
  }
});

// PUT /api/admin/posts/:id
router.put('/posts/:id', authMiddleware, (req, res) => {
  const {
    title, slug, excerpt, content, featured_image, author_id, category_id,
    rating, is_featured, is_trending, is_top_affiliate,
    pros, cons, review_highlights, cta_text, cta_url, website_url
  } = req.body;
  if (!title || !slug) return res.status(400).json({ error: 'Title and slug required' });
  try {
    db.prepare(`
      UPDATE posts SET title=?, slug=?, excerpt=?, content=?, featured_image=?,
        author_id=?, category_id=?, rating=?, is_featured=?, is_trending=?, is_top_affiliate=?,
        pros=?, cons=?, review_highlights=?, cta_text=?, cta_url=?, website_url=?
      WHERE id=?
    `).run(
      title, slug, excerpt || '', content || '', featured_image || '',
      author_id || 1, category_id || 1,
      parseFloat(rating) || 0,
      is_featured ? 1 : 0, is_trending ? 1 : 0, is_top_affiliate ? 1 : 0,
      typeof pros === 'string' ? pros : JSON.stringify(pros || []),
      typeof cons === 'string' ? cons : JSON.stringify(cons || []),
      typeof review_highlights === 'string' ? review_highlights : JSON.stringify(review_highlights || []),
      cta_text || '', cta_url || '', website_url || '',
      req.params.id
    );
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message || 'Slug already exists' });
  }
});

// DELETE /api/admin/posts/:id
router.delete('/posts/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM post_tags WHERE post_id = ?').run(req.params.id);
  db.prepare('DELETE FROM comments WHERE post_id = ?').run(req.params.id);
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ===================== AUTHORS =====================

router.get('/authors', authMiddleware, (req, res) => {
  const authors = db.prepare('SELECT * FROM authors ORDER BY name').all();
  res.json(authors);
});

// ===================== STATS =====================

router.get('/stats', authMiddleware, (req, res) => {
  const posts = db.prepare('SELECT COUNT(*) as c FROM posts').get().c;
  const categories = db.prepare('SELECT COUNT(*) as c FROM categories').get().c;
  const comments = db.prepare('SELECT COUNT(*) as c FROM comments').get().c;
  const subscribers = db.prepare('SELECT COUNT(*) as c FROM newsletter').get().c;
  const topPosts = db.prepare('SELECT id, title, views, rating FROM posts ORDER BY views DESC LIMIT 5').all();
  res.json({ posts, categories, comments, subscribers, topPosts });
});

module.exports = router;
