const express = require('express');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const contactRoutes = require('./routes/contactRoutes');
const goldRoutes = require('./routes/goldPriceRoutes');
const blogRoutes = require('./routes/blogRoutes');
const quoteRoutes = require('./routes/quoteBlogRoutes');

const App = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/contact', contactRoutes);
app.use('/gold', goldRoutes);
app.use('/blogs', blogRoutes);
app.use('/quotes', quoteRoutes);

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello World!' });
});

module.exports = app;
