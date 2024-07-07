import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Form, Button } from "react-bootstrap";
import axios from "axios";

const SignInForm = () => {
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
      await axios.post("/dj-rest-auth/login/", signInData);
      navigate("/");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };
  return (
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
      <Button variant="primary" type="submit">
        Sign In
      </Button>
      {errors.non_field_errors?.map((message, idx) => (
        <p key={idx}>{message}</p>
      ))}
    </Form>
  );
};

export default SignInForm;
