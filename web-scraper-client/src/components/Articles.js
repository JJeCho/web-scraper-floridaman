import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Articles.css";
//<img src={article.image} alt={article.title} referrerPolicy="no-referrer" />

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState('');
  
  const fetchData = async () => {
    // Construct the query parameters based on the user input
    let queryParams = '';
    if (search) {
      queryParams += `search=${search}&`;
    }
    if (source) {
      queryParams += `source=${source}&`;
    }
    if (date) {
      const parsedDate = new Date(date);
      const formattedDate = parsedDate.toLocaleDateString('en-US');
      queryParams += `date=${formattedDate}&`;
    }

    // Remove trailing '&' if any
    if (queryParams.endsWith('&')) {
      queryParams = queryParams.slice(0, -1);
    }

    // Make the API request with the constructed query parameters
    const response = await fetch(`/api/articles?${queryParams}`);
    const data = await response.json();

    setArticles(data);
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
        <div>
      <input
        type="text"
        placeholder="Search terms"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <input
        type="text"
        placeholder="Desired source"
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button onClick={fetchData}>Fetch Articles</button>
    </div>
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
