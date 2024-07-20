import React, { useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import { useNavigate } from "react-router-dom";
import { useRedirect } from "../../hooks/useRedirect";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import appStyles from "../../App.module.css";

/**
 * CreateCollectionPage container
 *
 * The CreateCollectionPage container provides a form for users to create a new art collection.
 * It captures the collection's title and description, and upon submission, it sends the data to the backend API.
 *
 * Features:
 * - Redirects logged-out users to the home page using the useRedirect hook.
 * - Provides a form with fields for the collection title and description.
 * - Handles form input changes and form submission.
 * - Displays validation errors returned from the backend API.
 *
 * State:
 * - artCollectionData: Holds the current values for title and description.
 * - errors: Stores any validation or submission errors for the form.
 *
 * Hooks:
 * - useRedirect: Redirects logged-out users to the specified route.
 * - useNavigate: Allows navigation to different routes.
 * - useState: Manages the component's local state.
 *
 * API Calls:
 * - axiosReq.post("/collections/"): Submits the new collection data to the backend API.
 *
 * @returns {JSX.Element} The CreateCollectionPage container.
 */
const CreateCollectionPage = () => {
  useRedirect("loggedOut", "/");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [artCollectionData, setArtCollectionData] = useState({
    title: "",
    description: "",
  });

  const { title, description } = artCollectionData;

  const handleChange = (event) => {
    setArtCollectionData({
      ...artCollectionData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);

    try {
      const { data } = await axiosReq.post("/collections/", formData);
      navigate(`/collections/${data.id}/edit/new`);
    } catch (err) {
      // console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  return (
    <main>
      <Container flui="xl">
        <h1 className="my-3">Create collection:</h1>
        <Form onSubmit={handleSubmit} className="my-3">
          <Row className={`${appStyles.bgWhite} p-4 m-0`}>
            <Col lg={6} className={appStyles.bgWhite}>
              <h2>Details:</h2>
              <div className={`${appStyles.dividerPrimary} mb-3`}></div>
            </Col>
            <Col lg={6} className={appStyles.bgWhite}>
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
              <Button
                className={`my-3 me-3`}
                variant="secondary"
                onClick={() => navigate("/")}
              >
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
            </Col>
          </Row>
        </Form>
      </Container>
    </main>
  );
};

export default CreateCollectionPage;
