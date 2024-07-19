import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import appStyles from "../../App.module.css";
import styles from "./CreateArtpiecePage.module.css";
import logo from "../../assets/images/logo.webp";
import { useRedirect } from "../../hooks/useRedirect";

const CreateArtpiecePage = () => {
  useRedirect("loggedOut", "/");
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const [artCollectionChoices, setArtCollectionChoices] = useState([]);
  const [errors, setErrors] = useState({});

  const [artpieceData, setArtpieceData] = useState({
    title: "",
    description: "",
    image: "",
    art_medium: "",
    for_sale: "",
    art_collection: "",
    hashtags: "",
  });

  const {
    title,
    description,
    image,
    art_medium,
    for_sale,
    art_collection,
    hashtags,
  } = artpieceData;

  const imageInput = useRef(null);

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(
          `/collections/?owner=${currentUser.pk}`
        );
        setArtCollectionChoices(data.results);
      } catch (err) {
        // console.log(err);
      }
    };

    handleMount();
  }, [currentUser]);

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
    formData.append("image", imageInput.current.files[0]);
    formData.append("art_medium", art_medium);
    formData.append("for_sale", for_sale);
    formData.append("art_collection", art_collection);
    formData.append("hashtags", hashtags);

    try {
      const { data } = await axiosReq.post("/artpieces/", formData);
      navigate(`/artpieces/${data.id}`);
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
        <h1 className="my-3">Create artpiece:</h1>
        <Form onSubmit={handleSubmit} className="my-3">
          <Row className="m-0">
            <Col lg={6} className={appStyles.bgAccentLight}>
              <Form.Group>
                <div className={`${appStyles.bgAccentLight} p-4`}>
                  <Form.Label htmlFor="image-upload" className="mb-0">
                    <h2>Image:</h2>
                  </Form.Label>
                  <div className={`${appStyles.dividerPrimary} mb-3`}></div>
                  <div
                    className={`${appStyles.ImageContain} ${styles.ImageUpload}`}
                  >
                    {image ? (
                      <Image src={image} rounded />
                    ) : (
                      <Image src={logo} rounded />
                    )}
                  </div>

                  <Form.Control
                    type="file"
                    id="image-upload"
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

                <Form.Group>
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

                <Form.Group>
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

                <Form.Group>
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

                <Form.Group>
                  <Form.Label>Add to collection?</Form.Label>
                  <Form.Control
                    as="select"
                    name="art_collection"
                    value={art_collection}
                    onChange={handleChange}
                  >
                    <option value="">No collection selected</option>
                    {artCollectionChoices.map((choice) => (
                      <option key={choice.id} value={choice.id}>
                        {choice.title}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                {errors.art_collection?.map((message, idx) => (
                  <p key={idx}>{message}</p>
                ))}

                <Button className={`my-3 me-3`} variant="secondary">
                  Cancel
                </Button>
                <Button
                  className={`my-3 me-3 ${appStyles.btnPrimary}`}
                  type="submit"
                >
                  Create
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

export default CreateArtpiecePage;
