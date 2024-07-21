import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { fetchMoreData } from "../../utils/utils";
import { useRedirect } from "../../hooks/useRedirect";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Row from "react-bootstrap/Row";
import Tooltip from "react-bootstrap/Tooltip";
import InfiniteScroll from "react-infinite-scroll-component";
import appStyles from "../../App.module.css";
import styles from "./EditCollectionPage.module.css";
import Asset from "../../components/asset/Asset";
import NoResults from "../../assets/images/noresults.webp";
import NotFoundImg from "../../assets/images/notfound.webp";

/**
 * EditCollectionPage Component
 *
 * The EditCollectionPage component allows a user to edit an existing art collection or add art pieces to a new collection.
 * It fetches the current collection data and the user's owned art pieces, and provides form fields for editing the collection details.
 *
 * Features:
 * - Redirect logged-out users to the home page using the useRedirect hook.
 * - Fetch and display the current collection information and owned art pieces.
 * - Provide form fields for editing the collection title and description.
 * - Allow selecting and deselecting art pieces to be included in the collection.
 * - Handle form submissions to update collection details and associate selected art pieces with the collection.
 * - Display validation errors and success messages.
 *
 * State:
 * - collectionData: Holds the current values for title and description.
 * - ownedArtpieces: Holds the user's owned art pieces data with support for infinite scrolling.
 * - selectedArtpieces: Holds the IDs of art pieces selected to be included in the collection.
 * - errors: Stores any validation or submission errors for the forms.
 * - successMessage: Displays a success message when the collection details are updated.
 * - hasLoaded: Indicates whether the data has finished loading.
 *
 * Hooks:
 * - useRedirect: Redirects logged-out users to the specified route.
 * - useNavigate: Allows navigation to different routes.
 * - useParams: Retrieves the collection ID from the URL parameters.
 * - useState: Manages the component's local state.
 * - useEffect: Fetches collection and art piece data when the component mounts or when dependencies change.
 *
 * API Calls:
 * - axiosReq.get(`/collections/${id}/`): Fetches the current collection data.
 * - axiosReq.get(`/artpieces/?owner=${collection.owner}`): Fetches the user's owned art pieces.
 * - axiosReq.put(`/collections/${id}/`): Submits the updated collection data to the backend API.
 * - axiosReq.post(`/collections/${id}/update-artpieces/`): Submits the selected art pieces to be associated with the collection.
 *
 * @param {boolean} newCollection - A flag indicating whether the component is used for a new collection.
 * @returns {JSX.Element} The EditCollectionPage component.
 */

