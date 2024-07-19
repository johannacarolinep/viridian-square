import React from "react";
import NoResults from "../../assets/images/noresults.webp";
import styles from "./NotFound.module.css";
import Image from "react-bootstrap/Image";
import { Link, useNavigate } from "react-router-dom";
import appStyles from "../../App.module.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="d-flex justify-content-center align-items-center">
      <div className={`${styles.NotFound} m-4 p-4`}>
        <div>
          <h1>Sorry, page not found</h1>
          <Link to={navigate(-1)} className={`fs-4 ${appStyles.LinkStandard}`}>
            &laquo; Take me back!
          </Link>
        </div>
        <div className={styles.ImgContainer}>
          <Image src={NoResults} />
        </div>
      </div>
    </main>
  );
};

export default NotFound;
