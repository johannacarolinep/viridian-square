import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

const ThreeDots = React.forwardRef(({ onClick }, ref) => (
  <i
    className="fa-solid fa-ellipsis-vertical"
    ref={ref}
    onClick={(event) => {
      event.preventDefault();
      onClick(event);
    }}
  />
));

export const MoreDropdown = ({ handleEdit, handleDelete }) => {
  return (
    <Dropdown className="ms-auto" drop="left">
      <Dropdown.Toggle as={ThreeDots} />

      <Dropdown.Menu>
        <Dropdown.Item onClick={handleEdit} aria-label="edit">
          <i className="fas fa-edit" /> Edit
        </Dropdown.Item>
        <Dropdown.Item onClick={handleDelete} aria-label="delete">
          <i className="fas fa-trash-alt" /> Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
