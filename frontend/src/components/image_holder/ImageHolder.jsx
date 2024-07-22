import React from "react";
import Image from "react-bootstrap/Image";
import styles from "./ImageHolder.module.css";
import NotFound from "../../assets/images/notfound.webp";

/**
 * ImageHolder component displays an image with optional styles.
 *
 * Props:
 * - src: URL of the image to display.
 * - alt: Alt text for the image.
 * - contain: Boolean to apply 'contain' style default is false, applies 'cover' style.
 * - round: Boolean to apply 'round' style default is false.
 *
 * Features:
 * - Displays an image with 'cover' or 'contain' styles based on the `contain` prop.
 * - Applies a 'round' style to the image if the `round` prop is true.
 * - Falls back to a default "not found" image if the initial image fails to load.
 */
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
