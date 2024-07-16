import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import appStyles from "../../App.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import styles from "./EditCollectionPage.module.css";

const EditCollectionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const [collectionData, setCollectionData] = useState({
    title: "",
    description: "",
  });
  const { title, description, is_owner, artpieces } = collectionData;
  const [ownedArtpieces, setOwnedArtpieces] = useState({ results: [] });
  const [selectedArtpieces, setSelectedArtpieces] = useState([]);

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

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
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
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
      //   navigate(`/artpieces/${id}`);
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
              <Button className={`my-3 me-3`} variant="secondary">
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

        <Form onSubmit={handleSubmitSelection} className="my-3">
          <Row className={`${appStyles.bgWhite} p-4 m-0`}>
            <h2>Update artpieces in collection:</h2>
            <div className={`${appStyles.dividerPrimary} mb-3`}></div>

            <div className="p-0">
              {ownedArtpieces.results.length ? (
                <InfiniteScroll
                  dataLength={ownedArtpieces.results.length}
                  next={() => fetchMoreData(ownedArtpieces, setOwnedArtpieces)}
                  hasMore={!!ownedArtpieces.next}
                  loader={<p>Loading...</p>}
                >
                  <Row xs={3} md={4} lg={6} className="g-1 m-0 mt-1">
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
                            className={`${appStyles.ImageCover} ${appStyles.Square}`}
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
                  <p>No results</p>
                </Container>
              )}
            </div>
            <Button className={`my-3 me-3`} variant="secondary">
              Cancel
            </Button>
            <Button
              className={`my-3 me-3 ${appStyles.btnPrimary}`}
              type="submit"
            >
              Save selection
            </Button>
            {errors.non_field_errors?.map((message, idx) => (
              <p key={idx}>{message}</p>
            ))}
          </Row>
        </Form>
      </Container>
    </main>
  );
};

export default EditCollectionPage;
