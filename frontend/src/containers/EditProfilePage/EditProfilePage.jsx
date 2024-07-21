import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import appStyles from "../../App.module.css";
import styles from "./EditProfilePage.module.css";
import Asset from "../../components/asset/Asset";
import ImageHolder from "../../components/image_holder/ImageHolder";

/**
 * EditProfilePage Component
 *
 * The EditProfilePage component allows a user to edit their profile information including name, description, location,
 * and profile image. It fetches the current profile data on mount and populates the form with existing values.
 *
 * Features:
 * - Redirect logged-out users to the home page using the useRedirect hook.
 * - Fetch and display the current profile information.
 * - Provide form fields for editing the profile name, description, location, and profile image.
 * - Handle form input changes and form submission to update the profile.
 * - Display validation errors returned from the backend API.
 *
 * State:
 * - profileData: Holds the current values for name, description, location, profile image, and profile image URL.
 * - errors: Stores any validation or submission errors for the form.
 *
 * Hooks:
 * - useRedirect: Redirects logged-out users to the specified route.
 * - useNavigate: Allows navigation to different routes.
 * - useParams: Retrieves the profile ID from the URL parameters.
 * - useState: Manages the component's local state.
 * - useEffect: Fetches profile data when the component mounts.
 *
 * API Calls:
 * - axiosReq.get(`/profiles/${id}/`): Fetches the current profile data.
 * - axiosReq.put(`/profiles/${id}/`): Submits the updated profile data to the backend API.
 *
 * @returns {JSX.Element} The EditProfilePage component.
 */
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
  const [hasLoaded, setHasLoaded] = useState(false);

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
        setHasLoaded(true);
      } catch (err) {
        // console.log(err);
      }
    };

    handleMount();
    setHasLoaded(false);
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
                  <h2>
                    <Form.Label className="mb-0">Profile image:</Form.Label>
                  </h2>
                  <div className={`${appStyles.dividerPrimary} mb-3`}></div>
                  <div>
                    <div className={`${styles.ImageUpload} my-3`}>
                      {hasLoaded ? (
                        <>
                          {profile_image ? (
                            <ImageHolder
                              round
                              src={profile_image}
                              alt="Your new profile image"
                            />
                          ) : (
                            <ImageHolder
                              round
                              src={profile_image_url}
                              alt="Your existing profile image"
                            />
                          )}
                        </>
                      ) : (
                        <Asset spinner />
                      )}
                    </div>
                  </div>

                  <Form.Control
                    type="file"
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
                  <Form.Label>Name:</Form.Label>
                  <Form.Control
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

                <Form.Group controlId="location">
                  <Form.Label>Location:</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={location}
                    onChange={handleChange}
                  />
                </Form.Group>
                {errors.location?.map((message, idx) => (
                  <p key={idx}>{message}</p>
                ))}
                <Button
                  className={"my-3 me-3"}
                  variant="secondary"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
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
