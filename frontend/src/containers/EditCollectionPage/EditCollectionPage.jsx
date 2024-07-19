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
                  <Form.Group>
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

                  <Form.Group>
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
                    className={`my-3 me-3`}
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
                            <div
                              onClick={() => handleDeselect(artpiece.id)}
                              className={`${styles.Selected} ${appStyles.ImageCover} ${appStyles.Square}`}
                            >
                              <Image src={artpiece.image_url} />
                            </div>
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
                              <div
                                className={`position-relative ${appStyles.ImageCover} ${appStyles.Square}`}
                              >
                                <Image src={artpiece.image_url} />
                                <div className={styles.Unavailable}></div>
                              </div>
                            </OverlayTrigger>
                          ) : (
                            <div
                              onClick={() => handleSelect(artpiece.id)}
                              className={`${styles.Available} ${appStyles.ImageCover} ${appStyles.Square}`}
                            >
                              <Image src={artpiece.image_url} />
                            </div>
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
                className={`my-2 mx-md-2`}
                variant="secondary"
              >
                Skip this step
              </Button>
              <Button className={`my-2 ${appStyles.btnPrimary}`} type="submit">
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
