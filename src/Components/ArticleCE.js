import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authState } from "../features/authState";

function ArticleCE({ isEditorScreen }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const { slug } = useParams();
  const auth = useRecoilValue(authState);
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);

  const addNewArticle = async () => {
    try {
      const res = await axios.post(
        "https://api.realworld.io/api/articles",
        {
          article: {
            title: title,
            description: description,
            body: body,
            tagList: tags,
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
      console.log(res.data);

      navigate(`/article/${res.data.article.slug}`);
    } catch (error) {
      console.log(error);
    }
  };

  const addTag = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);

        setTag("");
      }
    }
  };

  const handleDelTag = (e, index) => {
    const newListTags = tags.filter((tag) => tag !== tags[index]);
    setTags(newListTags);
  };

  const getArticle = async () => {
    try {
      const res = await axios.get(
        `https://api.realworld.io/api/articles/${slug}`
      );
      setArticle(res.data.article);
      if (isEditorScreen) {
        setTitle(res.data.article.title);
        setBody(res.data.article.body);
        setDescription(res.data.article.description);
        setTags(res.data.article.tagList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateArticle = async () => {
    try {
      const res = await axios.put(
        `https://api.realworld.io/api/articles/${slug}`,
        {
          article: {
            title: title,
            description: description,
            body: body,
            tagList: tags,
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
      console.log(res.data);
      navigate(`/article/${res.data.article.slug}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isEditorScreen) {
      getArticle();
    }
  }, []);

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <form>
              <fieldset>
                {isEditorScreen ? (
                  <>
                    {article !== null && (
                      <>
                        <fieldset className="form-group">
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Article Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </fieldset>
                        <fieldset className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="What's this article about?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </fieldset>
                        <fieldset className="form-group">
                          <textarea
                            className="form-control"
                            rows="8"
                            placeholder="Write your article (in markdown)"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                          ></textarea>
                        </fieldset>
                        <fieldset className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter tags"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            onKeyUp={addTag}
                          />
                          <div className="tag-list">
                            {tags.map((tag, index) => (
                              <span
                                className="tag-default tag-pill ng-binding ng-scope"
                                key={index}
                              >
                                <i
                                  className="ion-close-round"
                                  onClick={(e) => handleDelTag(e, index)}
                                ></i>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </fieldset>
                        <button
                          className="btn btn-lg pull-xs-right btn-primary"
                          type="button"
                          onClick={updateArticle}
                        >
                          Publish Article
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <fieldset className="form-group">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Article Title"
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </fieldset>
                    <fieldset className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="What's this article about?"
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </fieldset>
                    <fieldset className="form-group">
                      <textarea
                        className="form-control"
                        rows="8"
                        placeholder="Write your article (in markdown)"
                        onChange={(e) => setBody(e.target.value)}
                      ></textarea>
                    </fieldset>
                    <fieldset className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter tags"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        onKeyUp={addTag}
                      />
                      <div className="tag-list">
                        {tags.map((tag, index) => (
                          <span
                            className="tag-default tag-pill ng-binding ng-scope"
                            key={index}
                          >
                            <i
                              className="ion-close-round"
                              onClick={(e) => handleDelTag(e, index)}
                            ></i>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </fieldset>
                    <button
                      className="btn btn-lg pull-xs-right btn-primary"
                      type="button"
                      onClick={addNewArticle}
                    >
                      Publish Article
                    </button>
                  </>
                )}
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleCE;
