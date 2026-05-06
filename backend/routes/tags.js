const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

router.get('/', (req, res) => {
  const tags = db.prepare(`
    SELECT t.*, COUNT(pt.post_id) as post_count
    FROM tags t LEFT JOIN post_tags pt ON t.id = pt.tag_id
    GROUP BY t.id ORDER BY post_count DESC
  `).all();
  res.json(tags);
});

router.get('/:slug/posts', (req, res) => {
  const { page = 1, limit = 9 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const tag = db.prepare('SELECT id FROM tags WHERE slug = ?').get(req.params.slug);
  if (!tag) return res.status(404).json({ error: 'Tag not found' });

  const total = db.prepare('SELECT COUNT(*) as count FROM post_tags WHERE tag_id = ?').get(tag.id);
  const posts = db.prepare(`
    SELECT p.id, p.title, p.slug, p.excerpt, p.featured_image, p.rating, p.views,
      p.comments_count, p.created_at,
      a.name as author_name, a.avatar as author_avatar,
      c.name as category_name, c.slug as category_slug, c.color as category_color
    FROM posts p
    JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN authors a ON p.author_id = a.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE pt.tag_id = ? ORDER BY p.created_at DESC LIMIT ? OFFSET ?
  `).all(tag.id, parseInt(limit), offset);

  res.json({ posts, total: total.count, page: parseInt(page), limit: parseInt(limit) });
});

module.exports = router;
