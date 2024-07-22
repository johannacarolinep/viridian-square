import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import appStyles from "../../App.module.css";

/**
 * ThreeDots component renders a button with three vertical dots, used as a toggle for the dropdown menu.
 *
 * Props:
 * - onClick: Function to handle the button click event.
 *
 * Features:
 * - Displays a button with a three-dots icon.
 *
 * OBS: Copied from a Code Institute walkthrough project
 */
const ThreeDots = React.forwardRef(({ onClick }, ref) => (
  <button
    className={appStyles.IconBtn}
    onClick={(event) => {
      event.preventDefault();
      onClick(event);
    }}
    ref={ref}
    aria-label="More options"
  >
    <i className="fa-solid fa-ellipsis-vertical" />
  </button>
));

/**
 * MoreDropdown component renders a dropdown menu with options to edit, delete, or change account details.
 *
 * Props:
 * - handleEdit: Function to handle the edit action.
 * - handleDeleteConfirm: Optional function to handle the delete confirmation action.
 * - handleAccountChange: Optional function to handle the account change action.
 * - collectionId: optional ID of the collection to be deleted.
 * - profile: Optional boolean indicating if the dropdown is for a profile.
 * - collection: Optional boolean indicating if the dropdown is for a collection.
 * - artpiece: Optional boolean indicating if the dropdown is for an artpiece.
 *
 * Features:
 * - Displays a dropdown menu with options to edit and optionally delete or change account details.
 *
 */
export const MoreDropdown = ({
  handleEdit,
  handleDeleteConfirm,
  handleAccountChange,
  collectionId,
  profile,
  collection,
  artpiece,
}) => {
  return (
    <Dropdown className="ms-auto" drop="left">
      <Dropdown.Toggle as={ThreeDots} />

      <Dropdown.Menu>
        <Dropdown.Item onClick={handleEdit} aria-label="edit">
          <i className="fas fa-edit" /> Edit {profile && "profile"}
          {collection && "collection"}
          {artpiece && "artpiece"}
        </Dropdown.Item>
        {handleDeleteConfirm && (
          <Dropdown.Item
            onClick={() => handleDeleteConfirm(collectionId)}
            aria-label="delete"
          >
            <i className="fas fa-trash-alt" /> Delete{" "}
            {collection && "collection"}
            {artpiece && "artpiece"}
          </Dropdown.Item>
        )}
        {handleAccountChange && (
          <Dropdown.Item
            onClick={handleAccountChange}
            aria-label="make account changes"
          >
            <i className="fa-solid fa-user-pen"></i> Edit account details
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};
