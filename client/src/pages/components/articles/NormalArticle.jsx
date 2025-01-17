import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { fetchArticle, dropArticle } from "../../../api/API";
import { removeItem } from "../tools/IndexDBstorage";

import logout from "../tools/auth";

const NormalArticle = (prop) => {
  const navigate = useNavigate();

  const article_id = prop.articleId;
  const link = `/article/view/${article_id}`;
  const enabledWD = prop.hasAccess && prop.viewedBy == prop.createdBy;

  const editArticle = async () => {
    let data = {};
    const getArticle = async () => {
      try {
        const response = await fetchArticle(article_id);
        data = response.data;
      } catch (error) {
        if (error.response.status === 403) {
         // logout();
        }
      }
    };

    await getArticle();

    localStorage.removeItem("articleUpdateTitle");
    removeItem("articleUpdateContent");
    //localStorage.removeItem("articleTitle");
    //removeItem("articleContent");

    const categoriesArray = data.article_cids.map((id, index) => {
      return { id: id, name: data.article_cnames[index] };
    });

    const articleData = {
      article_title: data.article_title,
      article_body: data.article_body,
      article_categories: categoriesArray,
      article_id: data.article_id,
      article_preview_id: prop.articlePreviewId,
    };

    navigate("/article/edit", { state: { UpdateData: articleData } });
  };

  const [show, setShow] = useState(false);

  const deleteArticle = async () => {
    const doDeleteArticle = async () => {
      try {
        const response = await dropArticle(article_id);
        if (response.state == 200) {
          alert("Article deleted successfully");
        }
        prop.setArticles(
          prop.articles.filter((article) => article.article_id !== article_id)
        );
      } catch (error) {
        if (error.response.status === 403) {
          logout();
        } else {
          console.log(error);
        }
      }
    };
    doDeleteArticle();
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleDelete = async () => {
    setShow(false);
    await deleteArticle();
  };

  return (
    <>
      <article className="brick entry" data-animate-el style={{}}>
        <div className="entry__thumb">
          <a href={link} className="thumb-link">
            <img
              src={prop.previewImage[0]}
              srcSet={`${prop.previewImage[0]} 1x, ${prop.previewImage[1]} 2x`}
              alt="Article preview"
            />
          </a>
        </div>

        <div className="entry__text">
          <div className="entry__header">
            <div className="entry__meta">
              <span className="cat-links">
                <a href={`/category/${prop.categories[0]}`}>
                  {prop.categories[0]}
                </a>
              </span>
              <span className="byline">
                By:
                <a href="#0">{prop.previewBy}</a>
              </span>
            </div>
            <h1 className="entry__title">
              <a href={link}>{prop.previewTitle}</a>
            </h1>
          </div>
          <div className="entry__excerpt">
            <p>{prop.previewSubtitle}</p>
          </div>
          <div className="lower-tool-div-preview">
            <a href={link} className="entry__more-link">
              Read More
            </a>
            {enabledWD && (
              <div className="lower-tool-div-preview-tools">
                <span
                  className="entry__more-link"
                  onClick={editArticle}
                  style={{ cursor: "pointer" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="18"
                    height="18"
                    viewBox="0 0 50 50"
                  >
                    <path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"></path>
                  </svg>
                </span>
                <span
                  className="entry__more-link"
                  onClick={handleShow}
                  style={{ cursor: "pointer" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                  >
                    <path d="M 20.5 4 A 1.50015 1.50015 0 0 0 19.066406 6 L 14.640625 6 C 12.803372 6 11.082924 6.9194511 10.064453 8.4492188 L 7.6972656 12 L 7.5 12 A 1.50015 1.50015 0 1 0 7.5 15 L 8.2636719 15 A 1.50015 1.50015 0 0 0 8.6523438 15.007812 L 11.125 38.085938 C 11.423352 40.868277 13.795836 43 16.59375 43 L 31.404297 43 C 34.202211 43 36.574695 40.868277 36.873047 38.085938 L 39.347656 15.007812 A 1.50015 1.50015 0 0 0 39.728516 15 L 40.5 15 A 1.50015 1.50015 0 1 0 40.5 12 L 40.302734 12 L 37.935547 8.4492188 C 36.916254 6.9202798 35.196001 6 33.359375 6 L 28.933594 6 A 1.50015 1.50015 0 0 0 27.5 4 L 20.5 4 z M 14.640625 9 L 33.359375 9 C 34.196749 9 34.974746 9.4162203 35.439453 10.113281 L 36.697266 12 L 11.302734 12 L 12.560547 10.113281 A 1.50015 1.50015 0 0 0 12.5625 10.111328 C 13.025982 9.4151428 13.801878 9 14.640625 9 z M 11.669922 15 L 36.330078 15 L 33.890625 37.765625 C 33.752977 39.049286 32.694383 40 31.404297 40 L 16.59375 40 C 15.303664 40 14.247023 39.049286 14.109375 37.765625 L 11.669922 15 z"></path>
                  </svg>
                </span>
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Delete Article</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>Are you sure to delete ?</Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      No
                    </Button>
                    <Button variant="primary" onClick={handleDelete}>
                      Yes
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            )}
          </div>
        </div>
      </article>
    </>
  );
};

export default NormalArticle;
