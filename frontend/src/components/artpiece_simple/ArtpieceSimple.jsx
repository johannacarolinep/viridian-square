import React from "react";
import { Badge, Card } from "react-bootstrap";
import styles from "./ArtpieceSimple.module.css";
import Avatar from "../avatar/Avatar";

const ArtpieceSimple = (props) => {
  const {
    id,
    owner,
    is_owner,
    profile_id,
    profile_name,
    profile_image,
    title,
    created_on,
    image_url,
    art_medium,
    for_sale,
  } = props;

  return (
    <Card className={styles.Card}>
      <div className={styles.ImgContainer}>
        <Card.Img
          variant="top"
          src={image_url}
          alt={title}
          className={styles.ImgCover}
        />
      </div>
      <Card.Body>
        <Card.Title>
          <span className="fw-bold">{title}</span>{" "}
          {art_medium != 0 ? (
            <Badge className="ms-1" pill bg="dark">
              {art_medium}
            </Badge>
          ) : (
            ""
          )}{" "}
          {for_sale === 1 ? (
            <Badge className="ms-1" pill bg="dark">
              For sale
            </Badge>
          ) : (
            ""
          )}
        </Card.Title>
        <div className="text-end">
          By: {profile_name} | {created_on}
          <Avatar src={profile_image} height={40} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default ArtpieceSimple;
