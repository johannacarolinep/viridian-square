import React, { useState, useEffect } from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";
import { Link } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Accordion from "react-bootstrap/Accordion";
import NoResults from "../../assets/images/noresults.webp";
import Asset from "../../components/asset/Asset";
import Avatar from "../../components/avatar/Avatar";
import appStyles from "../../App.module.css";
import styles from "./EnquiriesPage.module.css";
import NotFoundImg from "../../assets/images/notfound.webp";

/**
 * EnquiriesPage Component
 *
 * The EnquiriesPage component is responsible for displaying a list of enquiries made by the buyer or received from other buyers.
 * It provides functionality to view detailed information about each enquiry, respond to enquiries, and update enquiry statuses.
 *
 * Features:
 * - Redirect logged-out users to the home page using the useRedirect hook.
 * - Show detailed information about each enquiry, including the associated art piece and the user's response.
 * - Handle form submissions for responding to enquiries and updating their status.
 * - Indicate new or unchecked enquiries with badges.
 *
 * State:
 * - enquiries: Holds the list of enquiries fetched from the API.
 * - selectedEnquiry: Holds the currently selected enquiry for viewing details and responding.
 * - status: Holds the status of the selected enquiry (pending, accepted, declined).
 * - responseMessage: Holds the response message to be sent along with the status update.
 * - hasLoaded: Indicates whether the enquiries data has finished loading.
 * - artpieceHasLoaded: Indicates whether the art piece data for the selected enquiry has finished loading.
 * - artpiece: Holds the art piece data associated with the selected enquiry.
 * - errors: Stores any validation or submission errors for the response form.
 * - activeAccordion: Keeps track of the currently active accordion panel.
 *
 * Hooks:
 * - useCurrentUser: Retrieves the current user's information.
 * - useRedirect: Redirects logged-out users to the specified route.
 * - useState: Manages the component's local state.
 * - useEffect: Fetches data when the component mounts or when dependencies change.
 *
 * API Calls:
 * - axiosReq.get("/enquiries/"): Fetches the list of enquiries.
 * - axiosReq.get(`/artpieces/${selectedEnquiry.artpiece}/`): Fetches the art piece data for the selected enquiry.
 * - axiosReq.put(`/enquiries/${selectedEnquiry.id}/`): Updates the status and response message of the selected enquiry.
 *
 * @returns {JSX.Element} The EnquiriesPage component.
 */

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
  const [activeAccordion, setActiveAccordion] = useState(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const { data } = await axiosReq.get("/enquiries/");
        setEnquiries(data.results);
        setHasLoaded(true);
      } catch (error) {
        // console.error("Error fetching enquiries:", error);
      }
    };

    fetchEnquiries();
    setHasLoaded(false);
  }, [currentUser]);

  useEffect(() => {
    const fetchArtpiece = async () => {
      if (selectedEnquiry) {
        try {
          const { data } = await axiosReq.get(
            `/artpieces/${selectedEnquiry.artpiece}/`
          );
          setArtpiece(data);
          setArtpieceHasLoaded(true);
        } catch (err) {
          // Ignoring the error intentionally
        }
      }
    };

    fetchArtpiece();
    setArtpieceHasLoaded(false);
  }, [selectedEnquiry]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (selectedEnquiry) {
      try {
        await axiosReq.put(`/enquiries/${selectedEnquiry.id}/`, {
          status: parseInt(status),
          response_message: responseMessage,
        });

        setEnquiries((prevEnquiries) =>
          prevEnquiries.map((enquiry) =>
            enquiry.id === selectedEnquiry.id
              ? {
                  ...enquiry,
                  status: parseInt(status),
                  response_message: responseMessage,
                }
              : enquiry
          )
        );
      } catch (err) {
        setErrors(err.response?.data);
      }
    }
  };

  const handleClick = async (enquiry) => {
    setSelectedEnquiry(enquiry);
    try {
      if (
        (enquiry.is_buyer && !enquiry.buyer_has_checked) ||
        (enquiry.is_artist && !enquiry.artist_has_checked)
      ) {
        const { data } = await axiosReq.get(`/enquiries/${enquiry.id}/`);
        setEnquiries((prevEnquiries) =>
          prevEnquiries.map((e) =>
            e.id === enquiry.id
              ? {
                  ...e,
                  buyer_has_checked: data.buyer_has_checked,
                  artist_has_checked: data.artist_has_checked,
                }
              : e
          )
        );
      }
    } catch (err) {
      // Ignoring the error intentionally
    }
  };

  return (
    <main>
      <section
        className={`${appStyles.bgAccentDark} ${styles.HeroSection} fs-1`}
      >
        <h1 className={"fw-bold mb-0"}>Your enquiries </h1>
        <i
          className={`fa-regular fa-envelope ${appStyles.txtWhite} ${appStyles.txtLarger}`}
        ></i>
      </section>
      <Container fluid="xl" className={`${appStyles.bgAccentLight} my-3 p-3`}>
        <div className={`${appStyles.bgWhite} p-2`}>
          {hasLoaded ? (
            <>
              {enquiries.length > 0 ? (
                <Accordion
                  defaultActiveKey=""
                  activeKey={activeAccordion}
                  onSelect={(eventKey) => setActiveAccordion(eventKey)}
                >
                  {enquiries.map((enquiry) => (
                    <Accordion.Item eventKey={enquiry.id} key={enquiry.id}>
                      {enquiry.artpiece && enquiry.buyer_profile_id ? (
                        <>
                          <Accordion.Header
                            onClick={() => handleClick(enquiry)}
                          >
                            <span className="ms-2 me-3 w-100 d-flex justify-content-between">
                              <span
                                className={`${
                                  (enquiry.is_buyer &&
                                    !enquiry.buyer_has_checked) ||
                                  (enquiry.is_artist &&
                                    !enquiry.artist_has_checked)
                                    ? "fw-bold"
                                    : ""
                                }`}
                              >
                                <span className="me-2">
                                  {currentUser.profile_name ===
                                  enquiry.buyer_name ? (
                                    <>Enquiry sent to: {enquiry.artist_name}</>
                                  ) : (
                                    <>
                                      Enquiry received from:{" "}
                                      {enquiry.buyer_name}
                                    </>
                                  )}
                                </span>
                                {enquiry.status === 0 ? (
                                  <Badge bg="warning" text="dark" pill>
                                    Pending
                                  </Badge>
                                ) : enquiry.status === 1 ? (
                                  <Badge
                                    bg=""
                                    className={appStyles.bgPrimary}
                                    pill
                                  >
                                    Accepted
                                  </Badge>
                                ) : (
                                  <Badge bg="dark" pill>
                                    Declined
                                  </Badge>
                                )}
                                <br />
                                Date: {enquiry.created_on}
                              </span>
                              {((enquiry.is_buyer &&
                                !enquiry.buyer_has_checked) ||
                                (enquiry.is_artist &&
                                  !enquiry.artist_has_checked)) && (
                                <span className="d-flex align-items-center">
                                  <Badge
                                    bg=""
                                    pill
                                    className={`ms-auto ${appStyles.bgPrimary}`}
                                  >
                                    New
                                  </Badge>
                                </span>
                              )}
                            </span>
                          </Accordion.Header>
                          <Accordion.Body>
                            {selectedEnquiry?.id === enquiry.id && (
                              <>
                                <Row className={`${appStyles.bgLight} p-3 m-0`}>
                                  <Col
                                    sm={12}
                                    md={7}
                                    lg={8}
                                    className={"d-flex flex-column"}
                                  >
                                    <p className={"fw-bold"}>
                                      Enquiry by{" "}
                                      {enquiry.is_buyer ? (
                                        <span>You</span>
                                      ) : (
                                        <Link
                                          to={`/profiles/${enquiry.buyer_profile_id}`}
                                          className={`${appStyles.txtPrimary}`}
                                          aria-label={`Go to ${enquiry.buyer_name}'s profile`}
                                        >
                                          {enquiry.buyer_name}
                                        </Link>
                                      )}
                                    </p>
                                    <div
                                      className={`${appStyles.bgWhite} p-3 h-100`}
                                    >
                                      <Avatar
                                        src={enquiry.buyer_profile_image}
                                        height={40}
                                      />
                                      {enquiry.is_buyer ? (
                                        <span>You said:</span>
                                      ) : (
                                        <span>{enquiry.buyer_name} said:</span>
                                      )}
                                      <p
                                        className={`mt-3 ${appStyles.txtAccentDark}`}
                                      >
                                        {enquiry.initial_message}
                                      </p>
                                      <p className={appStyles.txtAccentDark}>
                                        Sent: {enquiry.created_on}
                                      </p>
                                    </div>
                                  </Col>
                                  <Col sm={12} md={5} lg={4}>
                                    <div
                                      className={`p-3 h-100 d-flex flex-column ${appStyles.bgWhite}`}
                                    >
                                      {artpieceHasLoaded ? (
                                        <div
                                          className={`h-100 p-2 d-flex flex-column ${appStyles.bgAccentLight}`}
                                        >
                                          <div
                                            className={`${appStyles.bgAccentLight} ${styles.ImgContainer} mb-1`}
                                          >
                                            <Image
                                              src={artpiece.image_url}
                                              alt={`The artpiece for which the enquiry was made, ${artpiece.title}`}
                                              onError={(e) => {
                                                e.target.src = NotFoundImg;
                                              }}
                                            />
                                          </div>
                                          <p className="mb-0">
                                            <span className="fw-bold">
                                              Title:
                                            </span>{" "}
                                            {artpiece.title}
                                            {artpiece.art_medium && (
                                              <>
                                                <br />
                                                <span className="fw-bold">
                                                  Medium:
                                                </span>{" "}
                                                {artpiece.art_medium}
                                              </>
                                            )}
                                          </p>
                                          <div>
                                            <span className="fw-bold">
                                              By:{" "}
                                            </span>
                                            <Link
                                              className={appStyles.LinkStandard}
                                              aria-label={`Go to ${artpiece.profile}'s name`}
                                            >
                                              {artpiece.profile_name}
                                            </Link>
                                          </div>
                                        </div>
                                      ) : (
                                        <Asset spinner />
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                                <Row
                                  className={`${appStyles.bgLight} p-3 m-0 mt-2`}
                                >
                                  {enquiry.is_buyer && enquiry.status === 0 ? (
                                    <p className="fw-bold text-center my-3">
                                      The artist has not yet responded to your
                                      enquiry:
                                    </p>
                                  ) : enquiry.is_buyer &&
                                    enquiry.status !== 0 ? (
                                    <div>
                                      <Avatar
                                        src={enquiry.artist_profile_image}
                                      />
                                      <Link
                                        to={`/profiles/${enquiry.artist_profile_id}`}
                                        className={appStyles.txtPrimary}
                                        aria-label={`Go to ${enquiry.artist_name}'s profile page`}
                                      >
                                        {enquiry.artist_name}
                                      </Link>{" "}
                                      has responded to your enquiry:
                                      {enquiry.response_message && (
                                        <div
                                          className={`${appStyles.bgWhite} p-3 mt-3 ${appStyles.txtAccentDark}`}
                                        >
                                          <p className="m-0">
                                            {enquiry.response_message}
                                          </p>
                                        </div>
                                      )}
                                      {enquiry.status === 1 ? (
                                        <p className="mt-3">
                                          The artist has{" "}
                                          <span
                                            className={`fw-bold ${appStyles.txtPrimary} ${appStyles.txtLarger}`}
                                          >
                                            accepted
                                          </span>{" "}
                                          your enquiry. Their email is:{" "}
                                          <span
                                            className={`fw-bold ${appStyles.txtPrimary} ${appStyles.txtLarger}`}
                                          >
                                            {enquiry.artist_email}
                                          </span>
                                        </p>
                                      ) : (
                                        <p>
                                          Unfortunately, the artist has{" "}
                                          <span className="fw-bold">
                                            declined
                                          </span>{" "}
                                          your enquiry.
                                        </p>
                                      )}
                                    </div>
                                  ) : enquiry.is_artist &&
                                    enquiry.status !== 0 ? (
                                    <div>
                                      <Avatar
                                        src={enquiry.artist_profile_image}
                                      />
                                      You{" "}
                                      {enquiry.status === 1 ? (
                                        <span className="fw-bold">
                                          accepted
                                        </span>
                                      ) : enquiry.status === 2 ? (
                                        <span className="fw-bold">
                                          declined
                                        </span>
                                      ) : (
                                        ""
                                      )}{" "}
                                      <Link
                                        to={`/profiles/${enquiry.buyer_profile_id}`}
                                        className={`${appStyles.txtPrimary}`}
                                        aria-label={`Go to ${enquiry.buyer_name}'s profile page`}
                                      >
                                        {enquiry.buyer_name}&apos;s
                                      </Link>{" "}
                                      enquiry.
                                      {enquiry.response_message && (
                                        <div
                                          className={`${appStyles.bgWhite} p-3 my-3 ${appStyles.txtAccentDark}`}
                                        >
                                          <p className="m-0">
                                            <span className="fw-bold">
                                              You responded:{" "}
                                            </span>
                                            {enquiry.response_message}
                                          </p>
                                        </div>
                                      )}
                                      {enquiry.status === 1 ? (
                                        <p>
                                          Your email address,{" "}
                                          <span className="fw-bold">
                                            {currentUser?.email}
                                          </span>
                                          , has been shared with{" "}
                                          {enquiry.buyer_name}
                                        </p>
                                      ) : (
                                        <p>
                                          Your email address will not be shared
                                          with {enquiry.buyer_name}.
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <div>
                                      <p className="fw-bold">
                                        Respond to this enquiry:
                                      </p>
                                      <Form onSubmit={handleFormSubmit}>
                                        <Form.Group
                                          className="mb-3"
                                          controlId="statusSelect"
                                        >
                                          <Form.Label>
                                            Select Decision:
                                          </Form.Label>
                                          <p>
                                            If you accept the enquiry, your
                                            email address,{" "}
                                            <span className="fw-bold">
                                              {currentUser?.email}
                                            </span>
                                            , will be shared with{" "}
                                            <span className="fw-bold">
                                              {enquiry.buyer_name}
                                            </span>
                                          </p>
                                          <Form.Select
                                            aria-label="Select a decision"
                                            name="status"
                                            value={status}
                                            onChange={(e) =>
                                              setStatus(e.target.value)
                                            }
                                          >
                                            <option>
                                              Open this select menu
                                            </option>
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
                                          <Form.Label>
                                            Do you wish to pass along a message?
                                          </Form.Label>
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
                                        {errors.response_message?.map(
                                          (message, idx) => (
                                            <p key={idx}>{message}</p>
                                          )
                                        )}
                                        <Button
                                          className={appStyles.btnPrimary}
                                          type="submit"
                                          aria-label="Submit enquiry response"
                                        >
                                          Send
                                        </Button>
                                        {errors.non_field_errors?.map(
                                          (message, idx) => (
                                            <p key={idx}>{message}</p>
                                          )
                                        )}
                                      </Form>
                                    </div>
                                  )}
                                </Row>
                              </>
                            )}
                          </Accordion.Body>
                        </>
                      ) : (
                        <>
                          <Accordion.Header>
                            <div className={`${appStyles.txtInactive} ms-2`}>
                              Enquiry inactive: Artpiece or enquirer no longer
                              exists
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            <Row className={`${appStyles.bgLight} p-3 m-0`}>
                              {!enquiry.artpiece ? (
                                <p className="my-2">
                                  The artpiece for which this enquiry was made
                                  no longer exists.
                                </p>
                              ) : (
                                <p className="my-2">
                                  The user who opened this enquiry is no longer
                                  active on the platform.
                                </p>
                              )}
                            </Row>
                          </Accordion.Body>
                        </>
                      )}
                    </Accordion.Item>
                  ))}
                </Accordion>
              ) : (
                <Asset
                  src={NoResults}
                  message={"You have not received/sent any enquiries"}
                />
              )}
            </>
          ) : (
            <Asset spinner />
          )}
        </div>
      </Container>
    </main>
  );
};

export default EnquiriesPage;
