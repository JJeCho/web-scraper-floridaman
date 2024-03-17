const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

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
  date: Date,
});

app.use(cors());

const Article = mongoose.model('Article', articleSchema);

app.get('/scrape', async (req, res) => {
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
    try {
      const json = await getJson({
        api_key: process.env.APIKEY,
        engine: "google_news",
        gl: "us",
        q: "florida man"
      });
  
      const articles = json.news_results;
  
      for (const result of articles) {
        // Check if the article already exists in the database based on title or URL
        const existingArticle = await Article.findOne({ title: result.title });
  
        if (!existingArticle) {
          // If the article does not exist, create a new article and save it
          const newArticle = new Article({
            title: result.title,
            link: result.link,
            image: result.thumbnail,
            source: result.source ? result.source.name : result.name,
            authors: result.source ? result.source.authors : [],
            date: result.date
          });
  
          await newArticle.save();
        }
      }

    res.json({ message: 'Scrape completed successfully' })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during scraping' });
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
      // Extract query parameters from the request
      const { search, source, date } = req.query;
  
      // Construct the filter object based on the provided query parameters
      const filter = {};
      
      if (search) {
        filter.title = { $regex: search, $options: 'i' }; // Case-insensitive search by title
      }
  
      if (source) {
        filter.source = { $regex: source, $options: 'i' };
      }
  
      if (date) {
        console.log(date);
        const parsedDate = new Date(date);
        console.log(parsedDate);
        const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));
        
        filter.date = { $gte: startOfDay, $lte: endOfDay };
      }
  
      // Query the database with the constructed filter
      const articles = await Article.find(filter);
  
      res.json(articles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching articles' });
    }
  });

  app.get('/getImage', async (req, res) => {
    const imageUrl = decodeURIComponent(req.query.url);
  
    try {
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
  
      res.writeHead(200, {
        'Content-Type': response.headers.get('content-type'),
        'Content-Length': buffer.length
      });
      res.end(buffer);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching image');
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
