import React from "react";
import Spinner from "react-bootstrap/Spinner";
import styles from "./Asset.module.css";

const Asset = ({ spinner, src, message }) => {
  return (
    <div className={`${styles.Asset} p-4`}>
      {spinner && <Spinner animation="border" />}
      {src && <img src={src} alt={message} />}
      {message && <p className="fs-4 fw-bold">{message}</p>}
    </div>
  );
};

export default Asset;
