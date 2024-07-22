import React, { useState } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Row from "react-bootstrap/Row";
import Tooltip from "react-bootstrap/Tooltip";
import Form from "react-bootstrap/Form";
import Avatar from "../avatar/Avatar";
import appStyles from "../../App.module.css";
import styles from "./ArtpieceDetailed.module.css";
import { Link, useNavigate } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { MoreDropdown } from "../moredropdown/MoreDropdown";
import ImageHolder from "../image_holder/ImageHolder";

/**
 * ArtpieceDetailed component displays detailed information about an art piece.
 *
 * Props:
 * - id, is_owner, profile_id, profile_name, profile_image, title, description,
 *   created_on, updated_on, image_url, art_medium, for_sale, likes_count,
 *   like_id, hashtags, art_collection, setArtpiece
 *
 * Features:
 * - Displays art piece image, title, description, and other details.
 * - Allows owners to edit or delete the art piece.
 * - Enables users to like/unlike the art piece.
 * - Permits users to make enquiries if the art piece is for sale.
 *
 * State:
 * - showDelete: Controls the visibility of the delete confirmation modal.
 * - showEnquiry: Controls the visibility of the enquiry modal.
 * - errors: Stores any form submission errors.
 * - initialMessage: Stores the initial enquiry message.
 * - showEnquiryConfirm: Controls the visibility of the enquiry confirmation message.
 */
