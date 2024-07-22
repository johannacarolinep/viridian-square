import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Asset from "../../components/asset/Asset";
import appStyles from "../../App.module.css";
import styles from "./EditArtpiecePage.module.css";
import NotFoundImg from "../../assets/images/notfound.webp";

/**
 * EditArtpiecePage container
 *
 * The EditArtpiecePage component allows a user to edit the details of an existing art piece.
 * It fetches the current art piece data and populates the form with existing values.
 * If the user is not the owner of the art piece, they are redirected to the home page.
 *
 * Features:
 * - Redirect logged-out users to the home page using the useRedirect hook.
 * - Fetch and display the current art piece information.
 * - Provide form fields for editing the art piece title, description, image, medium, sale status, and hashtags.
 * - Handle form input changes and form submission to update the art piece.
 * - Display validation errors returned from the backend API.
 *
 * State:
 * - artpieceData: Holds the current values for title, description, image, medium, sale status, hashtags, and image URL.
 * - errors: Stores any validation or submission errors for the form.
 *
 * Hooks:
 * - useRedirect: Redirects logged-out users to the specified route.
 * - useNavigate: Allows navigation to different routes.
 * - useParams: Retrieves the art piece ID from the URL parameters.
 * - useState: Manages the component's local state.
 * - useEffect: Fetches art piece data when the component mounts or when dependencies change.
 *
 * API Calls:
 * - axiosReq.get(`/artpieces/${id}/`): Fetches the current art piece data.
 * - axiosReq.put(`/artpieces/${id}/`): Submits the updated art piece data to the backend API.
 *
 * @returns {JSX.Element} The EditArtpiecePage component.
 */
const EditArtpiecePage = () => {
  useRedirect("loggedOut", "/");
  const navigate = useNavigate();
  const { id } = useParams();
  const [artpieceData, setArtpieceData] = useState({
    title: "",
    description: "",
    image: "",
    art_medium: "",
    for_sale: "",
    hashtags: "",
    image_url: "",
  });

  const {
    title,
    description,
    image,
    art_medium,
    for_sale,
    hashtags,
    image_url,
  } = artpieceData;

  const [errors, setErrors] = useState({});
  const imageInput = useRef(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/artpieces/${id}/`);
        const {
          is_owner,
          title,
          description,
          image_url,
          art_medium,
          for_sale,
          hashtags,
        } = data;

        is_owner
          ? setArtpieceData({
              title,
              description,
              image_url,
              art_medium,
              for_sale,
              hashtags,
            })
          : navigate("/");
        setHasLoaded(true);
      } catch (err) {
        // Ignoring the error intentionally
      }
    };

    handleMount();
    setHasLoaded(false);
  }, [id, navigate]);

  const handleChange = (event) => {
    setArtpieceData({
      ...artpieceData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setArtpieceData({
        ...artpieceData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    } else {
      setArtpieceData({
        ...artpieceData,
        image: null,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("art_medium", art_medium);
    formData.append("for_sale", for_sale);
    formData.append("hashtags", hashtags);

    if (imageInput?.current?.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }

    try {
      await axiosReq.put(`/artpieces/${id}/`, formData);
      navigate(`/artpieces/${id}`);
    } catch (err) {
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  const artMediumChoices = [
    { value: "noselection", label: "No medium selected" },
    { value: "oil", label: "Oil" },
    { value: "watercolour", label: "Watercolour" },
    { value: "gouache", label: "Gouache" },
    { value: "acrylic", label: "Acrylic" },
    { value: "charcoal", label: "Charcoal" },
    { value: "chalk", label: "Chalk" },
    { value: "photography", label: "Photography" },
    { value: "mixedmedia", label: "Mixed media" },
    { value: "other", label: "Other" },
  ];

  const forSaleChoices = [
    { value: 0, label: "Not for sale" },
    { value: 1, label: "For sale" },
    { value: 2, label: "Sold" },
  ];

  return (
    <main>
      <Container fluid="xl">
        <h1 className="my-3">Edit artpiece:</h1>
        <Form onSubmit={handleSubmit} className="my-3">
          <Row className="m-0">
            <Col lg={6} className={appStyles.bgAccentLight}>
              <Form.Group controlId="image-upload">
                <div className={`${appStyles.bgAccentLight} p-4`}>
                  <h2>
                    <Form.Label className="mb-0">Image:</Form.Label>
                  </h2>
                  <div className={`${appStyles.dividerPrimary} mb-3`}></div>
                  <div
                    className={`${appStyles.ImageContain} ${styles.ImageUpload}`}
                  >
                    {hasLoaded ? (
                      <>
                        {image ? (
                          <Image
                            src={image}
                            rounded
                            alt="Your newly uploaded image"
                          />
                        ) : (
                          <Image
                            src={image_url}
                            rounded
                            alt="The existing image associated with this artpiece"
                            onError={(e) => {
                              e.target.src = NotFoundImg;
                            }}
                          />
                        )}
                      </>
                    ) : (
                      <Asset spinner />
                    )}
                  </div>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleChangeImage}
                    ref={imageInput}
                    className="mt-3"
                  />
                  {errors.image?.map((message, idx) => (
                    <p key={idx}>{message}</p>
                  ))}
                </div>
              </Form.Group>
            </Col>
            <Col lg={6} className={appStyles.bgWhite}>
              <div className={`${appStyles.bgWhite} p-4`}>
                <h2>Details:</h2>
                <div className={`${appStyles.dividerPrimary} mb-3`}></div>
                <Form.Group controlId="collectionTitle">
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

                <Form.Group controlId="collectionDescr">
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

                <Form.Group controlId="medium">
                  <Form.Label>Medium used:</Form.Label>
                  <Form.Control
                    as="select"
                    name="art_medium"
                    value={art_medium}
                    onChange={handleChange}
                  >
                    {artMediumChoices.map((choice) => (
                      <option key={choice.value} value={choice.value}>
                        {choice.label}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                {errors.art_medium?.map((message, idx) => (
                  <p key={idx}>{message}</p>
                ))}

                <Form.Group controlId="forSale">
                  <Form.Label>For sale?:</Form.Label>
                  <Form.Control
                    as="select"
                    name="for_sale"
                    value={for_sale}
                    onChange={handleChange}
                  >
                    {forSaleChoices.map((choice) => (
                      <option key={choice.value} value={choice.value}>
                        {choice.label}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                {errors.for_sale?.map((message, idx) => (
                  <p key={idx}>{message}</p>
                ))}

                <Form.Group controlId="hashtags">
                  <Form.Label>Hashtags</Form.Label>
                  <Form.Control
                    type="text"
                    name="hashtags"
                    value={hashtags}
                    onChange={handleChange}
                  />
                </Form.Group>
                {errors.hashtags?.map((message, idx) => (
                  <p key={idx}>{message}</p>
                ))}
                <Button
                  className={"my-3 me-3"}
                  variant="secondary"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  className={`my-3 me-3 ${appStyles.btnPrimary}`}
                  type="submit"
                  aria-label="Submit changes to artpiece"
                >
                  Update
                </Button>
                {errors.non_field_errors?.map((message, idx) => (
                  <p key={idx}>{message}</p>
                ))}
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </main>
  );
};

export default EditArtpiecePage;
