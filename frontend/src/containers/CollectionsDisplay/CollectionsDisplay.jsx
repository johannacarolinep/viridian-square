import React, { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import { Button } from "react-bootstrap";

const CollectionsDisplay = ({ owner, handleDisplayContentChange }) => {
  const [collections, setCollections] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const { data } = await axiosReq.get(`/collections/?owner=${owner}`);
        console.log("collections data", data);
        setCollections(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    setHasLoaded(false);
    fetchCollections();
  }, [owner]);
  return (
    <div>
      CollectionsDisplay
      <div>
        {collections.results.map((collection) => (
          <div key={collection.id}>
            <p>{collection.title}</p>
            <Button onClick={() => handleDisplayContentChange(collection)}>
              Show
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionsDisplay;
