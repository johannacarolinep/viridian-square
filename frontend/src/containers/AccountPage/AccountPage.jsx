import React, { useEffect, useState } from "react";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";
import { useNavigate } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import appStyles from "../../App.module.css";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import { removeTokenTimestamp } from "../../utils/utils";
import axios from "axios";

const AccountPage = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    new_password1: "",
    new_password2: "",
    password: "",
  });

  const { email, new_password1, new_password2, password } = userData;
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

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.post("/dj-rest-auth/password/change/", {
        new_password1,
        new_password2,
      });
    } catch (err) {
      //   console.log(err);
      setErrors(err.response?.data);
    }
  };

  const handleAccountDelete = async (event) => {
    event.preventDefault();

    try {
      await axiosReq.request({
        method: "delete",
        url: "/delete-user/",
        data: { password },
      });

      // Clear client state
      setCurrentUser(null);
      removeTokenTimestamp();
      navigate("/");
    } catch (err) {
      console.log("Error during account deletion:", err);
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

        <Form onSubmit={handlePasswordSubmit}>
          <h2>Change password:</h2>
          <Form.Group>
            <Form.Label>New password:</Form.Label>
            <Form.Control
              type="password"
              name="new_password1"
              value={new_password1}
              onChange={handleChange}
            />
          </Form.Group>
          {errors.new_password1?.map((message, idx) => (
            <p key={idx}>{message}</p>
          ))}

          <Form.Group>
            <Form.Label>Confirm new password:</Form.Label>
            <Form.Control
              type="password"
              name="new_password2"
              value={new_password2}
              onChange={handleChange}
            />
          </Form.Group>
          {errors.new_password2?.map((message, idx) => (
            <p key={idx}>{message}</p>
          ))}
          <Button className={`my-3 me-3 ${appStyles.btnPrimary}`} type="submit">
            Update password
          </Button>
        </Form>

        <Form onSubmit={handleAccountDelete}>
          <h2>Delete account:</h2>
          <Form.Group>
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </Form.Group>
          {errors.password?.map((message, idx) => (
            <p key={idx}>{message}</p>
          ))}
          <Button className={`my-3 me-3 ${appStyles.btnPrimary}`} type="submit">
            Delete account
          </Button>
        </Form>
      </Container>
    </main>
  );
};

export default AccountPage;
