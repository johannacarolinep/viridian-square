import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useRedirect } from "../../hooks/useRedirect";

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
      const { data } = await axios.post(
        "/dj-rest-auth/registration/",
        signUpData
      );
      console.log("data", data);
      navigate("/signin");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };
  return (
    <main>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={email}
            onChange={handleChange}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else without your express
            permission.
          </Form.Text>
        </Form.Group>
        {errors.email?.map((message, idx) => (
          <p key={idx}>{message}</p>
        ))}

        <Form.Group className="mb-3" controlId="password1">
          <Form.Label>Password</Form.Label>
          <Form.Control
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
          <Form.Label>Password again</Form.Label>
          <Form.Control
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
        <Button variant="primary" type="submit">
          Sign Up
        </Button>
        {errors.non_field_errors?.map((message, idx) => (
          <p key={idx}>{message}</p>
        ))}
      </Form>
    </main>
  );
};

export default SignUpForm;
