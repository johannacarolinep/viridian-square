import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRedirect } from "../../hooks/useRedirect";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import appStyles from "../../App.module.css";
import styles from "./SignUpPage.module.css";
import Napoleon from "../../assets/images/napoleon.webp";

/**
 * SignUpPage Container
 *
 * The SignUpForm container provides a user interface for creating a new account. It includes form fields for email and password,
 * and handles form submission to register a new user. If the user is already logged in, they are redirected to the home page.
 *
 * Features:
 * - Redirect logged-in users to the home page using the useRedirect hook.
 * - Display a signup form with fields for email, password, and password confirmation.
 * - Handle form input changes and submission.
 * - Display validation errors returned from the backend API.
 *
 * State:
 * - signUpData: Holds the email, password, and password confirmation input values.
 * - errors: Stores any validation or submission errors for the form.
 *
 * Hooks:
 * - useRedirect: Redirects logged-in users to the specified route.
 * - useState: Manages the component's local state.
 * - useNavigate: Allows navigation to different routes.
 *
 * API Calls:
 * - axios.post("/dj-rest-auth/registration/", signUpData): Submits the signup data to the backend API for user registration.
 *
 * @returns {JSX.Element} The SignUpForm component.
 */
const SignUpForm = () => {
  useRedirect("loggedIn", "/");
  const [signUpData, setSignUpData] = useState({
    email: "",
    password1: "",
    password2: "",
  });
  const { email, password1, password2 } = signUpData;

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/dj-rest-auth/registration/", signUpData);
      navigate("/signin");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };
  return (
    <main className="d-flex align-items-center">
      <Container fluid="xl" className="p-0 p-md-4 p-lg-5">
        <Form onSubmit={handleSubmit} className="my-md-3">
          <Row className={`${appStyles.bgWhite} p-4 m-0`}>
            <Col lg={6} className="h-100">
              <h1>Sign up:</h1>
              <div className={`${appStyles.dividerPrimary} mb-3`}></div>
              <Form.Group controlId="email">
                <Form.Label htmlFor="email">Email address</Form.Label>
                <Form.Control
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else without your
                  express permission.
                </Form.Text>
              </Form.Group>
              {errors.email?.map((message, idx) => (
                <p key={idx}>{message}</p>
              ))}

              <Form.Group className="mb-3" controlId="password1">
                <Form.Label htmlFor="password1">Password</Form.Label>
                <Form.Control
                  id="password1"
                  type="password"
                  placeholder="Password"
                  name="password1"
                  value={password1}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.password1?.map((message, idx) => (
                <p key={idx}>{message}</p>
              ))}
              <Form.Group className="mb-3" controlId="password2">
                <Form.Label htmlFor="password2">Password again</Form.Label>
                <Form.Control
                  id="password2"
                  type="password"
                  placeholder="Password"
                  name="password2"
                  value={password2}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.password2?.map((message, idx) => (
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
                Sign Up
              </Button>
              {errors.non_field_errors?.map((message, idx) => (
                <p key={idx}>{message}</p>
              ))}
            </Col>
            <Col
              lg={6}
              className={`d-flex align-items-center justify-content-center`}
            >
              <div className={`${styles.ImgContainer}`}>
                <Image
                  src={Napoleon}
                  alt="Oil painting of Napoleon on horseback"
                />
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </main>
  );
};

export default SignUpForm;
