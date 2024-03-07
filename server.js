const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3001;
require('dotenv').config();
const { getJson } = require("serpapi");
const path = require('path');
const { link } = require('fs');
// DB Config
const db = process.env.mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


const articleSchema = new mongoose.Schema({
  title: String,
  link: String,
  image: String,
  source: String,
  authors: Array,
  date: String,
});

const Article = mongoose.model('Article', articleSchema);

app.get('/scrape', async (req, res) => {
  try {

    
    /** 
    const scrapeUrl = 'https://news.google.com/search?q=Florida+Man'; // Update the URL to Google News

    const { data } = await axios.get(scrapeUrl);
    const $ = cheerio.load(data);
    const articles = [];
    
    $('.m5k28').each((index, element) => {
      const article = {};
    
      // Access the <a> tag with class JtKRv within a div with class IL9Cne within a div with class B6pJDd
      const link = $(element).find('.B6pJDd .IL9Cne .JtKRv').attr('href').substring(1).trim();
      const title = $(element).find('.B6pJDd .IL9Cne .JtKRv').text();
    
      // Access the img with class Quavad within a figure within a figure
      const imageUrl = $(element).find('figure .Quavad').attr('src');
    
      article.title = title;
      article.link = "https://news.google.com" + link;
      article.imageUrl = "https://news.google.com" +  imageUrl;
    
      articles.push(article);
    });

    console.log(articles);
    articles.forEach(article => {
      const newArticle = new Article({ title: article.title, link: article.link, image: article.imageDiv });
      newArticle.save();
    })


    res.json(articles);
    */
    const articles = [];

    getJson({
      api_key: process.env.APIKEY,
      engine: "google_news",
      gl: "us",
      q: "florida man"
    }, (json) => {
      
      json.news_results.forEach((result) => {
        
        const newArticle = new Article({
          title: result.title,
          link: result.link,
          image: result.thumbnail,
          source: result.source.name,
          authors: result.source.authors,
          date: result.date
        });
        newArticle.save()
        articles.push(newArticle);
        console.log(newArticle);
      })
    });

    res.json(articles)
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
      const articles = await Article.find().sort({ createdAt: -1 });;
      res.json(articles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
