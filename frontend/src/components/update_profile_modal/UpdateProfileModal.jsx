import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import appStyles from "../../App.module.css";

const UpdateProfileModal = ({ show, handleClose, user }) => {
  const navigate = useNavigate();
  const directToProfile = () => {
    navigate(`/profiles/${user.profile_id}/edit`);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <h1 className="fs-3 mb-0">Complete your profile</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          You have been given a temporary profile name,{" "}
          <span className="fw-bold">{user.profile_name}</span>.<br />
          <br />
          We recommend changing this into something more personal.
          <br />
          <br />
          While you're at it, make your profile stand out better with a personal
          image and description.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Skip for now
        </Button>
        <Button
          className={appStyles.btnPrimary}
          variant=""
          onClick={directToProfile}
        >
          Complete profile
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateProfileModal;
