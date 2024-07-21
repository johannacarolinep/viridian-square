import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { MoreDropdown } from "../../components/moredropdown/MoreDropdown";
import ArtpieceSimple from "../../components/artpiece_simple/ArtpieceSimple";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import CollectionsDisplay from "../CollectionsDisplay/CollectionsDisplay";
import CollectionCard from "../../components/collection_card/CollectionCard";
import Asset from "../../components/asset/Asset";
import NoResults from "../../assets/images/noresults.webp";
import appStyles from "../../App.module.css";
import styles from "./ProfilePage.module.css";
import ImageHolder from "../../components/image_holder/ImageHolder";

/**
 * ProfilePage container
 *
 * The ProfilePage container is responsible for displaying a user's profile, including their art pieces and collections.
 * It fetches the profile data, art pieces, and collections associated with the user and allows the user to edit their profile,
 * view details, and delete collections.
 *
 * Features:
 * - Fetch and display the user's profile information, including their profile image, name, description, location, and stats.
 * - Display tabs for switching between the user's art pieces and collections.
 * - Infinite scrolling to load more art pieces as the user scrolls down.
 * - Modal for confirming the deletion of a collection.
 * - Redirect to edit profile and account settings pages.
 * - Handle display content changes between art pieces and collections.
 *
 * State:
 * - profile: Stores the user's profile data.
 * - artpieces: Stores the user's art pieces data with support for infinite scrolling.
 * - collections: Stores the user's collections data.
 * - displayContent: Determines whether to show art pieces, collections, or a specific collection's details.
 * - showDelete: Controls the visibility of the delete confirmation modal.
 * - collectionToDelete: Has the ID of the collection to be deleted.
 * - hasLoaded: Indicates whether the data has finished loading.
 *
 * Hooks:
 * - useParams: Retrieves the user ID from the URL parameters.
 * - useLocation: Accesses the location object for query parameters.
 * - useCurrentUser: Retrieves the current user's information.
 * - useNavigate: Allows navigation to different routes.
 * - useEffect: Fetches data when the component mounts or when dependencies change.
 *
 * API Calls:
 * - axiosReq.get(`/profiles/${id}/`): Fetches the user's profile data.
 * - axiosReq.get(`/artpieces/?owner=${profileData.owner}`): Fetches the user's art pieces.
 * - axiosReq.get(`/collections/?owner=${profileData.owner}`): Fetches the user's collections.
 * - axiosRes.delete(`/collections/${collectionToDelete}/`): Deletes the specified collection.
 *
 * @returns {JSX.Element} The ProfilePage component.
 */