const ArtpieceDetailed = (props) => {
  const {
    id,
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
  const navigate = useNavigate();

  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [errors, setErrors] = useState({});
  const handleCloseEnquiry = () => setShowEnquiry(false);
  const handleShowEnquiry = () => setShowEnquiry(true);
  const [initialMessage, setInitialMessage] = useState("");
  const [showEnquiryConfirm, setShowEnquiryConfirm] = useState(false);

  const handleSubmitEnquiry = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("initial_message", initialMessage);
    formData.append("artpiece", id);

    try {
      await axiosReq.post("/enquiries/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setShowEnquiryConfirm(true);
      handleCloseEnquiry();
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/likes/", { liked_piece: id });
      setArtpiece((prevArtpiece) => ({
        ...prevArtpiece,
        likes_count: prevArtpiece.likes_count + 1,
        like_id: data.id,
      }));
    } catch (err) {
      // console.log(err);
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}`);
      setArtpiece((prevArtpiece) => ({
        ...prevArtpiece,
        likes_count: prevArtpiece.likes_count - 1,
        like_id: null,
      }));
    } catch (err) {
      // console.log(err);
    }
  };

  const handleEdit = () => {
    navigate(`/artpieces/${id}/edit`);
  };

  const handleDeleteConfirm = () => {
    setShowDelete(true);
  };

  const handleDelete = async () => {
    setShowDelete(false);
    try {
      await axiosRes.delete(`/artpieces/${id}/`);
      navigate("/");
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <>
      <Row className="my-lg-5">
        <div className={"col-lg-7 position-relative p-0"}>
          <div className={styles.ImgContainer}>
            <ImageHolder
              contain
              src={image_url}
              alt={`${title}, artwork by artist ${profile_name}`}
            />
          </div>
        </div>
        <div className="col-lg-5 mt-3 mt-lg-0 ps-4">
          <div className="d-flex justify-content-between align-items-center">
            <Link
              to={`/profiles/${profile_id}`}
              className={appStyles.LinkStandard}
              aria-label={`Go to ${profile_name}'s profile page`}
            >
              <Avatar src={profile_image} height={38} />
              {profile_name}
            </Link>

            {is_owner && (
              <div className="d-flex align-items-center">
                <MoreDropdown
                  artpiece
                  handleEdit={handleEdit}
                  handleDeleteConfirm={handleDeleteConfirm}
                />
              </div>
            )}
          </div>
          <div className={`my-3 ${appStyles.dividerPrimary}`}></div>
          <div>
            <h1>{title}</h1>
            <div className={`my-3 ${appStyles.dividerPrimary}`}></div>
            <div className="my-3">
              {is_owner ? (
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip>You can&apos;t like your own artpiece</Tooltip>
                  }
                >
                  <button
                    className={`${appStyles.IconBtn} ps-0`}
                    aria-label="Like button, not active since you can't like your own artpiece"
                  >
                    <i
                      className={`${appStyles.txtAccentDark} fa-regular fa-heart ps-0`}
                    />
                  </button>
                </OverlayTrigger>
              ) : like_id ? (
                <button
                  className={`${appStyles.IconBtn} ps-0`}
                  onClick={handleUnlike}
                  aria-label="Remove like"
                >
                  <i
                    className={`${appStyles.txtAccentDark} fa-solid fa-heart ps-0`}
                  />
                </button>
              ) : currentUser ? (
                <button
                  className={`${appStyles.IconBtn} ps-0`}
                  onClick={handleLike}
                  aria-label="Like this artpiece"
                >
                  <i
                    className={`${appStyles.txtAccentDark} fa-regular fa-heart ps-0`}
                  />
                </button>
              ) : (
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip>You need to log in to like artpieces</Tooltip>
                  }
                >
                  <button
                    className={`${appStyles.IconBtn} ps-0`}
                    aria-label="Inactive like-button. You need to log in first."
                  >
                    <i
                      className={`${appStyles.txtAccentDark} fa-regular fa-heart ps-0`}
                    />
                  </button>
                </OverlayTrigger>
              )}
              {likes_count} {likes_count === 1 ? <>like</> : <>likes</>}
            </div>
            {description && (
              <p>
                <span className="fw-bold">Description: </span> {description}
              </p>
            )}
            {art_medium !== "noselection" && (
              <p>
                <span className="fw-bold">Art medium used: </span>
                {art_medium}
              </p>
            )}

            <div className="ps-0 my-1 mb-2 fs-5">
              <Badge pill bg="dark">
                {for_sale === 0 && "Not for sale"}
                {for_sale === 1 && "For sale"}
                {for_sale === 2 && "Sold"}
              </Badge>
            </div>
            {hashtags && (
              <p className={`fst-italic ${appStyles.txtAccentDark}`}>
                {hashtags}
              </p>
            )}
            {(for_sale === 1 || art_collection) && (
              <div className="fs-5">
                {art_collection && (
                  <Link
                    className="me-2"
                    to={`/profiles/${profile_id}?collectionId=${art_collection}`}
                    aria-label="Visit the collection the artpiece is part of, on the artists profile page"
                  >
                    <Badge pill bg="dark">
                      Visit collection
                    </Badge>
                  </Link>
                )}
                {for_sale === 1 && is_owner ? (
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        You cannot enquire about your own artpiece
                      </Tooltip>
                    }
                  >
                    <Button
                      className={`${appStyles.btnPrimary} me-2`}
                      aria-label="Make an enquiry. Inactive since you can't enquire about your own artpiece."
                    >
                      Make an enquiry
                    </Button>
                  </OverlayTrigger>
                ) : for_sale === 1 && currentUser ? (
                  <Button
                    className={`${appStyles.btnPrimary} me-2`}
                    onClick={handleShowEnquiry}
                    aria-label="Make an enquiry."
                  >
                    Make an enquiry
                  </Button>
                ) : (
                  for_sale === 1 && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Log in to make enquiries</Tooltip>}
                    >
                      <Button
                        className={`${appStyles.btnPrimary} me-2`}
                        aria-label="Make an enquiry. Inactive since you need to log in first."
                      >
                        Make an enquiry
                      </Button>
                    </OverlayTrigger>
                  )
                )}
                {showEnquiryConfirm && (
                  <div className="d-inline-block">
                    <span
                      className={`${appStyles.txtPrimary} fs-6 fw-semibold`}
                    >
                      Your enquiry was sent!
                    </span>
                  </div>
                )}
              </div>
            )}
            <p className="mt-4">
              <span className="fw-bold">Created: </span>
              {created_on}
              {created_on !== updated_on && (
                <>
                  <br />
                  <span className="fst-italic">(Updated: ${updated_on})</span>
                </>
              )}
            </p>
          </div>
        </div>
      </Row>
      <Modal show={showDelete} onHide={handleCloseDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1 className="fs-3 mb-0">Confirm deletion</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete the artpiece?
            <br />
            The artpiece will be permanently removed.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseDelete}
            aria-label="Cancel deletion of artpiece"
          >
            Cancel
          </Button>
          <Button
            variant="dark"
            onClick={handleDelete}
            aria-label="Confirm deletion of artpiece"
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEnquiry} onHide={handleCloseEnquiry} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1 className="fs-3 mb-0">Enquire about this artpiece</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            If the artist approves your enquiry, their contact details will be
            shared with you.
          </p>
          <p className="small">
            Please note, approval of enquiries are by not to be seen as a
            contract.
          </p>
          <Form onSubmit={handleSubmitEnquiry}>
            <Form.Group controlId="formInitialMsg" className="mb-3">
              <Form.Label>Your message to the artist:</Form.Label>
              <Form.Control
                name="initial_message"
                placeholder="Write your message here"
                value={initialMessage}
                onChange={(e) => setInitialMessage(e.target.value)}
              />
              {errors.initial_message?.map((message, idx) => (
                <p key={idx}>{message}</p>
              ))}
            </Form.Group>
            {errors.non_field_errors?.map((message, idx) => (
              <p key={idx}>{message}</p>
            ))}
            <div className={"d-flex justify-content-end"}>
              <Button
                variant="secondary"
                onClick={handleCloseEnquiry}
                className="me-2"
                aria-label="Close"
              >
                Close
              </Button>
              <Button
                variant="primary"
                type="submit"
                className={appStyles.btnPrimary}
                aria-label="Send enquiry"
              >
                Send
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ArtpieceDetailed;
