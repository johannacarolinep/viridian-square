import React, { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import { Button, Col, Container, Row } from "react-bootstrap";
import appStyles from "../../App.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import CollectionCard from "../../components/collection_card/CollectionCard";
import NoResults from "../../assets/images/noresults.webp";
import Asset from "../../components/asset/Asset";

const CollectionsDisplay = ({
  owner,
  handleDisplayContentChange,
  handleDeleteConfirm,
  collections,
  setCollections,
}) => {
  // const [collections, setCollections] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

  // useEffect(() => {
  //   const fetchCollections = async () => {
  //     try {
  //       const { data } = await axiosReq.get(`/collections/?owner=${owner}`);
  //       console.log("collections data", data);
  //       setCollections(data);
  //       setHasLoaded(true);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   setHasLoaded(false);
  //   fetchCollections();
  // }, [owner]);
  return (
    <div className={`p-0 mt-2 ${appStyles.bgLight}`}>
      {collections.results.length ? (
        <InfiniteScroll
          dataLength={collections.results.length}
          next={() => fetchMoreData(collections, setCollections)}
          hasMore={!!collections.next}
          loader={<p>Loading...</p>}
        >
          {collections.results.map((collection) => (
            <Row className="m-0 py-2 px-3" key={collection.id}>
              <CollectionCard
                collection={collection}
                handleDisplayContentChange={handleDisplayContentChange}
                handleDeleteConfirm={handleDeleteConfirm}
                listPage
              />
            </Row>
          ))}
        </InfiniteScroll>
      ) : (
        <Container>
          <Asset src={NoResults} message={`No collections to display`} />
        </Container>
      )}
    </div>
  );
};

export default CollectionsDisplay;
