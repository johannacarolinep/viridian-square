import React from "react";
import { Badge, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "./ArtpieceSimple.module.css";
import Avatar from "../avatar/Avatar";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import appStyles from "../../App.module.css";
import { axiosRes } from "../../api/axiosDefaults";

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
      console.log(err);
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
      console.log(err);
    }
  };

  return (
    <Card className={styles.Card}>
      <Link to={`/artpieces/${id}`}>
        <div className={`${styles.ImgContainer} position-relative`}>
          <Card.Img
            variant="top"
            src={image_url}
            alt={title}
            className={styles.ImgCover}
          />
          {for_sale === 1 ? (
            <div className="position-absolute top-0 end-0 p-1 fs-5">
              <Badge className="ms-1" pill bg="dark">
                For sale
              </Badge>
            </div>
          ) : for_sale === 2 ? (
            <div className="position-absolute top-0 end-0 p-1 fs-5">
              <Badge className="ms-1" pill bg="dark">
                Sold
              </Badge>
            </div>
          ) : (
            ""
          )}
        </div>
      </Link>
      <Card.Body className="px-3 pt-1 pb-2">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 py-1">{title}</h5>
          <div>
            {is_owner ? (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>You can't like your own artpiece</Tooltip>}
              >
                <i
                  class={`${appStyles.txtAccentDark} fa-regular fa-heart p-1`}
                />
              </OverlayTrigger>
            ) : like_id ? (
              <button className={appStyles.IconBtn} onClick={handleUnlike} n>
                <i class={`${appStyles.txtAccentDark} fa-solid fa-heart p-1`} />
              </button>
            ) : currentUser ? (
              <button className={appStyles.IconBtn} onClick={handleLike}>
                <i
                  class={`${appStyles.txtAccentDark} fa-regular fa-heart p-1`}
                />
              </button>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>You need to log in to like artpieces</Tooltip>
                }
              >
                <i
                  class={`${appStyles.txtAccentDark} fa-regular fa-heart p-1`}
                />
              </OverlayTrigger>
            )}
          </div>
        </div>
        <p className="small mb-0">{likes_count} likes</p>

        {!basic && art_medium !== "0" && (
          <Badge className="ms-1" pill bg="dark">
            {art_medium}
          </Badge>
        )}

        {!basic && (
          <div className="text-end">
            <Link to={`/profiles/${profile_id}`}>
              By: {profile_name} | {created_on}
              <Avatar src={profile_image} height={40} />
            </Link>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ArtpieceSimple;
