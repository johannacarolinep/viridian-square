import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { Button, Form, Image } from "react-bootstrap";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const EditArtpiecePage = () => {
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
        console.log(err);
      }
    };

    handleMount();
  }, [id, navigate]);

  useEffect(() => {
    console.log("Image ", image);
    console.log("Image URL ", image_url);
  }, [image]);

  const handleChange = (event) => {
    setArtpieceData({
      ...artpieceData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    console.log("files", event.target.files);
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
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label htmlFor="image-upload">Image:</Form.Label>
          {image ? (
            <Image src={image} rounded />
          ) : (
            <Image src={image_url} rounded />
          )}

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

        <Button>Cancel</Button>
        <Button type="submit">Update</Button>
        {errors.non_field_errors?.map((message, idx) => (
          <p key={idx}>{message}</p>
        ))}
      </Form>
    </main>
  );
};

export default EditArtpiecePage;
