const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

router.get('/', (req, res) => {
  const cats = db.prepare(`
    SELECT c.*, COUNT(p.id) as post_count
    FROM categories c
    LEFT JOIN posts p ON p.category_id = c.id
    GROUP BY c.id ORDER BY c.name
  `).all();
  res.json(cats);
});

router.get('/:slug', (req, res) => {
  const cat = db.prepare('SELECT * FROM categories WHERE slug = ?').get(req.params.slug);
  if (!cat) return res.status(404).json({ error: 'Category not found' });
  res.json(cat);
});

router.get('/:slug/posts', (req, res) => {
  const { page = 1, limit = 9 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const cat = db.prepare('SELECT id FROM categories WHERE slug = ?').get(req.params.slug);
  if (!cat) return res.status(404).json({ error: 'Category not found' });

  const total = db.prepare('SELECT COUNT(*) as count FROM posts WHERE category_id = ?').get(cat.id);
  const posts = db.prepare(`
    SELECT p.id, p.title, p.slug, p.excerpt, p.featured_image, p.rating, p.views,
      p.comments_count, p.is_featured, p.is_trending, p.created_at,
      a.name as author_name, a.avatar as author_avatar,
      c.name as category_name, c.slug as category_slug, c.color as category_color
    FROM posts p
    LEFT JOIN authors a ON p.author_id = a.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.category_id = ? ORDER BY p.created_at DESC LIMIT ? OFFSET ?
  `).all(cat.id, parseInt(limit), offset);

  res.json({ posts, total: total.count, page: parseInt(page), limit: parseInt(limit) });
});

module.exports = router;
