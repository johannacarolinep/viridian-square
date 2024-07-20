import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import appStyles from "../../App.module.css";

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
          <i className="fas fa-edit" /> Edit {profile && `profile`}
          {collection && `collection`}
          {artpiece && `artpiece`}
        </Dropdown.Item>
        {handleDeleteConfirm && (
          <Dropdown.Item
            onClick={() => handleDeleteConfirm(collectionId)}
            aria-label="delete"
          >
            <i className="fas fa-trash-alt" /> Delete{" "}
            {collection && `collection`}
            {artpiece && `artpiece`}
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
