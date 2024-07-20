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
import styles from "./EditProfilePage.module.css";

const EditProfilePage = () => {
  useRedirect("loggedOut", "/");
  const navigate = useNavigate();
  const { id } = useParams();
  const [profileData, setProfileData] = useState({
    name: "",
    description: "",
    location: "",
    profile_image: "",
    profile_image_url: "",
  });

  const { name, description, profile_image, profile_image_url, location } =
    profileData;

  const [errors, setErrors] = useState({});
  const imageInput = useRef(null);

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/profiles/${id}/`);
        const { is_owner, name, description, profile_image_url, location } =
          data;

        is_owner
          ? setProfileData({
              name,
              description,
              profile_image_url,
              location,
            })
          : navigate("/");
      } catch (err) {
        // console.log(err);
      }
    };

    handleMount();
  }, [id, navigate]);

  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(profile_image);
      setProfileData({
        ...profileData,
        profile_image: URL.createObjectURL(event.target.files[0]),
      });
    } else {
      setProfileData({
        ...profileData,
        profile_image: null,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("location", location);

    if (imageInput?.current?.files[0]) {
      formData.append("profile_image", imageInput.current.files[0]);
    }

    try {
      await axiosReq.put(`/profiles/${id}/`, formData);
      navigate(`/profiles/${id}`);
    } catch (err) {
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  return (
    <main>
      <Container fluid="xl">
        <h1 className="my-3">Edit profile:</h1>
        <Form onSubmit={handleSubmit} className="my-3">
          <Row className="m-0">
            <Col lg={6} className={appStyles.bgAccentLight}>
              <Form.Group controlId="image-upload">
                <div className={`${appStyles.bgAccentLight} p-4`}>
                  <Form.Label htmlFor="image-upload" className="mb-0">
                    <h2>Profile image:</h2>
                  </Form.Label>
                  <div className={`${appStyles.dividerPrimary} mb-3`}></div>
                  <div
                    className={`${appStyles.ImageContain} ${styles.ImageUpload}`}
                  >
                    {profile_image ? (
                      <Image
                        src={profile_image}
                        rounded
                        alt="Your new profile image"
                      />
                    ) : (
                      <Image
                        src={profile_image_url}
                        rounded
                        alt="Your existing profile image"
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
                  {errors.profile_image?.map((message, idx) => (
                    <p key={idx}>{message}</p>
                  ))}
                </div>
              </Form.Group>
            </Col>
            <Col lg={6} className={appStyles.bgWhite}>
              <div className={`${appStyles.bgWhite} p-4`}>
                <h2>Details:</h2>
                <div className={`${appStyles.dividerPrimary} mb-3`}></div>
                <Form.Group controlId="profileName">
                  <Form.Label htmlFor="profileName">Name:</Form.Label>
                  <Form.Control
                    id="profileName"
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                  />
                </Form.Group>
                {errors.name?.map((message, idx) => (
                  <p key={idx}>{message}</p>
                ))}

                <Form.Group controlId="descr">
                  <Form.Label htmlFor="descr">Description</Form.Label>
                  <Form.Control
                    id="descr"
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

                <Form.Group controlId="location">
                  <Form.Label htmlFor="location">Location:</Form.Label>
                  <Form.Control
                    id="location"
                    type="text"
                    name="location"
                    value={location}
                    onChange={handleChange}
                  />
                </Form.Group>
                {errors.location?.map((message, idx) => (
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
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </main>
  );
};

export default EditProfilePage;
