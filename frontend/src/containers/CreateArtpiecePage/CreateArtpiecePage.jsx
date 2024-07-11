import React, { useRef, useState } from "react";
import { Form, Button, Image } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";

const CreateArtpiecePage = () => {
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
      console.log("Artpiece created!");
    } catch (err) {
      console.log("ERROR RESPONSE ", err);
      if (err.response?.status !== 401) {
        console.log("RESPONSE DATA", err.response.data);
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

  // Note - Add artcollection choices (and input field)

  return (
    <main>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label htmlFor="image-upload">Image:</Form.Label>
          <Form.Control
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleChangeImage}
            ref={imageInput}
          />
        </Form.Group>
        {errors.image?.map((message, idx) => (
          <p key={idx}>{message}</p>
        ))}

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

        <Button>cancel</Button>
        <Button type="submit">create</Button>
        {errors.non_field_errors?.map((message, idx) => (
          <p key={idx}>{message}</p>
        ))}
      </Form>
    </main>
  );
};

export default CreateArtpiecePage;