const ProfilePage = () => {
  const { id } = useParams();
  const { search } = useLocation();
  const currentUser = useCurrentUser();
  const [profile, setProfile] = useState([]);
  const [artpieces, setArtpieces] = useState({ results: [] });
  const [collections, setCollections] = useState({ results: [] });
  const navigate = useNavigate();
  const [displayContent, setDisplayContent] = useState("artpieces");
  const [showDelete, setShowDelete] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: profileData } = await axiosReq.get(`/profiles/${id}/`);
        setProfile(profileData);
        const { data: artpieceData } = await axiosReq.get(
          `/artpieces/?owner=${profileData.owner}`
        );
        setArtpieces(artpieceData);

        const { data: collectionsData } = await axiosReq.get(
          `/collections/?owner=${profileData.owner}`
        );
        setCollections(collectionsData);

        const queryParams = new URLSearchParams(search);
        const collectionId = queryParams.get("collectionId");
        if (collectionId) {
          const matchedCollection = collectionsData.results.find(
            (collection) => collection.id === parseInt(collectionId)
          );
          if (matchedCollection) {
            setDisplayContent(matchedCollection);
          }
        }
        setHasLoaded(true);
      } catch (err) {
        // console.log(err);
      }
    };

    fetchData();
    setHasLoaded(false);
  }, [id, navigate, currentUser, search]);

  const handleEdit = () => {
    navigate(`/profiles/${profile.id}/edit`);
  };

  const handleAccountChange = () => {
    navigate("/account");
  };

  const handleDisplayContentChange = (content) => {
    setDisplayContent(content);
  };

  const handleDeleteConfirm = (collectionId) => {
    setShowDelete(true);
    setCollectionToDelete(collectionId);
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
    setCollectionToDelete(null);
  };

  const handleDelete = async () => {
    setShowDelete(false);
    try {
      await axiosRes.delete(`/collections/${collectionToDelete}/`);
      setCollections((prevCollections) => ({
        results: prevCollections.results.filter(
          (collection) => collection.id !== collectionToDelete
        ),
      }));
      if (displayContent.id) {
        setDisplayContent("collections");
      }
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <main className={appStyles.bgAccentLight}>
      {hasLoaded ? (
        <Container fluid="xl" className={`my-xl-4 pb-3 ${appStyles.bgWhite}`}>
          <section className="p-lg-3">
            <Row className={"m-0 g-4"}>
              <Col md={4} lg={3}>
                <div
                  className={`${appStyles.ImageCover} ${appStyles.Round} ${styles.ProfileImage}`}
                >
                  <Image
                    src={profile?.profile_image_url}
                    alt={`${profile?.name}'s profile image`}
                  />
                </div>
              </Col>
              <Col md={8} lg={9}>
                <div className="d-flex justify-content-between">
                  <h1 className="mb-3">{profile?.name}</h1>
                  {profile.is_owner && (
                    <MoreDropdown
                      profile
                      handleEdit={handleEdit}
                      handleAccountChange={handleAccountChange}
                    />
                  )}
                </div>
                {profile?.description && <p>{profile.description}</p>}
                {profile?.location && (
                  <p>
                    <i
                      className="fa-solid fa-location-dot ps-0"
                      aria-label="Location"
                    ></i>{" "}
                    {profile.location}
                  </p>
                )}
                <div className="fs-4 mt-4">
                  {profile?.artpiece_count !== 0 && (
                    <Badge
                      pill
                      className={`me-1 my-1 ${appStyles.bgDark}`}
                      bg=""
                    >
                      #Artpieces: {profile.artpiece_count}
                    </Badge>
                  )}
                  {collections.results.length > 0 && (
                    <Badge
                      pill
                      className={`me-1 my-1 ${appStyles.bgPrimary}`}
                      bg=""
                    >
                      #Collections: {collections.results.length}
                    </Badge>
                  )}
                  {profile?.for_sale_count !== 0 && (
                    <Badge
                      pill
                      className={`me-1 my-1 ${appStyles.bgAccentDark}`}
                      bg=""
                    >
                      Has artpieces for sale
                    </Badge>
                  )}
                </div>
              </Col>
            </Row>
          </section>
          <section className={`${appStyles.bgAccentDark} mt-3 p-2 rounded`}>
            <Row className="m-0">
              <div className={`${appStyles.bgLight} p-0 d-flex flex-wrap`}>
                <Button
                  onClick={() => handleDisplayContentChange("artpieces")}
                  className={
                    displayContent === "artpieces"
                      ? styles.TabButtonSelected
                      : styles.TabButton
                  }
                  aria-label="Show all artpieces by this artist"
                >
                  Artpieces
                </Button>

                <Button
                  onClick={() => handleDisplayContentChange("collections")}
                  className={
                    displayContent === "collections"
                      ? styles.TabButtonSelected
                      : styles.TabButton
                  }
                  aria-label="Show all collections of this artist"
                >
                  Collections
                </Button>
                {displayContent !== "artpieces" &&
                  displayContent !== "collections" && (
                  <div
                    className={`${styles.Tab} ${styles.TabButtonSelected}`}
                  >
                    {displayContent.title}
                  </div>
                )}
              </div>
            </Row>
            <Row className="m-0">
              {displayContent === "artpieces" ? (
                <div className="p-0">
                  {artpieces.results.length ? (
                    <InfiniteScroll
                      dataLength={artpieces.results.length}
                      next={() => fetchMoreData(artpieces, setArtpieces)}
                      hasMore={!!artpieces.next}
                      loader={<p>Loading...</p>}
                    >
                      <Row xs={2} md={3} lg={4} className="g-1 m-0 mt-1">
                        {artpieces.results.map((artpiece) => (
                          <Col key={artpiece.id}>
                            <ArtpieceSimple
                              className="h-100"
                              basic
                              {...artpiece}
                              setArtpieces={setArtpieces}
                            />
                          </Col>
                        ))}
                      </Row>
                    </InfiniteScroll>
                  ) : (
                    <Row className={`m-0 mt-2 p-2 ${appStyles.bgLight}`}>
                      <div
                        className={"d-flex justify-content-center align-items-center flex-column flex-md-row"}
                      >
                        <Link
                          to="/create-artpiece"
                          className={`${appStyles.btnPrimary} ${appStyles.linkBtn} rounded d-block mt-3`}
                        >
                          Create your first artpiece
                        </Link>
                        <div className={styles.ImgContainer}>
                          <ImageHolder
                            src={NoResults}
                            alt={"No artpieces to display"}
                          />
                        </div>
                      </div>
                    </Row>
                  )}
                </div>
              ) : displayContent === "collections" ? (
                <CollectionsDisplay
                  owner={profile.owner}
                  handleDisplayContentChange={handleDisplayContentChange}
                  handleDeleteConfirm={handleDeleteConfirm}
                  collections={collections}
                  setCollections={setCollections}
                />
              ) : (
                <div className={`p-0 mt-2 ${appStyles.bgLight}`}>
                  <Row className="m-0 pt-2 px-3">
                    <CollectionCard
                      collection={displayContent}
                      handleDisplayContentChange={handleDisplayContentChange}
                      handleDeleteConfirm={handleDeleteConfirm}
                    />
                  </Row>
                  {displayContent.artpieces.length ? (
                    <Row xs={2} md={3} lg={4} className="g-1 m-0 px-3 my-1">
                      {artpieces.results
                        .filter((artpiece) =>
                          displayContent.artpieces.includes(artpiece.id)
                        )
                        .map((artpiece) => (
                          <Col key={artpiece.id}>
                            <ArtpieceSimple
                              className="h-100"
                              basic
                              {...artpiece}
                              setArtpieces={setArtpieces}
                            />
                          </Col>
                        ))}
                    </Row>
                  ) : (
                    <Container>
                      <Asset
                        src={NoResults}
                        message={"No artpieces to display"}
                      />
                    </Container>
                  )}
                </div>
              )}
            </Row>
          </section>
        </Container>
      ) : (
        <Asset spinner />
      )}

      <Modal show={showDelete} onHide={handleCloseDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1 className="fs-3 mb-0">Confirm deletion</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete this collection?
            <br />
            <br />
            FYI: Deleting a collection will not delete the artpieces in it.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button
            variant=""
            onClick={handleDelete}
            className={appStyles.btnPrimary}
            aria-label="Confirm collection deletion"
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

export default ProfilePage;
