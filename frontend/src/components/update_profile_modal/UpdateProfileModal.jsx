import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import appStyles from "../../App.module.css";

/**
 * UpdateProfileModal component displays a modal prompting the user to complete their profile.
 *
 * Props:
 * - show: A boolean value indicating whether the modal should be displayed.
 * - handleClose: Function to handle closing the modal.
 * - user: Object containing user details such as profile_id and profile_name.
 *
 * Features:
 * - Displays a modal with information about completing the user's profile.
 * - Provides buttons to either skip the profile update or navigate to the profile edit page.
 *
 * Hooks:
 * - useNavigate: Provides a function to navigate to other pages.
 */
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
          While you&apos;re at it, make your profile stand out better with a
          personal image and description.
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
