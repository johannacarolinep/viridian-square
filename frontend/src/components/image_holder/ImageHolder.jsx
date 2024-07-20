import React from "react";
import Image from "react-bootstrap/Image";
import styles from "./ImageHolder.module.css";

const ImageHolder = ({ src, alt, contain }) => {
  return (
    <Image
      src={src}
      alt={alt}
      className={contain ? styles.Contain : styles.Cover}
    />
  );
};

export default ImageHolder;
