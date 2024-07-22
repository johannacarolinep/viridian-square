import React from "react";
import styles from "./Avatar.module.css";
import NotFound from "../../assets/images/notfound.webp";

/**
 * Avatar component displays a user avatar with optional text.
 *
 * Props:
 * - src: URL of avatar image.
 * - height: Height and width of the avatar image with the default being 45.
 * - text: Optional text to display next to the avatar.
 *
 * Features:
 * - Displays the avatar image at the specified height and width.
 * - Falls back to a default "not found" image if the initial image fails to load.
 *
 * OBS: This component was copied in full (except for the onError attribute) from a walkthrough project provided by Code Institute.
 */
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
