import React, { useEffect, useState } from "react";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";
import { useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import appStyles from "../../App.module.css";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import { removeTokenTimestamp } from "../../utils/utils";
import { useRedirect } from "../../hooks/useRedirect";
import styles from "./AccountPage.module.css";

/**
 * AccountPage Container
 *
 * The AccountPage container provides a user interface for managing account-related actions such as updating email,
 * changing password, and deleting the account. It uses various hooks and components from React and Bootstrap to handle
 * state management, form submissions, and UI rendering.
 *
 * Features:
 * - Display current user's email and allow them to update it.
 * - Provide forms for changing the user's password.
 * - Enable users to delete their accounts.
 * - Show success messages and handle form errors.
 * - Use accordion panels to organize the different account actions.
 * - Redirect logged-out users to the home page.
 *
 * State:
 * - userData: Holds the user's email, current email, new password, and current password.
 * - errors: Stores any validation or submission errors for the forms.
 * - successMessage: Displays a success message when an action is successfully completed.
 * - activeAccordion: Keeps track of the currently active accordion panel.
 *
 * Hooks:
 * - useRedirect: Redirects users if they are logged out.
 * - useCurrentUser: Retrieves the current user's information.
 * - useSetCurrentUser: Updates the current user's information.
 * - useNavigate: Navigates to different routes.
 *
 * API Calls:
 * - axiosRes.put("/update-email/"): Updates the user's email.
 * - axiosRes.post("/dj-rest-auth/password/change/"): Changes the user's password.
 * - axiosReq.request({ method: "delete", url: "/delete-user/", data: { password } }): Deletes the user's account.
 *
 * @returns {JSX.Element} The AccountPage component.
 */
const AccountPage = () => {
  useRedirect("loggedOut", "/");
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    current_email: "",
    new_password1: "",
    new_password2: "",
    password: "",
  });

  const { email, current_email, new_password1, new_password2, password } =
    userData;
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [activeAccordion, setActiveAccordion] = useState(null);

  useEffect(() => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      email: currentUser?.email,
      current_email: currentUser?.email,
    }));
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
      setSuccessMessage("Email successfully updated.");
      setActiveAccordion(null);
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
      setSuccessMessage("Password successfully updated.");
      setActiveAccordion(null);
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

      setCurrentUser(null);
      removeTokenTimestamp();

      setSuccessMessage(
        "Account deleted successfully. You will be redirected shortly."
      );
      setActiveAccordion(null);
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (err) {
      // console.log(err);
      setErrors(err.response?.data);
    }
  };

  return (
    <main className={`${appStyles.bgPrimary}`}>
      <Container fluid="xl">
        <div className={`${appStyles.bgAccentLight} p-3 my-4 mx-3 rounded`}>
          <h1>Account center</h1>
          <p>
            You are logged in as{" "}
            <span className="fw-bold">{current_email}</span>
          </p>
          {successMessage && (
            <p className="text-success fw-bolder">{successMessage}</p>
          )}
          <Accordion
            defaultActiveKey=""
            activeKey={activeAccordion}
            onSelect={(eventKey) => setActiveAccordion(eventKey)}
          >
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <span className={`${styles.Heading} fs-3 my-1`}>
                  Change email address:
                </span>
              </Accordion.Header>
              <Accordion.Body>
                <Form onSubmit={handleEmailSubmit}>
                  <Form.Group controlId="formEmail">
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
                  <Button
                    className={`my-3 me-3 ${appStyles.btnPrimary}`}
                    type="submit"
                    aria-label="Submit form to update email"
                  >
                    Update
                  </Button>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <span className={`${styles.Heading} fs-3 my-1`}>
                  Change password:
                </span>
              </Accordion.Header>
              <Accordion.Body>
                <Form onSubmit={handlePasswordSubmit}>
                  <Form.Group controlId="newPassword">
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

                  <Form.Group controlId="confirmPassword">
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
                  <Button
                    className={`my-3 me-3 ${appStyles.btnPrimary}`}
                    type="submit"
                    aria-label="Submit form to update password"
                  >
                    Update password
                  </Button>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                <span className={`${styles.Heading} fs-3 my-1`}>
                  Delete account:
                </span>
              </Accordion.Header>
              <Accordion.Body>
                <Form onSubmit={handleAccountDelete}>
                  <Form.Group controlId="formPassword">
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
                  <Button
                    className={`my-3 me-3 ${appStyles.btnPrimary}`}
                    type="submit"
                    aria-label="Submit form to delete the account permanently."
                  >
                    Delete account
                  </Button>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </Container>
    </main>
  );
};

export default AccountPage;
