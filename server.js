const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3001;
require('dotenv').config();

const path = require('path');
// DB Config
const db = process.env.mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


const port = process.env.PORT || 3001;


const articleSchema = new mongoose.Schema({
  title: String,
  link: String,
});

const Article = mongoose.model('Article', articleSchema);

app.get('/scrape', async (req, res) => {
  try {
    const scrapeUrl = 'https://news.google.com/search?q=Florida+Man'; // Update the URL to Google News

    const { data } = await axios.get(scrapeUrl);
    const $ = cheerio.load(data);
    const articles = [];
    $('.JtKRv').each((index, element) => { // Update the selector to match the Google News article structure
      const title = $(element).text().trim();
      const link = "https://news.google.com" + $(element).attr('href').substring(1).trim(); // Update the selector to match the Google News article structure
      articles.push({ title, link });
    });
    console.log(articles);
    articles.forEach(article => {
      const newArticle = new Article({ title: article.title, link: article.link });
      newArticle.save();
    })

    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Serve static assets (React app) in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('florida-man-app/build'));
  
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'florida-man-app', 'build', 'index.html'));
    });
  }
  
  // API endpoint to fetch articles
  app.get('/api/articles', async (req, res) => {
    try {
      const articles = await Article.find();
      res.json(articles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
