import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Articles.css";
//<img src={article.image} alt={article.title} referrerPolicy="no-referrer" />

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const fetchData = () => {
    axios
      .get("/api/articles")
      .then((response) => {
        setArticles(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleScrape = () => {
    axios
      .get("/scrape")
      .then(() => {
        fetchData(); // Reload the data from the backend API endpoint
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchData(); // Fetch data from the backend API endpoint on initial render
  }, []);

  return (
    <div className='articles-app'>
      <div>
        <h1 className="articles-header">Florida Man Articles</h1>
        <button onClick={handleScrape}>Scrape and Refresh</button>
      </div>
      <div className="articles-container">
        {articles.map((article) => (
          <div className="article" key={article._id}>
            <h3 className="article-title">{article.title}</h3>
            <a
              className="article-link"
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
            >
               {article.image !== undefined && <img src={`/getImage?url=${encodeURIComponent(article.image)}`} alt={article.title} />}
              Read More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Articles;
