import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authState } from "../features/authState";
import { userState } from "../features/userState";
import { Link } from "react-router-dom";

function Profile() {
  const { slug } = useParams();
  const [author, setAuthor] = useState(null);
  const auth = useRecoilValue(authState);
  const [articles, setArticles] = useState([]);
  const [isFavorited, setIsFavorite] = useState(false);
  const [follow, setFollow] = useState(false);
  const [articlesGB, setArticlesGB] = useState([]);
  const [isFavoriteArt, setIsFavoriteArt] = useState(false);

  const getArticlesGB = async () => {
    try {
      const res = await axios.get("https://api.realworld.io/api/articles", {
        headers: {
          "Content-Type": "application/json",
          "Acess-Control-Allow-Origin": "*",
          Authorization: `Bearer ${auth.user.token}`,
          Accept: "application/json",
        },
      });
      const newArt = res.data.articles.filter((art) => art.favorited === true);
      setArticlesGB(newArt);
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      const res = await axios.get(
        `https://api.realworld.io/api/profiles/${slug}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Acess-Control-Allow-Origin": "*",
            Authorization: `Bearer ${auth.user.token}`,
            Accept: "application/json",
          },
        }
      );
      setAuthor(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getArticles = async () => {
    try {
      const res = await axios.get(
        `https://api.realworld.io/api/articles?author=${slug}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Acess-Control-Allow-Origin": "*",
            Authorization: `Bearer ${auth.user.token}`,
            Accept: "application/json",
          },
        }
      );
      console.log(res.data.articles);
      setArticles(res.data.articles);
      const newArt = res.data.articles.filter((art) => art.favorited === true);
      console.log(newArt);
      setArticlesGB(res.data.articles.filter((art) => art.favorited === true));
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

  const handleFollow = async (e) => {
    try {
      const res = await axios.post(
        `https://api.realworld.io/api/profiles/${slug}/follow`,
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
      setFollow(!follow);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnFollow = async () => {
    try {
      const res = await axios.delete(
        `https://api.realworld.io/api/profiles/${slug}/follow`,

        {
          headers: {
            "Content-Type": "application/json",
            "Acess-Control-Allow-Origin": "*",
            Authorization: `Token ${auth.user.token}`,
            Accept: "application/json",
          },
        }
      );
      setFollow(!follow);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser();
    getArticles();
    getArticlesGB();
  }, [isFavorited, auth, follow]);

  return (
    <>
      <div className="profile-page">
        {author !== null && (
          <div>
            <div className="user-info">
              <div className="container">
                <div className="row">
                  <div className="col-xs-12 col-md-10 offset-md-1">
                    <img
                      src={author.profile.image}
                      className="user-img"
                      alt={author.profile.username}
                    />
                    <h4>{author.profile.username}</h4>

                    {author.profile.username !== auth.user.username ? (
                      <>
                        <button
                          className="btn btn-sm btn-outline-secondary action-btn"
                          onClick={() =>
                            author.profile.following
                              ? handleUnFollow()
                              : handleFollow()
                          }
                        >
                          <i className="ion-plus-round">
                            {author.profile.following ? (
                              <>&nbsp; Unfollow {author.profile.username}</>
                            ) : (
                              <>&nbsp; Follow {author.profile.username}</>
                            )}
                          </i>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/Setting"
                          className="btn btn-sm btn-outline-secondary action-btn"
                        >
                          <i className="ion-gear-a"></i> Edit Profile Settings
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-md-10 offset-md-1">
                  <div className="articles-toggle">
                    <ul className="nav nav-pills outline-active">
                      <li className="nav-item">
                        <Link
                          to={`/Profiles/${author.profile.username}`}
                          className={`nav-link ${
                            isFavoriteArt ? "" : "active"
                          }`}
                          onClick={(e) => setIsFavoriteArt(false)}
                        >
                          My Articles
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          to={`/Profiles/${author.profile.username}`}
                          className={`nav-link ${
                            isFavoriteArt ? "active" : ""
                          }`}
                          onClick={(e) => setIsFavoriteArt(true)}
                        >
                          Favorited Articles
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {(isFavoriteArt ? articlesGB : articles).map(
                    (article, index) => (
                      <div className="article-preview" key={index}>
                        <div className="article-meta">
                          <a href="">
                            <img src={article.author.image} />
                          </a>
                          <div className="info">
                            <a href="" className="author">
                              {article.author.username}
                            </a>
                            <time className="date" dateTime={article.createdAt}>
                              {new Date(article.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
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
                            <i className="ion-heart"></i>{" "}
                            {article.favoritesCount}
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
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
