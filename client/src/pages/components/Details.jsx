import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";

import { checkUserName } from "../../API";
import { updateDetails } from "../../API";
import logout from './auth';

import PreLoader from "./PreLoader";
import Header from "./Header";
import ErrorMessage from "./messageBox/ErrorMessage";

const Details = () => {
  const navigate = useNavigate();
  const setProfile = Cookies.get("setProfile") ? Cookies.get("setProfile") : null;

  useEffect(() => {
    if (setProfile == null) {
      navigate("/session/new");
    }
  }, [navigate, setProfile]);

  var user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : {};
  const days = Cookies.get("sessiondays") ? Number(Cookies.get("user")) : null;
  const [userData, setUserData] = useState({
    id: user.id ? user.id : "",
    username: "",
    region: "",
  });
  const [unameExists, setUnameExists] = useState(false);
  const [errorMssg, SetErrorMssg] = useState("");

  const handleFocus = (e) => {
    e.target.removeAttribute("readonly");
  };

  function handleUserData(event) {
    setUserData((preVal) => {
      return {
        ...preVal,
        [event.target.name]: event.target.value,
      };
    });
    setUnameExists(false);
  }

  const handleBlur = async () => {
    if (userData.username) {
      const exists = await checkUserName(userData.username);
      if (exists.data.message) {
        setUnameExists(true);
        SetErrorMssg(exists.data.message);
      } else {
        setUnameExists(false);
      }
    } else {
      console.log("Username is empty");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (unameExists) {
      return;
    }

    try {
      const response = await updateDetails(userData);
      if (response.status == 200) {
        user.username = userData.username;
        user.region = userData.region;
        Cookies.set("user", JSON.stringify(user), { expires: days });
        Cookies.remove("setProfile");
        alert("User details update Successful");
        window.location.href = "/profile";
      } else {
        alert("Something went wrong !");
        window.location.href = "/";
      }
    } catch (error) {
      if (
        error.response.status == 403 || //Not Authenticated
        error.response.status == 404 || //User not found
        error.response.status == 500 //Server error
      ) {
        logout();
      }
      console.error("There was an error during Signup!", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Details : SparkNest</title>
      </Helmet>
      <PreLoader />
      <div id="page" className="s-pagewrap">
        <Header />
        <section
          id="content"
          className="s-content"
          style={{ paddingTop: "130px" }}
        >
          <div className="row d-flex justify-content-center mb-lg-5">
            <div
              className="column lg-6 tab-12"
              style={{ paddingBottom: "50px" }}
            >
              <form onSubmit={handleSubmit}>
                <div className="form-outline mb-4">
                  <label htmlFor="userName" style={{ marginBottom: "8px" }}>
                    Enter Username
                  </label>
                  <input
                    className="u-fullwidth"
                    type="text"
                    id="userName"
                    name="username"
                    placeholder="userName"
                    required
                    value={userData.username}
                    onChange={handleUserData}
                    onBlur={handleBlur}
                    readOnly
                    onFocus={handleFocus}
                  />
                </div>
                <ErrorMessage isError={unameExists} errorMssg={errorMssg} />
                <div className="form-outline mb-4">
                  <label htmlFor="inputRegion" style={{ marginBottom: "8px" }}>
                    Enter Region
                  </label>
                  <input
                    className="u-fullwidth"
                    type="text"
                    id="inputRegion"
                    name="region"
                    placeholder="City, Country"
                    required
                    value={userData.region}
                    onChange={handleUserData}
                    onBlur={handleBlur}
                    readOnly
                    onFocus={handleFocus}
                  />
                </div>
                <button type="submit" className="btn--primary u-fullwidth mb-5">
                  Set Details
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Details;