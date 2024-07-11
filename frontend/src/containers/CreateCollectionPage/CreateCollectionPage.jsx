import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const CreateCollectionPage = () => {
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
    } catch (err) {
      console.log("ERROR RESPONSE ", err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  return (
    <main>
      <Form onSubmit={handleSubmit}>
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

        <Button>cancel</Button>
        <Button type="submit">create</Button>
        {errors.non_field_errors?.map((message, idx) => (
          <p key={idx}>{message}</p>
        ))}
      </Form>
    </main>
  );
};

export default CreateCollectionPage;
