import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import appStyles from "../../App.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import CollectionCard from "../../components/collection_card/CollectionCard";
import NoResults from "../../assets/images/noresults.webp";
import Asset from "../../components/asset/Asset";

const CollectionsDisplay = ({
  handleDisplayContentChange,
  handleDeleteConfirm,
  collections,
  setCollections,
}) => {
  // const [collections, setCollections] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

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
