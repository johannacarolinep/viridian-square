import React from "react";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Avatar from "../avatar/Avatar";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";
import appStyles from "../../App.module.css";
import styles from "./ArtpieceSimple.module.css";

const ArtpieceSimple = (props) => {
  const {
    id,
    is_owner,
    profile_id,
    profile_name,
    profile_image,
    title,
    image_url,
    art_medium,
    for_sale,
    like_id,
    likes_count,
    setArtpieces,
    basic,
  } = props;

  const currentUser = useCurrentUser();

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/likes/", { liked_piece: id });
      setArtpieces((prevArtpieces) => ({
        ...prevArtpieces,
        results: prevArtpieces.results.map((artpiece) => {
          return artpiece.id === id
            ? {
              ...artpiece,
              likes_count: artpiece.likes_count + 1,
              like_id: data.id,
            }
            : artpiece;
        }),
      }));
    } catch (err) {
      // console.log(err);
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}`);
      setArtpieces((prevArtpieces) => ({
        ...prevArtpieces,
        results: prevArtpieces.results.map((artpiece) => {
          return artpiece.id === id
            ? {
              ...artpiece,
              likes_count: artpiece.likes_count - 1,
              like_id: null,
            }
            : artpiece;
        }),
      }));
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <Card className={styles.Card}>
      <Link to={`/artpieces/${id}`}>
        <div className={`${styles.ImgContainer} position-relative p-2`}>
          <Card.Img variant="top" src={image_url} alt={title} />
          {for_sale === 1 ? (
            <div className="position-absolute top-0 end-0 p-3 pt-2 fs-5">
              <Badge className="ms-1" pill bg="dark">
                For sale
              </Badge>
            </div>
          ) : for_sale === 2 ? (
            <div className="position-absolute top-0 end-0 p-3 pt-2 fs-5">
              <Badge className="ms-1" pill bg="dark">
                Sold
              </Badge>
            </div>
          ) : (
            ""
          )}
        </div>
      </Link>
      <Card.Body className="px-2 pt-1 pb-2 px-md-3 pb-md-3">
        <div className="d-flex justify-content-between align-items-start">
          <Link
            to={`/artpieces/${id}`}
            className={appStyles.LinkStandard}
            aria-label={`Go to detailed page for artpiece ${title}`}
          >
            <h5 className="mb-0 py-1">{title}</h5>
          </Link>
          <div className="d-flex">
            {is_owner ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>You can&apos;t like your own artpiece</Tooltip>
                }
              >
                <button
                  className={`p-0 ${appStyles.IconBtn}`}
                  aria-label="Inactive like-button. You can't like your own artpiece."
                >
                  <i
                    className={`${appStyles.txtAccentDark} fa-regular fa-heart p-1`}
                  />
                </button>
              </OverlayTrigger>
            ) : like_id ? (
              <button
                className={`p-0 ${appStyles.IconBtn}`}
                onClick={handleUnlike}
                aria-label="Remove like"
              >
                <i
                  className={`${appStyles.txtAccentDark} fa-solid fa-heart p-1`}
                />
              </button>
            ) : currentUser ? (
              <button
                className={`p-0 ${appStyles.IconBtn}`}
                onClick={handleLike}
                aria-label="Like artpiece"
              >
                <i
                  className={`${appStyles.txtAccentDark} fa-regular fa-heart p-1`}
                />
              </button>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>You need to log in to like artpieces</Tooltip>
                }
              >
                <button
                  className={`p-0 ${appStyles.IconBtn}`}
                  aria-label="Inactive like-button. You need to log in first."
                >
                  <i
                    className={`${appStyles.txtAccentDark} fa-regular fa-heart p-1`}
                  />
                </button>
              </OverlayTrigger>
            )}
          </div>
        </div>
        <div className="d-flex">
          <span className="small mb-0">{likes_count} likes</span>
          {!basic && art_medium !== "noselection" && (
            <Badge className="ms-2" pill bg="dark">
              {art_medium}
            </Badge>
          )}
        </div>
      </Card.Body>
      {!basic && (
        <Card.Footer className={`text-end px-2 ${styles.CardFooter}`}>
          <Link
            to={`/profiles/${profile_id}`}
            aria-label={`Go to profile page of artist ${profile_name}`}
          >
            <span className={`me-2 ${appStyles.LinkStandard}`}>
              {profile_name}
            </span>
            <Avatar src={profile_image} height={35} />
          </Link>
        </Card.Footer>
      )}
    </Card>
  );
};

export default ArtpieceSimple;
