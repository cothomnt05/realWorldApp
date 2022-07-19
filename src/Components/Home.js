import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useRecoilState } from "recoil";
import { authState } from "../features/authState";

function Home() {
  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const auth = useRecoilValue(authState);
  const [isFavorited, setIsFavorite] = useState(true);
  const [feed, setFeed] = useState([]);
  const [isAll, setIsAll] = useState(true);
  const [tagArticle, setTagArticle] = useState(false);
  const [arrTag, setArrTag] = useState([]);

  const getArticles = async () => {
    try {
      const res = await axios.get("https://api.realworld.io/api/articles", {
        headers: {
          "Content-Type": "application/json",
          "Acess-Control-Allow-Origin": "*",
          Authorization: `Bearer ${auth.user.token}`,
          Accept: "application/json",
        },
      });
      setArticles(res.data.articles);
    } catch (error) {
      console.log(error);
    }
  };

  const getTags = async () => {
    try {
      const res = await axios.get("https://api.realworld.io/api/tags", {
        headers: {
          "Content-Type": "application/json",
          "Acess-Control-Allow-Origin": "*",
          Authorization: `Bearer ${auth.user.token}`,
          Accept: "application/json",
        },
      });
      setTags(res.data.tags);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavorite = async (article) => {
    try {
      const res = await axios.post(
        `https://api.realworld.io/api/articles/${article.slug}/favorite`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Acess-Control-Allow-Origin": "*",
            Authorization: `Token ${auth.user.token}`,
            Accept: "application/json",
          },
        }
      );
      setIsFavorite(!isFavorited);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavoriteDel = async (article) => {
    try {
      const res = await axios.delete(
        `https://api.realworld.io/api/articles/${article.slug}/favorite`,
        {
          headers: {
            "Content-Type": "application/json",
            "Acess-Control-Allow-Origin": "*",
            Authorization: `Token ${auth.user.token}`,
            Accept: "application/json",
          },
        }
      );
      setIsFavorite(!isFavorited);
    } catch (error) {
      console.log(error);
    }
  };

  const getFeed = async () => {
    try {
      const res = await axios.get(
        "https://api.realworld.io/api/articles/feed",
        {
          headers: {
            "Content-Type": "application/json",
            "Acess-Control-Allow-Origin": "*",
            Authorization: `Token ${auth.user.token}`,
            Accept: "application/json",
          },
        }
      );
      setFeed(res.data.articles);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTag = (tag) => {
    const tagSelectArr = articles.filter((article) =>
      article.tagList.includes(tag)
    );
    setArrTag(tagSelectArr);
    setTagArticle(true);
    setTag(tag);
  };

  useEffect(() => {
    getArticles();
    getTags();
    getFeed();
  }, [isFavorited, tagArticle]);

  return (
    <>
      <div className="home-page">
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>

        <div className="container page">
          <div className="row">
            <div className="col-md-9">
              <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <Link
                      to="/"
                      className={`nav-link ${
                        tagArticle ? "" : isAll ? "" : "active"
                      }`}
                      onClick={(e) => {
                        setIsAll(false);
                        setTagArticle(false);
                      }}
                    >
                      Your Feed
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/"
                      className={`nav-link ${
                        tagArticle ? "" : isAll ? "active" : ""
                      }`}
                      onClick={(e) => {
                        setIsAll(true);
                        setTagArticle(false);
                      }}
                    >
                      Global Feed
                    </Link>
                  </li>
                  {tagArticle ? (
                    <li className="nav-item">
                      <Link to="/" className={`nav-link active`}>
                        # {tag}
                      </Link>
                    </li>
                  ) : (
                    <></>
                  )}
                </ul>
              </div>
              {(tagArticle ? arrTag : isAll ? articles : feed).map(
                (article, index) => (
                  <div className="article-preview" key={index}>
                    <div className="article-meta">
                      <Link to={`/Profiles/${article.author.username}`}>
                        <img src={article.author.image} alt={article.title} />
                      </Link>
                      <div className="info">
                        <Link
                          to={`/Profiles/${article.author.username}`}
                          className="author"
                        >
                          {article.author.username}
                        </Link>
                        <time className="date" dateTime={article.createdAt}>
                          {new Date(article.createdAt).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </time>
                      </div>
                      <button
                        className={`btn btn-sm pull-xs-right ${
                          article.favorited
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={(e) =>
                          article.favorited
                            ? handleFavoriteDel(article)
                            : handleFavorite(article)
                        }
                      >
                        <i className="ion-heart"></i> {article.favoritesCount}
                      </button>
                    </div>
                    <Link
                      to={`/Article/${article.slug}`}
                      className="preview-link"
                    >
                      <h1>{article.title}</h1>
                      <p>{article.description}</p>
                      <span>Read more...</span>
                      <ul className="tag-list">
                        {article.tagList.map((tag, index) => (
                          <li
                            className="tag-default tag-pill tag-outline"
                            key={index}
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </Link>
                  </div>
                )
              )}
            </div>
            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>

                <div className="tag-list">
                  {tags.map((tag, index) => (
                    <Link
                      to="/"
                      className="tag-pill tag-default"
                      key={index}
                      onClick={(e) => {
                        handleTag(tag);
                      }}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
