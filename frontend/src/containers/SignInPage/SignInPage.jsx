import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Image } from "react-bootstrap";
import axios from "axios";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { setTokenTimestamp } from "../../utils/utils";
import { useRedirect } from "../../hooks/useRedirect";
import appStyles from "../../App.module.css";
import styles from "./SignInPage.module.css";
import SignIn from "../../assets/images/signin.webp";

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
                <Form.Label>Email address</Form.Label>
                <Form.Control
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
                <Form.Label>Password</Form.Label>
                <Form.Control
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
                <Image src={SignIn} />
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </main>
  );
};

export default SignInForm;
