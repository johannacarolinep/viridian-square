import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import appStyles from "../../App.module.css";
import { MoreDropdown } from "../moredropdown/MoreDropdown";
import { useNavigate } from "react-router-dom";

/**
 * CollectionCard component displays information about an art collection.
 *
 * Props:
 * - collection: Object containing collection details (id, is_owner, title, description,
 *   created_on, updated_on, artpieces).
 * - handleDisplayContentChange: Function to handle displaying collection content.
 * - handleDeleteConfirm: Function to handle confirming deletion of the collection.
 * - listPage: Boolean indicating if the card is displayed on a list page.
 *
 * Features:
 * - Displays collection title, description, creation date, and last updated date.
 * - Shows the number of art pieces in the collection.
 * - Provides an option to show collection content if `listPage` is true.
 * - Allows owners to edit or delete the collection using the `MoreDropdown` component.
 */
const CollectionCard = ({
  collection,
  handleDisplayContentChange,
  handleDeleteConfirm,
  listPage,
}) => {
  const {
    id,
    is_owner,
    title,
    description,
    created_on,
    updated_on,
    artpieces,
  } = { ...collection };
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/collections/${id}/edit`);
  };

  return (
    <Card>
      <Card.Body className="position-relative d-md-flex justify-content-between">
        <div>
          <h5>{title}</h5>
          <p>{description}</p>
          {artpieces.length === 0 ? (
            <p className="small mb-0">This collection contains no artpieces</p>
          ) : (
            <p className="small mb-0">
              This collection contains{" "}
              <span className="fw-bold">{artpieces.length} artpieces</span>
            </p>
          )}
          <p className="small mb-0">
            <span className="fw-bold">Created:</span> {created_on}
          </p>
          {created_on !== updated_on && (
            <p className="small fst-italic">Last updated: {updated_on}</p>
          )}
        </div>
        {listPage && (
          <div className={"d-flex align-items-end"}>
            <Button
              className={`${appStyles.btnPrimary} ms-auto`}
              onClick={() => handleDisplayContentChange(collection)}
              aria-label="Show collection"
            >
              Show
            </Button>
          </div>
        )}
        {is_owner && (
          <div className="position-absolute top-0 end-0 py-2">
            <MoreDropdown
              collection
              handleEdit={handleEdit}
              handleDeleteConfirm={handleDeleteConfirm}
              collectionId={id}
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default CollectionCard;
