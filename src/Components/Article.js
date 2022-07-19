import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authState } from "../features/authState";
import { Link } from "react-router-dom";

function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState(null);
  const auth = useRecoilValue(authState);
  const [follow, setFollow] = useState(false);
  const navigate = useNavigate();
  const [isFavorited, setIsFavorite] = useState(true);

  const [comment, setComment] = useState("");

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `https://api.realworld.io/api/articles/${slug}/comments`,
        {
          comment: {
            body: comment,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Acess-Control-Allow-Origin": "*",
            Authorization: `Bearer ${auth.user.token}`,
            Accept: "application/json",
          },
        }
      );

      console.log(res.data.comment);
      setComments([...comments, res.data.comment]);

      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  const getComments = async () => {
    try {
      const res = await axios.get(
        `https://api.realworld.io/api/articles/${slug}/comments`,

        {
          headers: {
            "Content-Type": "application/json",
            "Acess-Control-Allow-Origin": "*",
            Authorization: `Bearer ${auth.user.token}`,
            Accept: "application/json",
          },
        }
      );
      setComments(res.data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  const getArticle = async () => {
    try {
      const res = await axios.get(
        `https://api.realworld.io/api/articles/${slug}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Acess-Control-Allow-Origin": "*",
            Authorization: `Bearer ${auth.user.token}`,
            Accept: "application/json",
          },
        }
      );
      setArticle(res.data.article);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelComment = async (id) => {
    try {
      const res = await axios.delete(
        `https://api.realworld.io/api/articles/${slug}/comments/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Acess-Control-Allow-Origin": "*",
            Authorization: `Bearer ${auth.user.token}`,
            Accept: "application/json",
          },
        }
      );
      const newArrComments = comments.filter((comment) => comment.id !== id);
      setComments(newArrComments);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelPost = async (article) => {
    try {
      const res = await axios.delete(
        `https://api.realworld.io/api/articles/${article.slug}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Acess-Control-Allow-Origin": "*",
            Authorization: `Bearer ${auth.user.token}`,
            Accept: "application/json",
          },
        }
      );
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollow = async (username) => {
    try {
      const res = await axios.post(
        `https://api.realworld.io/api/profiles/${username}/follow`,
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

  const handleUnFollow = async (username) => {
    try {
      const res = await axios.delete(
        `https://api.realworld.io/api/profiles/${username}/follow`,

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

  useEffect(() => {
    getComments();
    getArticle();
  }, [follow, isFavorited]);

  return (
    article !== null &&
    comments !== null && (
      <div className="article-page">
        <div className="banner">
          <div className="container">
            <h1>{article.title}</h1>
            <div className="article-meta">
              <Link to={`/Profiles/${article.author.username}`}>
                <img src={article.author.image} alt={article.author.username} />
              </Link>
              <div className="info">
                <Link
                  to={`/Profiles/${article.author.username}`}
                  className="author"
                >
                  {article.author.username}
                </Link>
                <time className="date" dateTime={article.createdAt}>
                  {new Date(article.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              {article.author.username !== auth.user.username ? (
                <>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      article.author.following
                        ? handleUnFollow(article.author.username)
                        : handleFollow(article.author.username)
                    }
                  >
                    <i className="ion-plus-round"></i>
                    {article.author.following ? (
                      <>&nbsp; Unfollow {article.author.username}</>
                    ) : (
                      <>&nbsp; Follow {article.author.username}</>
                    )}
                  </button>
                  &nbsp;&nbsp;
                  <button
                    className={`btn btn-sm ${
                      article.favorited ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={(e) =>
                      article.favorited
                        ? handleFavoriteDel(article)
                        : handleFavorite(article)
                    }
                  >
                    {article.favorited ? (
                      <>
                        <i className="ion-heart"></i>
                        &nbsp; Unfavorite Post
                      </>
                    ) : (
                      <>
                        <i className="ion-heart"></i>
                        &nbsp; Favorite Post
                      </>
                    )}

                    <span className="counter"> ({article.favoritesCount})</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={`/Editor/${article.slug}`}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    <i className="ion-edit"></i> &nbsp;Edit Article
                  </Link>
                  &nbsp;&nbsp;
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={(e) => handleDelPost(article)}
                  >
                    <i className="ion-trash-a"></i> &nbsp;Delete Article
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="container page">
          <div className="row article-content">
            <div className="col-md-12">
              <p>{article.body}</p>
            </div>
          </div>
          <ul className="tag-list">
            {article.tagList.map((tag, index) => (
              <li className="tag-default tag-pill tag-outline" key={index}>
                {tag}
              </li>
            ))}
          </ul>

          <hr />

          <div className="article-actions">
            <div className="article-meta">
              <Link to={`/Profiles/${article.author.username}`}>
                <img src={article.author.image} alt="" />
              </Link>
              <div className="info">
                <Link
                  to={`/Profiles/${article.author.username}`}
                  className="author"
                >
                  {article.author.username}
                </Link>
                <time
                  className="date-posted ng-binding"
                  dateTime={comment.createdAt}
                >
                  {new Date(article.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              {article.author.username !== auth.user.username ? (
                <>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      article.author.following
                        ? handleUnFollow(article.author.username)
                        : handleFollow(article.author.username)
                    }
                  >
                    <i className="ion-plus-round"></i>
                    {article.author.following ? (
                      <>&nbsp; Unfollow {article.author.username}</>
                    ) : (
                      <>&nbsp; Follow {article.author.username}</>
                    )}
                  </button>
                  &nbsp;&nbsp;
                  <button
                    className={`btn btn-sm ${
                      article.favorited ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={(e) =>
                      article.favorited
                        ? handleFavoriteDel(article)
                        : handleFavorite(article)
                    }
                  >
                    {article.favorited ? (
                      <>
                        <i className="ion-heart"></i>
                        &nbsp; Unfavorite Post
                      </>
                    ) : (
                      <>
                        <i className="ion-heart"></i>
                        &nbsp; Favorite Post
                      </>
                    )}

                    <span className="counter"> ({article.favoritesCount})</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={`/Editor/${article.slug}`}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    <i className="ion-edit"></i> &nbsp;Edit Article
                  </Link>
                  &nbsp;&nbsp;
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={(e) => handleDelPost(article)}
                  >
                    <i className="ion-trash-a"></i> &nbsp;Delete Article
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-md-8 offset-md-2">
              <form className="card comment-form">
                <div className="card-block">
                  <textarea
                    className="form-control"
                    placeholder="Write a comment..."
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
                <div className="card-footer">
                  <img
                    src={auth.user.image}
                    className="comment-author-img"
                    alt=""
                  />
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleComment}
                  >
                    Post Comment
                  </button>
                </div>
              </form>

              {comments.map((comment, index) => (
                <div className="card" key={index}>
                  <div className="card-block">
                    <p className="card-text">{comment.body}</p>
                  </div>
                  <div className="card-footer">
                    <Link
                      to={`/Profiles/${article.author.username}`}
                      className="comment-author"
                    >
                      <img
                        src={comment.author.image}
                        className="comment-author-img"
                        alt={comment.author.username}
                      />
                    </Link>
                    &nbsp;
                    <Link
                      to={`/Profiles/${article.author.username}`}
                      className="comment-author"
                    >
                      {comment.author.username}
                    </Link>
                    <time
                      className="date-posted ng-binding"
                      dateTime={comment.createdAt}
                    >
                      {new Date(article.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span className="mod-options">
                      {/* <i className="ion-edit" ></i> */}
                      <i
                        className="ion-trash-a"
                        onClick={(e) => handleDelComment(comment.id)}
                      ></i>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default Article;
