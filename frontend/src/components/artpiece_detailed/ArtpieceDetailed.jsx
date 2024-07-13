import React from "react";
import {
  Badge,
  Button,
  Image,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import Avatar from "../avatar/Avatar";
import appStyles from "../../App.module.css";
import styles from "./ArtpieceDetailed.module.css";
import { Link } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { MoreDropdown } from "../moredropdown/MoreDropdown";

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
    like_id,
    hashtags,
    art_collection,
    setArtpiece,
  } = props;

  const currentUser = useCurrentUser();

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/likes/", { liked_piece: id });
      setArtpiece((prevArtpiece) => ({
        ...prevArtpiece,
        likes_count: prevArtpiece.likes_count + 1,
        like_id: data.id,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async () => {
    try {
      const { data } = await axiosRes.delete(`/likes/${like_id}`);
      setArtpiece((prevArtpiece) => ({
        ...prevArtpiece,
        likes_count: prevArtpiece.likes_count - 1,
        like_id: null,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async () => {
    console.log("Clicked edit");
  };

  const handleDelete = async () => {
    console.log("Clicked delete");
  };

  return (
    <>
      <Row className="mt-lg-5">
        <div className={`col-lg-7 position-relative p-0`}>
          <Image
            src={image_url}
            alt={`${title}, artwork by artist ${profile_name}`}
            className={styles.Image}
          />
          <div className="position-absolute top-0 end-0 p-3 fs-5">
            <Badge pill bg="dark">
              {for_sale === 0 && `Not for sale`}
              {for_sale === 1 && `For sale`}
              {for_sale === 2 && `Sold`}
            </Badge>
          </div>
        </div>
        <div className="col-lg-5 mt-3 mt-lg-0 ps-4">
          <div className="d-flex justify-content-between">
            <Link to={`/profiles/${profile_id}`}>
              <Avatar src={profile_image} height={38} />
              {profile_name}
            </Link>
            <div>
              {likes_count}
              {is_owner ? (
                <OverlayTrigger
                  placement="left"
                  overlay={<Tooltip>You can't like your own artpiece</Tooltip>}
                >
                  <i
                    class={`${appStyles.txtAccentDark} fa-regular fa-heart ms-1`}
                  />
                </OverlayTrigger>
              ) : like_id ? (
                <button className={appStyles.IconBtn} onClick={handleUnlike} n>
                  <i
                    class={`${appStyles.txtAccentDark} fa-solid fa-heart ms-1`}
                  />
                </button>
              ) : currentUser ? (
                <button className={appStyles.IconBtn} onClick={handleLike}>
                  <i
                    class={`${appStyles.txtAccentDark} fa-regular fa-heart ms-1`}
                  />
                </button>
              ) : (
                <OverlayTrigger
                  placement="left"
                  overlay={
                    <Tooltip>You need to log in to like artpieces</Tooltip>
                  }
                >
                  <i
                    class={`${appStyles.txtAccentDark} fa-regular fa-heart ms-1`}
                  />
                </OverlayTrigger>
              )}
            </div>
            {is_owner && (
              <div className="d-flex align-items-center">
                <MoreDropdown
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              </div>
            )}
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
            {(for_sale === 1 || art_collection) && (
              <div className="fs-5">
                {art_collection && (
                  <Link>
                    <Badge pill bg="dark">
                      Visit collection
                    </Badge>
                  </Link>
                )}
                {for_sale === 1 && <Button>Make an enquiry</Button>}
              </div>
            )}
            <p>
              <span className="fw-bold">Created: </span>
              {created_on}
              {created_on !== updated_on && `(Updated: ${updated_on})`}
            </p>
          </div>
        </div>
      </Row>
    </>
  );
};

export default ArtpieceDetailed;
