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
import appStyles from "../../App.module.css";
import styles from "./EditArtpiecePage.module.css";

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
      } catch (err) {
        // console.log(err);
      }
    };

    handleMount();
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
                  <Form.Label htmlFor="image-upload" className="mb-0">
                    <h2>Image:</h2>
                  </Form.Label>
                  <div className={`${appStyles.dividerPrimary} mb-3`}></div>
                  <div
                    className={`${appStyles.ImageContain} ${styles.ImageUpload}`}
                  >
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
                      />
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
                <Form.Group controlId="collectionTitle">
                  <Form.Label htmlFor="collectionTitle">Title</Form.Label>
                  <Form.Control
                    id="collectionTitle"
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
                  <Form.Label htmlFor="collectionDescr">Description</Form.Label>
                  <Form.Control
                    id="collectionDescr"
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
                  <Form.Label htmlFor="medium">Medium used:</Form.Label>
                  <Form.Control
                    id="medium"
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
                  <Form.Label htmlFor="forSale">For sale?:</Form.Label>
                  <Form.Control
                    id="forSale"
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
                  <Form.Label htmlFor="hashtags">Hashtags</Form.Label>
                  <Form.Control
                    id="hashtags"
                    type="text"
                    name="hashtags"
                    value={hashtags}
                    onChange={handleChange}
                  />
                </Form.Group>
                {errors.hashtags?.map((message, idx) => (
                  <p key={idx}>{message}</p>
                ))}
                <Button className={`my-3 me-3`} variant="secondary">
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
