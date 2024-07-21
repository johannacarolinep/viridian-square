import React from "react";
import styles from "./Avatar.module.css";
import NotFound from "../../assets/images/notfound.webp";

const Avatar = ({ src, height = 45, text }) => {
  return (
    <span>
      <img
        className={styles.Avatar}
        src={src}
        height={height}
        width={height}
        alt="avatar"
        onError={(e) => {
          e.target.src = NotFound;
        }}
      />
      {text}
    </span>
  );
};

export default Avatar;
