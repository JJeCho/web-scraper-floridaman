import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Multiverse.css";

const Multiverse = () => {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [numArticles, setNumArticles] = useState("");

  const fetchData = async () => {
    // Construct the query parameters based on the user input
    let queryParams = "";
    if (search) {
      queryParams += `search=${search}&`;
    }
    if (source) {
      queryParams += `source=${source}&`;
    }
    if (date) {
      const parsedDate = new Date(date);
      const formattedDate = parsedDate.toLocaleDateString("en-US");
      queryParams += `date=${formattedDate}&`;
    }
    if (numArticles) {
      queryParams += `number=${numArticles}&`;
    }

    // Remove trailing '&' if any
    if (queryParams.endsWith("&")) {
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
    <div id="wrapper">
      <header id="header">
        <h1>
          <a href="">
            <strong>Florida Man</strong> Web Scraper
          </a>
        </h1>
        <nav>
          <ul>
            <li>
              <a href="" className="icon solid fa-info-circle">
                About
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <div className="input-container">
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
        <input
          type="number"
          placeholder="Number of articles"
          value={numArticles}
          onChange={(e) => setNumArticles(e.target.value)}
        />
        <button className="fetchButton" onClick={fetchData}>
          Fetch Articles
        </button>
        <button className="scrapeButton" onClick={handleScrape}>
          Scrape and Refresh
        </button>
      </div>

      <div id="main">
        {articles.map((article) => (
          <article className="thumb" key={article._id}>
            <a
              href={article.link}
              className="image"
              target="_blank"
              rel="noopener noreferrer"
            >
              {article.image !== undefined && (
                <img
                  src={`/getImage?url=${encodeURIComponent(article.image)}`}
                  alt={article.title}
                  className="newsImage"
                />
              )}
            </a>
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <a
              href={article.link}
              className="article-read-more"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Read More</span>
            </a>
          </article>
        ))}
      </div>

      <footer id="footer" className="panel">
        <div className="inner split">
          <div>
            <section>
              <h2>Magna feugiat sed adipiscing</h2>
              <p>
                Nulla consequat, ex ut suscipit rutrum, mi dolor tincidunt erat,
                et scelerisque turpis ipsum eget quis orci mattis aliquet.
                Maecenas fringilla et ante at lorem et ipsum. Dolor nulla eu
                bibendum sapien. Donec non pharetra dui. Nulla consequat, ex ut
                suscipit rutrum, mi dolor tincidunt erat, et scelerisque turpis
                ipsum.
              </p>
            </section>
            <section>
              <h2>Follow me on ...</h2>
              <ul className="icons">
                <li>
                  <a href="" className="icon brands fa-twitter">
                    <span className="label">Twitter</span>
                  </a>
                </li>
              </ul>
            </section>
            <p className="copyright">
              &copy; Untitled. Design: <a href="http://html5up.net">HTML5 UP</a>
              .
            </p>
          </div>
          <div>
            <section>
              <h2>Get in touch</h2>
              <form method="post" action="#">
                <div className="fields">
                  <div className="field half">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Name"
                    />
                  </div>
                  <div className="field half">
                    <input
                      type="text"
                      name="email"
                      id="email"
                      placeholder="Email"
                    />
                  </div>
                  <div className="field">
                    <textarea
                      name="message"
                      id="message"
                      rows="4"
                      placeholder="Message"
                    ></textarea>
                  </div>
                </div>
                <ul className="actions">
                  <li>
                    <input type="submit" value="Send" className="primary" />
                  </li>
                  <li>
                    <input type="reset" value="Reset" />
                  </li>
                </ul>
              </form>
            </section>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Multiverse;
