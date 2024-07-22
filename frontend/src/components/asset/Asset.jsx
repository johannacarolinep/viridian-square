import React from "react";
import Spinner from "react-bootstrap/Spinner";
import styles from "./Asset.module.css";

/**
 * Asset component displays a loading spinner, an image, or a message.
 *
 * Props:
 * - spinner: Boolean indicating whether to show a loading spinner.
 * - src: URL of the image to display.
 * - message: Message to display as text.
 *
 * Features:
 * - Conditionally displays a loading spinner if `spinner` is true.
 * - Displays an image if `src` is provided.
 * - Displays a message if `message` is provided.
 *
 * This component was copied in full from Code Institute's walkthrough project.
 */
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
