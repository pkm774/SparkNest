import { Helmet } from "react-helmet";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

import Quill from "quill";
import "quill/dist/quill.snow.css";
import hljs from "highlight.js";
import "highlight.js/styles/default.css";
import katex from "katex";
import "katex/dist/katex.min.css";

import PreLoader from "../PreLoader";
import Header from "../Header";
import MoveToEffect from "../effects/MoveToEffect";

import logout from "../tools/auth";
import { setItem, getItem } from "../tools/IndexDBstorage";

import ImageResize from "../tools/ImageResize";
window.katex = katex;

const UpdateArticle = () => {
  const location = useLocation();
  var { UpdateData } = location.state || {};

  const navigate = useNavigate();
  const login = Cookies.get("sessionLogged") || false;
  if (!login) {
    navigate("/session/new");
  }
  const user = Cookies.get("sessionUser") ? JSON.parse(Cookies.get("sessionUser")) : null;
  if (user == null) {
    logout();
  }

  useEffect(() => {
    const originalWarn = console.error;
    console.error = (message, ...args) => {
      if (message.includes("Warning: Cannot update a component")) {
        return;
      }
      originalWarn(message, ...args);
    };
    return () => {
      console.error = originalWarn;
    };
  }, []);

  const [articleTitle, setArticleTitle] = useState("");
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    const toolbarOptions = [
      [
        "bold",
        "italic",
        "underline",
        "strike",
        { color: [] },
        { background: [] },
        { list: "ordered" },
        { list: "bullet" },
        { list: "check" },
        { direction: "rtl" },
        { indent: "-1" },
        { indent: "+1" },
        { align: [] },
      ],
      [{ script: "sub" }, { script: "super" }, "formula"],
      [{ header: 1 }, { header: 2 }, "blockquote", "code-block"],
      ["link", "image", "video"],
      [
        { size: ["small", false, "large", "huge"] },
        { header: [1, 2, 3, 4, 5, 6, false] },
        { font: [] },
      ],
      ["clean"],
    ];

    const quill = new Quill(editorRef.current, {
      modules: {
        syntax: { hljs },
        toolbar: toolbarOptions,
        imageResize: ImageResize,
      },
      theme: "snow",
      placeholder: "Type your Article...",
    });

    quillRef.current = quill;

    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function cleanEditorContent() {
      const unwantedText =
        "<p>PlainBashC++C#CSSDiffHTML/XMLJavaJavaScriptMarkdownPHPPythonRubySQL</p>";
      const escapedText = escapeRegExp(unwantedText);
      const regex = new RegExp(escapedText, "g");
      let editorHtml = quill.root.innerHTML;
      editorHtml = editorHtml.replace(regex, "");
      quill.root.innerHTML = editorHtml;
    }

    cleanEditorContent();

    quill.getModule("toolbar").addHandler("link", function () {
      const href = prompt("Enter the link URL");
      if (href) {
        const fullUrl = /^https?:\/\//i.test(href) ? href : "http://" + href;
        const range = this.quill.getSelection();
        if (range) {
          this.quill.formatText(range.index, range.length, "link", fullUrl);
        }
      }
    });

    quill.on("text-change", () => {
      const content = quillRef.current.root.innerHTML;
      setItem("articleUpdateContent", content);
    });
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      const savedTitle = localStorage.getItem("articleUpdateTitle") || "";
      const savedContent = await getItem("articleUpdateContent");
      if (savedTitle && savedContent) {
        setArticleTitle(savedTitle);
        quillRef.current.root.innerHTML = savedContent;
      } else {
        setArticleTitle(UpdateData.article_title);
        quillRef.current.root.innerHTML = UpdateData.article_body;
      }
    };
    loadContent();
  }, [UpdateData]);

  useEffect(() => {
    localStorage.setItem("articleUpdateTitle", articleTitle);
  }, [articleTitle]);

  const handleSave = async (event) => {
    event.preventDefault();
    const body_text = quillRef.current.root.innerText || "";

    const updatePreview = {
      article_categories: UpdateData.article_categories,
      body_text: body_text,
      article_id: UpdateData.article_id,
      article_preview_id: UpdateData.article_preview_id,
    };

    navigate("/article/update/publish", { state: { data: updatePreview } });
  };

  return (
    <>
      <Helmet>
        <title>Update Article</title>
      </Helmet>
      <PreLoader />
      <div id="page" className="s-pagewrap">
        <Header />
        <section
          id="content"
          className="s-content s-content--page"
          style={{ paddingTop: "100px" }}
        >
          <div className="row">
            <div className="column lg-6 tab-12" style={{ width: "100%" }}>
              <form onSubmit={handleSave}>
                <div className="d-flex flex-row justify-content-between  align-items-center gap-2">
                  <label htmlFor="titleInput"></label>
                  <input
                    className="u-fullwidth create-input-title"
                    type="text"
                    placeholder="Title"
                    id="titleInput"
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                  />
                  <button
                    className="btn--primary create-input-button"
                    type="submit"
                    id="subbmitButton"
                  >
                    Update
                  </button>
                </div>
                <div id="editor" ref={editorRef}></div>
              </form>
            </div>
          </div>
        </section>
      </div>
      <MoveToEffect />
    </>
  );
};

export default UpdateArticle;
