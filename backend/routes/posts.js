const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

const postFields = `
  p.id, p.title, p.slug, p.excerpt, p.featured_image, p.rating, p.views,
  p.comments_count, p.is_featured, p.is_trending, p.is_top_affiliate,
  p.pros, p.cons, p.review_highlights, p.cta_text, p.cta_url, p.website_url, p.created_at,
  a.name as author_name, a.slug as author_slug, a.avatar as author_avatar,
  c.name as category_name, c.slug as category_slug, c.color as category_color
`;

const postJoin = `
  FROM posts p
  LEFT JOIN authors a ON p.author_id = a.id
  LEFT JOIN categories c ON p.category_id = c.id
`;

// GET /api/posts/featured
router.get('/featured', (req, res) => {
  const posts = db.prepare(`SELECT ${postFields} ${postJoin} WHERE p.is_featured = 1 ORDER BY p.created_at DESC LIMIT 4`).all();
  res.json(posts);
});

// GET /api/posts/trending
router.get('/trending', (req, res) => {
  const posts = db.prepare(`SELECT ${postFields} ${postJoin} WHERE p.is_trending = 1 ORDER BY p.views DESC LIMIT 6`).all();
  res.json(posts);
});

// GET /api/posts/popular
router.get('/popular', (req, res) => {
  const posts = db.prepare(`SELECT ${postFields} ${postJoin} ORDER BY p.views DESC LIMIT 6`).all();
  res.json(posts);
});

// GET /api/posts/top-affiliate
router.get('/top-affiliate', (req, res) => {
  const posts = db.prepare(`SELECT ${postFields} ${postJoin} WHERE p.is_top_affiliate = 1 ORDER BY p.rating DESC`).all();
  res.json(posts);
});

// GET /api/posts
router.get('/', (req, res) => {
  const { page = 1, limit = 9, category, tag } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let where = [];
  let params = [];

  if (category) { where.push('c.slug = ?'); params.push(category); }
  if (tag) {
    where.push('p.id IN (SELECT pt.post_id FROM post_tags pt JOIN tags t ON pt.tag_id = t.id WHERE t.slug = ?)');
    params.push(tag);
  }

  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const total = db.prepare(`SELECT COUNT(*) as count ${postJoin} ${whereClause}`).get(...params);
  const posts = db.prepare(`SELECT ${postFields} ${postJoin} ${whereClause} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`).all(...params, parseInt(limit), offset);

  res.json({ posts, total: total.count, page: parseInt(page), limit: parseInt(limit) });
});

// GET /api/posts/:slug/related
router.get('/:slug/related', (req, res) => {
  const post = db.prepare('SELECT category_id FROM posts WHERE slug = ?').get(req.params.slug);
  if (!post) return res.json([]);
  const related = db.prepare(`SELECT ${postFields} ${postJoin} WHERE p.category_id = ? AND p.slug != ? ORDER BY p.views DESC LIMIT 3`).all(post.category_id, req.params.slug);
  res.json(related);
});

// GET /api/posts/:slug
router.get('/:slug', (req, res) => {
  const post = db.prepare(`SELECT p.*, a.name as author_name, a.slug as author_slug, a.avatar as author_avatar, a.role as author_role, a.bio as author_bio, c.name as category_name, c.slug as category_slug, c.color as category_color ${postJoin} WHERE p.slug = ?`).get(req.params.slug);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  // Increment views
  db.prepare('UPDATE posts SET views = views + 1 WHERE slug = ?').run(req.params.slug);

  // Get tags
  const tags = db.prepare(`
    SELECT t.name, t.slug FROM tags t
    JOIN post_tags pt ON t.id = pt.tag_id
    WHERE pt.post_id = ?
  `).all(post.id);

  res.json({ ...post, tags });
});

module.exports = router;
