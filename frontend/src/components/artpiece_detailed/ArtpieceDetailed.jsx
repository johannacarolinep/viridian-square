import React, { useState } from "react";
import {
  Badge,
  Button,
  Image,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip,
  Form,
} from "react-bootstrap";
import Avatar from "../avatar/Avatar";
import appStyles from "../../App.module.css";
import styles from "./ArtpieceDetailed.module.css";
import { Link, useNavigate } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
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
  const navigate = useNavigate();

  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [errors, setErrors] = useState({});
  const handleCloseEnquiry = () => setShowEnquiry(false);
  const handleShowEnquiry = () => setShowEnquiry(true);
  const [initialMessage, setInitialMessage] = useState("");

  const handleSubmitEnquiry = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("initial_message", initialMessage);
    formData.append("artpiece", id);

    try {
      const response = await axiosReq.post("/enquiries/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Enquiry submitted successfully:", response.data);
      handleCloseEnquiry();
    } catch (err) {
      console.log(err);
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
      console.log(err);
    }
  };

  return (
    <>
      <Row className="my-lg-5">
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
          <div className="d-flex justify-content-between align-items-center">
            <Link
              to={`/profiles/${profile_id}`}
              className={appStyles.LinkStandard}
            >
              <Avatar src={profile_image} height={38} />
              {profile_name}
            </Link>

            {is_owner && (
              <div className="d-flex align-items-center">
                <MoreDropdown
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
                  overlay={<Tooltip>You can't like your own artpiece</Tooltip>}
                >
                  <button className={`${appStyles.IconBtn} ps-0`}>
                    <i
                      class={`${appStyles.txtAccentDark} fa-regular fa-heart ps-0`}
                    />
                  </button>
                </OverlayTrigger>
              ) : like_id ? (
                <button
                  className={`${appStyles.IconBtn} ps-0`}
                  onClick={handleUnlike}
                  n
                >
                  <i
                    class={`${appStyles.txtAccentDark} fa-solid fa-heart ps-0`}
                  />
                </button>
              ) : currentUser ? (
                <button
                  className={`${appStyles.IconBtn} ps-0`}
                  onClick={handleLike}
                >
                  <i
                    class={`${appStyles.txtAccentDark} fa-regular fa-heart ps-0`}
                  />
                </button>
              ) : (
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip>You need to log in to like artpieces</Tooltip>
                  }
                >
                  <button className={`${appStyles.IconBtn} ps-0`}>
                    <i
                      class={`${appStyles.txtAccentDark} fa-regular fa-heart ps-0`}
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
                  <Link
                    to={`/profiles/${profile_id}?collectionId=${art_collection}`}
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
                    <Button className={appStyles.btnPrimary}>
                      Make an enquiry
                    </Button>
                  </OverlayTrigger>
                ) : for_sale === 1 && currentUser ? (
                  <Button
                    className={appStyles.btnPrimary}
                    onClick={handleShowEnquiry}
                  >
                    Make an enquiry
                  </Button>
                ) : (
                  for_sale === 1 && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Log in to make enquiries</Tooltip>}
                    >
                      <Button className={appStyles.btnPrimary}>
                        Make an enquiry
                      </Button>
                    </OverlayTrigger>
                  )
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
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button variant="dark" onClick={handleDelete}>
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
            <Form.Group className="mb-3">
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
            <div className={`d-flex justify-content-end`}>
              <Button
                variant="secondary"
                onClick={handleCloseEnquiry}
                className="me-2"
              >
                Close
              </Button>
              <Button
                variant="primary"
                type="submit"
                className={appStyles.btnPrimary}
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