const EditCollectionPage = ({ newCollection }) => {
  useRedirect("loggedOut", "/");
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const [collectionData, setCollectionData] = useState({
    title: "",
    description: "",
  });
  const { title, description } = collectionData;
  const [ownedArtpieces, setOwnedArtpieces] = useState({ results: [] });
  const [selectedArtpieces, setSelectedArtpieces] = useState([]);

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data: collection } = await axiosReq.get(`/collections/${id}/`);
        const { is_owner, title, description } = collection;
        is_owner
          ? setCollectionData({
              title,
              description,
            })
          : navigate("/");
        const { data: artpieceData } = await axiosReq.get(
          `/artpieces/?owner=${collection.owner}`
        );
        setOwnedArtpieces(artpieceData);
        setSelectedArtpieces(collection.artpieces);
        setHasLoaded(true);
      } catch (err) {
        // console.log(err);
      }
    };

    handleMount();
    setHasLoaded(false);
  }, [id, navigate]);

  const handleChange = (event) => {
    setCollectionData({
      ...collectionData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);

    try {
      await axiosReq.put(`/collections/${id}/`, formData);
      setSuccessMessage("Collection details updated");
    } catch (err) {
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  const handleSelect = (artpieceId) => {
    setSelectedArtpieces((prev) => [...prev, artpieceId]);
  };

  const handleDeselect = (artpieceId) => {
    setSelectedArtpieces((prev) => prev.filter((id) => id !== artpieceId));
  };

  const handleSubmitSelection = async (event) => {
    event.preventDefault();

    const data = {
      artpiece_ids: selectedArtpieces,
    };

    try {
      await axiosReq.post(`/collections/${id}/update-artpieces/`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      navigate(`/profiles/${currentUser.profile_id}/?collectionId=${id}`);
    } catch (err) {
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  return (
    <main>
      <Container fluid="xl">
        {!newCollection ? (
          <>
            <h1 className="my-3">Edit collection:</h1>
            <Form onSubmit={handleSubmit} className="my-3">
              <Row className={`${appStyles.bgWhite} p-4 m-0`}>
                <Col lg={6} className={appStyles.bgWhite}>
                  <h2>Details:</h2>
                  <div className={`${appStyles.dividerPrimary} mb-3`}></div>
                </Col>
                <Col lg={6} className={appStyles.bgWhite}>
                  <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={title}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {errors.title?.map((message, idx) => (
                    <p key={idx}>{message}</p>
                  ))}

                  <Form.Group controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      name="description"
                      value={description}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {errors.description?.map((message, idx) => (
                    <p key={idx}>{message}</p>
                  ))}
                  <Button
                    className={"my-3 me-3"}
                    variant="secondary"
                    onClick={() =>
                      navigate(
                        `/profiles/${currentUser.profile_id}/?collectionId=${id}`
                      )
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    className={`my-3 me-3 ${appStyles.btnPrimary}`}
                    type="submit"
                    aria-label="Submit changes to collection"
                  >
                    Update
                  </Button>
                  {errors.non_field_errors?.map((message, idx) => (
                    <p key={idx}>{message}</p>
                  ))}
                  {successMessage && (
                    <p className="text-success fw-bolder">{successMessage}</p>
                  )}
                </Col>
              </Row>
            </Form>
          </>
        ) : (
          <h1 className="my-3">Add artpieces to your new collection:</h1>
        )}

        <Form onSubmit={handleSubmitSelection} className="my-3">
          <Row className={`${appStyles.bgWhite} p-4 m-0`}>
            <h2>Update artpieces in collection:</h2>
            <div className={`${appStyles.dividerPrimary} mb-3`}></div>
            {hasLoaded ? (
              <div className={`p-2 ${styles.SelectionBox}`}>
                {ownedArtpieces.results.length ? (
                  <InfiniteScroll
                    dataLength={ownedArtpieces.results.length}
                    next={() =>
                      fetchMoreData(ownedArtpieces, setOwnedArtpieces)
                    }
                    hasMore={!!ownedArtpieces.next}
                    loader={<Asset spinner />}
                  >
                    <Row xs={3} md={4} lg={6} className="g-1 m-0">
                      {ownedArtpieces.results.map((artpiece) => (
                        <Col key={artpiece.id}>
                          {selectedArtpieces.includes(artpiece.id) ? (
                            <Button
                              onClick={() => handleDeselect(artpiece.id)}
                              className={`${styles.Selected} ${appStyles.ImageCover} ${appStyles.Square}`}
                              aria-label="Deselect artpiece"
                            >
                              <Image
                                src={artpiece.image_url}
                                alt={artpiece.title}
                                onError={(e) => {
                                  e.target.src = NotFoundImg;
                                }}
                              />
                            </Button>
                          ) : artpiece.art_collection &&
                            artpiece.art_collection !== parseInt(id) ? (
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip>
                                  Already included in other collection
                                </Tooltip>
                              }
                            >
                              <Button
                                className={`position-relative ${appStyles.ImageCover} ${appStyles.Square} ${styles.Unavailable}`}
                                aria-label="Cannot be selected since it's alrady part of a different collection"
                              >
                                <Image
                                  src={artpiece.image_url}
                                  alt={artpiece.title}
                                  onError={(e) => {
                                    e.target.src = NotFoundImg;
                                  }}
                                />
                                <span className={styles.Unavailable}></span>
                              </Button>
                            </OverlayTrigger>
                          ) : (
                            <Button
                              onClick={() => handleSelect(artpiece.id)}
                              className={`${styles.Available} ${appStyles.ImageCover} ${appStyles.Square}`}
                              aria-label="Select artpiece"
                            >
                              <Image
                                src={artpiece.image_url}
                                alt={artpiece.title}
                                onError={(e) => {
                                  e.target.src = NotFoundImg;
                                }}
                              />
                            </Button>
                          )}
                        </Col>
                      ))}
                    </Row>
                  </InfiniteScroll>
                ) : (
                  <Container>
                    <Asset src={NoResults} message={"No results"} />
                  </Container>
                )}
              </div>
            ) : (
              <Asset spinner />
            )}

            <div className="d-flex flex-column flex-md-row justify-content-end p-0 pt-2">
              <Button
                onClick={() =>
                  navigate(
                    `/profiles/${currentUser.profile_id}/?collectionId=${id}`
                  )
                }
                className={"my-2 mx-md-2"}
                variant="secondary"
              >
                Skip this step
              </Button>
              <Button
                className={`my-2 ${appStyles.btnPrimary}`}
                type="submit"
                aria-label="Save association of artpieces to the collection"
              >
                Save selection
              </Button>
              {errors.non_field_errors?.map((message, idx) => (
                <p key={idx}>{message}</p>
              ))}
            </div>
          </Row>
        </Form>
      </Container>
    </main>
  );
};

export default EditCollectionPage;
