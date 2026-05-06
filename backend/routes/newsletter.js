const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

router.post('/', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  try {
    db.prepare('INSERT INTO newsletter (email) VALUES (?)').run(email);
    res.json({ success: true, message: 'Subscribed successfully!' });
  } catch (e) {
    if (e.message.includes('UNIQUE')) return res.status(409).json({ error: 'Already subscribed' });
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
