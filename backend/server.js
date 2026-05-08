require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./db/database');

const postsRouter = require('./routes/posts');
const categoriesRouter = require('./routes/categories');
const tagsRouter = require('./routes/tags');
const commentsRouter = require('./routes/comments');
const newsletterRouter = require('./routes/newsletter');
const searchRouter = require('./routes/search');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5026;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initDB();

app.use('/api/posts', postsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/search', searchRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'InsignReview API running on port ' + PORT });
});

app.listen(PORT, () => {
  console.log(`InsignReview Backend: http://localhost:${PORT}`);
});
