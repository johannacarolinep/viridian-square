import React from "react";
import { Badge, Button, Image, Row } from "react-bootstrap";
import Avatar from "../avatar/Avatar";
import appStyles from "../../App.module.css";
import styles from "./ArtpieceDetailed.module.css";
import { Link } from "react-router-dom";

const ArtpieceDetailed = (props) => {
  const {
    id,
    owner,
    is_owner,
    profile_id,
    profile_name,
    profile_image,
    title,
    description,
    created_on,
    updated_on,
    image_url,
    art_medium,
    for_sale,
    likes_count,
    hashtags,
    art_collection,
  } = props;
  return (
    <>
      <Row className="mt-5">
        <div className={`col-7 ${styles.ImageContainer}`}>
          <Image
            src={image_url}
            alt={`${title}, artwork by artist ${profile_name}`}
            className={styles.Image}
          />
        </div>
        <div className="col-5 ps-4">
          <div className="d-flex justify-content-between">
            <Link to={`/profiles/${profile_id}`}>
              <Avatar src={profile_image} height={38} />
              {profile_name}
            </Link>
            <div>
              {likes_count}
              <i
                class={`${appStyles.txtAccentDark} fa-regular fa-heart ms-1`}
              ></i>
            </div>
          </div>
          <div className={`my-3 ${appStyles.dividerPrimary}`}></div>
          <div>
            <h1>{title}</h1>
            <div className={`my-3 ${appStyles.dividerPrimary}`}></div>
            {description && (
              <p>
                <span className="fw-bold">Description: </span> {description}
              </p>
            )}
            {art_medium !== "0" && (
              <p>
                <span className="fw-bold">Art medium used: </span>
                {art_medium}
              </p>
            )}
            {hashtags && (
              <p className={`fst-italic ${appStyles.txtAccentDark}`}>
                {hashtags}
              </p>
            )}
            {(for_sale == 1 || art_collection) && (
              <div className="fs-5">
                {art_collection && (
                  <Link>
                    <Badge pill bg="dark">
                      Visit collection
                    </Badge>
                  </Link>
                )}
                {for_sale == 1 && <Button>Make an enquiry</Button>}
              </div>
            )}
            <p>
              <span className="fw-bold">Created: </span>
              {created_on}
              {created_on != updated_on && `(Updated: ${updated_on})`}
            </p>
          </div>
        </div>
      </Row>
    </>
  );
};

export default ArtpieceDetailed;
