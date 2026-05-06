const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

router.get('/', (req, res) => {
  const { q, page = 1, limit = 9 } = req.query;
  if (!q) return res.json({ posts: [], total: 0 });
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const pattern = `%${q}%`;

  const total = db.prepare(`
    SELECT COUNT(*) as count FROM posts p
    WHERE p.title LIKE ? OR p.excerpt LIKE ? OR p.content LIKE ?
  `).get(pattern, pattern, pattern);

  const posts = db.prepare(`
    SELECT p.id, p.title, p.slug, p.excerpt, p.featured_image, p.rating, p.views,
      p.comments_count, p.created_at,
      a.name as author_name, a.avatar as author_avatar,
      c.name as category_name, c.slug as category_slug, c.color as category_color
    FROM posts p
    LEFT JOIN authors a ON p.author_id = a.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.title LIKE ? OR p.excerpt LIKE ?
    ORDER BY p.views DESC LIMIT ? OFFSET ?
  `).all(pattern, pattern, parseInt(limit), offset);

  res.json({ posts, total: total.count, query: q });
});

module.exports = router;
