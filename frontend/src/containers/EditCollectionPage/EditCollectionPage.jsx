import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import appStyles from "../../App.module.css";

const EditCollectionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [collectionData, setCollectionData] = useState({
    title: "",
    description: "",
  });

  const { title, description, is_owner } = collectionData;

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/collections/${id}/`);
        const { is_owner, title, description } = data;

        is_owner
          ? setCollectionData({
              title,
              description,
            })
          : navigate("/");
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

              {errors.art_medium?.map((message, idx) => (
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
      </Container>
    </main>
  );
};

export default EditCollectionPage;
