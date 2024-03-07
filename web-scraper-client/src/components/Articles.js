import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Articles = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Fetch data from the backend API endpoint
    axios.get('/api/articles')
      .then((response) => {
        setArticles(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Florida Man Articles</h1>
      {articles.map((article) => (
        <div key={article._id}>
          <h3>{article.title}</h3>
          <a href={article.link} target="_blank" rel="noopener noreferrer">
            Read More
          </a>
        </div>
      ))}
    </div>
  );
};

export default Articles;
