const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

router.get('/', (req, res) => {
  const { post_id } = req.query;
  if (!post_id) return res.status(400).json({ error: 'post_id required' });
  const comments = db.prepare('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC').all(post_id);
  res.json(comments);
});

router.post('/', (req, res) => {
  const { post_id, name, email, website, content } = req.body;
  if (!post_id || !name || !email || !content) return res.status(400).json({ error: 'Missing required fields' });
  const result = db.prepare('INSERT INTO comments (post_id, name, email, website, content) VALUES (?, ?, ?, ?, ?)').run(post_id, name, email, website || null, content);
  db.prepare('UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?').run(post_id);
  res.json({ id: result.lastInsertRowid, post_id, name, email, website, content, created_at: new Date().toISOString() });
});

module.exports = router;
