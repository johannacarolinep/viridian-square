import React from "react";
import { Button, Card } from "react-bootstrap";
import appStyles from "../../App.module.css";
import { MoreDropdown } from "../moredropdown/MoreDropdown";

const CollectionCard = ({
  collection,
  handleDisplayContentChange,
  listPage,
}) => {
  const {
    owner,
    is_owner,
    title,
    description,
    created_on,
    updated_on,
    artpieces,
  } = { ...collection };
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
          <div className={`d-flex align-items-end`}>
            <Button
              className={`${appStyles.btnPrimary} ms-auto`}
              onClick={() => handleDisplayContentChange(collection)}
            >
              Show
            </Button>
          </div>
        )}
        {is_owner && (
          <div className="position-absolute top-0 end-0 py-2">
            <MoreDropdown />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default CollectionCard;
