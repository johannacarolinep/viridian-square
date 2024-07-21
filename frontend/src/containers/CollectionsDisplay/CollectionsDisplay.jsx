import React from "react";
import Row from "react-bootstrap/Row";
import appStyles from "../../App.module.css";
import styles from "./CollectionsDisplay.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import CollectionCard from "../../components/collection_card/CollectionCard";
import NoResults from "../../assets/images/noresults.webp";
import { Link } from "react-router-dom";
import ImageHolder from "../../components/image_holder/ImageHolder";

/**
 * CollectionsDisplay Container
 *
 * The CollectionsDisplay container is responsible for displaying a list of art collections with support for infinite scrolling.
 * It fetches more collections as the user scrolls down and displays a loading message while fetching.
 * If there are no collections to display, it shows a message indicating no results.
 *
 * Features:
 * - Display a list of art collections using the CollectionCard component.
 * - Support infinite scrolling to load more collections as the user scrolls down.
 * - Show a loading message while fetching more collections.
 * - Display a message indicating no results if there are no collections to display.
 *
 * Props:
 * - handleDisplayContentChange: Function to handle changes in the displayed content.
 * - handleDeleteConfirm: Function to handle confirmation of collection deletion.
 * - collections: Object containing the collection data and pagination information.
 * - setCollections: Function to update the state of collections.
 *
 * State:
 * - hasLoaded: Indicates whether the data has finished loading.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.handleDisplayContentChange - Function to handle changes in the displayed content.
 * @param {Function} props.handleDeleteConfirm - Function to handle confirmation of collection deletion.
 * @param {Object} props.collections - Object containing the collection data and pagination information.
 * @param {Function} props.setCollections - Function to update the state of collections.
 * @returns {JSX.Element} The CollectionsDisplay component.
 */
const CollectionsDisplay = ({
  handleDisplayContentChange,
  handleDeleteConfirm,
  collections,
  setCollections,
}) => {
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
        <Row className={`m-3 ${appStyles.bgLight}`}>
          <div
            className={`d-flex justify-content-center align-items-center flex-column flex-md-row`}
          >
            <Link
              to="/create-collection"
              className={`${appStyles.btnPrimary} ${appStyles.linkBtn} rounded d-block mt-3`}
            >
              Create your first collection
            </Link>
            <div className={styles.ImgContainer}>
              <ImageHolder src={NoResults} alt={`No collections to display`} />
            </div>
          </div>
        </Row>
      )}
    </div>
  );
};

export default CollectionsDisplay;
