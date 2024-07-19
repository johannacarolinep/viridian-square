import React from "react";
import NoResults from "../../assets/images/noresults.webp";
import styles from "./NotFound.module.css";
import { Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="d-flex justify-content-center align-items-center">
      <div className={`${styles.NotFound} m-4 p-4`}>
        <div>
          <h1>Sorry, page not found</h1>
          <Link to={navigate(-1)} className="fs-4">
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
