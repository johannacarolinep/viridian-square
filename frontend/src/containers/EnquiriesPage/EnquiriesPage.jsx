import React, { useState, useEffect } from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import appStyles from "../../App.module.css";
import styles from "./EnquiriesPage.module.css";
import { axiosReq } from "../../api/axiosDefaults";
import {
  Badge,
  ListGroup,
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import { useRedirect } from "../../hooks/useRedirect";
import NoResults from "../../assets/images/noresults.webp";
import Asset from "../../components/asset/Asset";
import { Link } from "react-router-dom";
import Avatar from "../../components/avatar/Avatar";

const EnquiriesPage = () => {
  useRedirect("loggedOut", "/");
  const currentUser = useCurrentUser();
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [status, setStatus] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [artpieceHasLoaded, setArtpieceHasLoaded] = useState(false);
  const [artpiece, setArtpiece] = useState();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const { data } = await axiosReq.get("/enquiries/");
        setEnquiries(data.results);
        setHasLoaded(true);
      } catch (error) {
        console.error("Error fetching enquiries:", error);
      }
    };

    fetchEnquiries();
    setHasLoaded(false);
  }, [currentUser]);

  useEffect(() => {
    const fetchArtpiece = async () => {
      try {
        const { data } = await axiosReq.get(
          `/artpieces/${selectedEnquiry.artpiece}`
        );
        setArtpiece(data);
        setArtpieceHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    fetchArtpiece();
    setArtpieceHasLoaded(false);
  }, [selectedEnquiry]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    console.log("status", status);
    console.log("responseMessage", responseMessage);
    console.log("Enquiry ID ", selectedEnquiry.id);
    if (selectedEnquiry) {
      try {
        const response = await axiosReq.put(
          `/enquiries/${selectedEnquiry.id}/`,
          {
            status: parseInt(status),
            response_message: responseMessage,
          }
        );
        let tempId = selectedEnquiry.id;
        setSelectedEnquiry(null);

        setEnquiries((prevEnquiries) =>
          prevEnquiries.map((enquiry) =>
            enquiry.id === tempId
              ? {
                  ...enquiry,
                  status: parseInt(status),
                  response_message: responseMessage,
                }
              : enquiry
          )
        );
        console.log("response", response);
      } catch (err) {
        console.log("Error updating enquiry:", err);
        setErrors(err.response?.data);
      }
    }
  };

  const handleClick = async (enquiry) => {
    try {
      if (enquiry.is_buyer && !enquiry.buyer_has_checked) {
        await axiosReq.put(`/enquiries/${enquiry.artpiece}/`, {
          buyer_has_checked: true,
        });
        setEnquiries((prevEnquiries) =>
          prevEnquiries.map((e) =>
            e.id === enquiry.id ? { ...e, buyer_has_checked: true } : e
          )
        );
      } else if (enquiry.is_artist && !enquiry.artist_has_checked) {
        await axiosReq.put(`/enquiries/${enquiry.id}/`, {
          artist_has_checked: true,
        });
        setEnquiries((prevEnquiries) =>
          prevEnquiries.map((e) =>
            e.id === enquiry.id ? { ...e, artist_has_checked: true } : e
          )
        );
      }
    } catch (err) {
      console.error("Error updating enquiry:", err);
    }
    setSelectedEnquiry(enquiry);
    console.log("ENQUIRY", enquiry);
  };

  return (
    <main>
      <section
        className={`${appStyles.bgAccentDark} ${styles.HeroSection} fs-1`}
      >
        <h1 className={`fw-bold mb-0`}>Your enquiries </h1>
        <i
          className={`fa-regular fa-envelope ${appStyles.txtWhite} ${appStyles.txtLarger}`}
        ></i>
      </section>
      <Container fluid="xl" className={`${appStyles.bgAccentLight} my-3 p-3`}>
        <div className={`${appStyles.bgWhite} p-2`}>
          {enquiries.length > 0 ? (
            <ListGroup as="ol" numbered>
              {enquiries.map((enquiry) => (
                <>
                  <ListGroup.Item
                    as="li"
                    className={`${appStyles.enquiryItem} d-flex justify-content-between align-items-start`}
                    onClick={() => handleClick(enquiry)}
                    key={enquiry.id}
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">
                        {currentUser.profile_name === enquiry.buyer_name ? (
                          <>Enquiry sent to: {enquiry.artist_name}</>
                        ) : (
                          <>Enquiry received from: {enquiry.buyer_name}</>
                        )}
                      </div>
                      Date: {enquiry.created_on}
                    </div>
                    {(enquiry.is_buyer && !enquiry.buyer_has_checked) ||
                      (enquiry.is_artist && !enquiry.artist_has_checked && (
                        <Badge bg="" pill className={appStyles.bgPrimary}>
                          New
                        </Badge>
                      ))}
                  </ListGroup.Item>
                  {selectedEnquiry?.id === enquiry.id && (
                    <div className={`${appStyles.bgLight} p-3`}>
                      <Row>
                        <Col sm={12} md={7}>
                          <p className={`fw-bold`}>
                            Enquiry by{" "}
                            {enquiry.is_buyer ? (
                              <span>You</span>
                            ) : (
                              <Link
                                to={`/profiles/${enquiry.buyer_profile_id}`}
                              >
                                {enquiry.buyer_name}
                              </Link>
                            )}
                          </p>
                          <div>
                            <Avatar
                              src={enquiry.buyer_profile_image}
                              height={40}
                            />
                            {enquiry.is_buyer ? (
                              <span>You said:</span>
                            ) : (
                              <span>
                                <Link
                                  to={`/profiles/${enquiry.buyer_profile_id}`}
                                >
                                  {enquiry.buyer_name}
                                </Link>{" "}
                                said:
                              </span>
                            )}
                          </div>
                          <div className={`${appStyles.bgWhite}`}>
                            <p>{enquiry.initial_message}</p>
                            <p>Sent: {enquiry.created_on}</p>
                          </div>
                        </Col>
                        <Col>
                          {artpieceHasLoaded ? (
                            <div className={`p-3 ${appStyles.bgAccentLight}`}>
                              <div className={`${appStyles.ImageCover}`}>
                                <Image src={artpiece.image_url} />
                              </div>
                              <p>Title: {artpiece.title}</p>
                              {artpiece.art_medium && (
                                <p>Medium: {artpiece.art_medium}</p>
                              )}
                            </div>
                          ) : (
                            <Asset spinner />
                          )}
                        </Col>
                      </Row>
                      <Row>
                        {enquiry.is_buyer && enquiry.status === 0 ? (
                          <p>
                            You are the buyer and waiting for response from
                            artist
                          </p>
                        ) : enquiry.is_buyer && enquiry.status !== 0 ? (
                          <div>
                            The artist has responsed.
                            <p>Response: {enquiry.response_message}</p>
                            {enquiry.status === 1 ? (
                              <p>
                                The artist accepted. Their email is:{" "}
                                {enquiry.artist_email}
                              </p>
                            ) : (
                              <p>The artist declined.</p>
                            )}
                          </div>
                        ) : enquiry.is_artist && enquiry.status !== 0 ? (
                          <div>
                            <p>You responded: {enquiry.response_message} </p>
                            {enquiry.status === 1 ? (
                              <p>You accepted this enquiry</p>
                            ) : (
                              <p>You declined this enquiry</p>
                            )}
                          </div>
                        ) : (
                          <div>
                            <p>Respond to this enquiry:</p>
                            <Form onSubmit={handleFormSubmit}>
                              <Form.Group
                                className="mb-3"
                                controlId="statusSelect"
                              >
                                <Form.Label>Select Decision</Form.Label>
                                <Form.Select
                                  aria-label="Select a decision"
                                  name="status"
                                  value={status}
                                  onChange={(e) => setStatus(e.target.value)}
                                >
                                  <option>Open this select menu</option>
                                  <option value="1">Accept</option>
                                  <option value="2">Decline</option>
                                </Form.Select>
                              </Form.Group>
                              {errors.status?.map((message, idx) => (
                                <p key={idx}>{message}</p>
                              ))}
                              <Form.Group
                                className="mb-3"
                                controlId="responseTextarea"
                              >
                                <Form.Label>Response Message</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={3}
                                  name="response_message"
                                  value={responseMessage}
                                  onChange={(e) =>
                                    setResponseMessage(e.target.value)
                                  }
                                />
                              </Form.Group>
                              {errors.response_message?.map((message, idx) => (
                                <p key={idx}>{message}</p>
                              ))}
                              <Button variant="primary" type="submit">
                                Send
                              </Button>
                              {errors.non_field_errors?.map((message, idx) => (
                                <p key={idx}>{message}</p>
                              ))}
                            </Form>
                          </div>
                        )}
                      </Row>
                    </div>
                  )}
                </>
              ))}
            </ListGroup>
          ) : (
            <Asset src={NoResults} />
          )}
        </div>
      </Container>
    </main>
  );
};

export default EnquiriesPage;
