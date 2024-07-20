import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { setTokenTimestamp } from "../../utils/utils";
import { useRedirect } from "../../hooks/useRedirect";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import appStyles from "../../App.module.css";
import styles from "./SignInPage.module.css";
import SignIn from "../../assets/images/signin.webp";

/**
 * SignInPage Container
 *
 * The SignInPage container provides a user interface for logging into an existing account.
 * It includes form fields for email and password, and handles form submission to authenticate the user.
 * If the user is logged in, they are redirected to the home page.
 *
 * Features:
 * - Redirect logged-in users to the home page using the useRedirect hook.
 * - Display a sign-in form with fields for email and password.
 * - Handle form input changes and submission.
 * - Display validation errors returned from the backend API.
 * - Navigate to the home page or prompt the user to complete their profile if their profile name starts with "newuser".
 *
 * State:
 * - signInData: Holds the email and password input values.
 * - errors: Stores any validation or submission errors for the form.
 *
 * Hooks:
 * - useRedirect: Redirects logged-in users to the specified route.
 * - useState: Manages the component's local state.
 * - useNavigate: Allows navigation to different routes.
 * - useSetCurrentUser: Updates the current user's information in the context.
 *
 * API Calls:
 * - axios.post("/dj-rest-auth/login/", signInData): Submits the sign-in data to the backend API for user authentication.
 *
 * @returns {JSX.Element} The SignInForm component.
 */
const SignInForm = () => {
  useRedirect("loggedIn", "/");
  const setCurrentUser = useSetCurrentUser();

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = signInData;

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);
      setTokenTimestamp(data);
      if (data.user.profile_name.startsWith("newuser")) {
        navigate("/", { state: { needsProfileCompletion: true } });
      } else {
        navigate("/");
      }
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
              <h1>Sign in:</h1>
              <div className={`${appStyles.dividerPrimary} mb-3`}></div>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label htmlFor="email">Email address</Form.Label>
                <Form.Control
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.email?.map((message, idx) => (
                <p key={idx}>{message}</p>
              ))}

              <Form.Group className="mb-3" controlId="password">
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                  id="password"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.password?.map((message, idx) => (
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
                Sign In
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
                  src={SignIn}
                  alt="Oil painting of woman with two children, facing the viewer"
                />
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </main>
  );
};

export default SignInForm;
