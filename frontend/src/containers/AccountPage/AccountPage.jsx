import React, { useEffect, useState } from "react";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";
import { useNavigate } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import appStyles from "../../App.module.css";
import { axiosRes } from "../../api/axiosDefaults";

const AccountPage = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    new_password1: "",
    new_password2: "",
    old_password: "",
  });

  const { email } = userData;
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleMount = async () => {
      if (currentUser) {
        setUserData({
          ...userData,
          email: currentUser.email,
        });
      } else {
        navigate("/signin");
      }
    };

    handleMount();
  }, [currentUser, navigate]);

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put("/update-email/", {
        email,
      });
      setCurrentUser((prevUser) => ({
        ...prevUser,
        email,
      }));
    } catch (err) {
      //   console.log(err);
      setErrors(err.response?.data);
    }
  };

  return (
    <main>
      <Container fluid="xl">
        <h1>Account center</h1>
        <Form onSubmit={handleEmailSubmit}>
          <h2>Change email address:</h2>
          <Form.Group>
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="text"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </Form.Group>
          {errors.email?.map((message, idx) => (
            <p key={idx}>{message}</p>
          ))}
          <Button className={`my-3 me-3 ${appStyles.btnPrimary}`} type="submit">
            Update
          </Button>
        </Form>
        AccountPage
      </Container>
    </main>
  );
};

export default AccountPage;
