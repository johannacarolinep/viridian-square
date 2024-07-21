import React from "react";
import Image from "react-bootstrap/Image";
import styles from "./ImageHolder.module.css";
import NotFound from "../../assets/images/notfound.webp";

const ImageHolder = ({ src, alt, contain, round }) => {
  const className = `${contain ? styles.Contain : styles.Cover} ${
    round ? styles.Round : ""
  }`;

  return (
    <Image
      src={src}
      alt={alt}
      onError={(e) => {
        e.target.src = NotFound;
      }}
      className={className}
    />
  );
};

export default ImageHolder;
