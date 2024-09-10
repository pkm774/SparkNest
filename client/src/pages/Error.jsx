import { Helmet } from "react-helmet";

import PreLoader from "./components/PreLoader";

const Error = () => {
  return (
    <div>
      <Helmet>
        <title>404 : BloggingVerse</title>
      </Helmet>
      <PreLoader />
      <div id="page" className="s-pagewrap">
        <section id="content" className="s-content s-content--page">
          <div className="error-page d-flex flex-column align-items-center">
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Error;