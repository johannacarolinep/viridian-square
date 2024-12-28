import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useLocation } from "react-router-dom";
import Discover from "../../components/discover/Discover";
import TrendingDisplay from "../../components/trending_display/TrendingDisplay";
import UpdateProfileModal from "../../components/update_profile_modal/UpdateProfileModal";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import appStyles from "../../App.module.css";
import styles from "./DiscoverPage.module.css";

/**
 * DiscoverPage Container
 *
 * The component is responsible for displaying a main page where users can discover trending art pieces and artists.
 * If a newly registered user needs to complete their profile, a modal is displayed prompting them to do so.
 *
 * Features:
 * - Show trending art pieces and artists using the TrendingDisplay component.
 * - Use the Discover component to display a list of art pieces and artists for discovery.
 * - Display a modal for new users to complete their profile if required.
 *
 * State:
 * - showModal: Controls the visibility of the profile completion modal.
 *
 * Hooks:
 * - useCurrentUser: Retrieves the current user's information.
 * - useLocation: Accesses the location object to check for state passed through navigation.
 * - useEffect: Checks if the user needs to complete their profile name and sets the modal visibility accordingly.
 *
 * @returns {JSX.Element} The DiscoverPage component.
 */
const DiscoverPage = () => {
  const currentUser = useCurrentUser();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (
      location.state?.needsProfileCompletion &&
      currentUser?.profile_name.startsWith("newuser")
    ) {
      setShowModal(true);
    }
  }, [location.state, currentUser]);

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <main>
      {!currentUser && (
        <section>
          <Row
            className={`m-0 ${appStyles.bgWhite} ${styles.HeroSection} position-relative`}
          >
            <Col xs={8} md={8} lg={8} className={`${appStyles.bgDark}`}></Col>
            <div
              className={`${appStyles.bgWhite} ${styles.Overlay} px-3 py-5 text-center`}
            >
              <h1>
                Showcase your{" "}
                <span
                  className={`${appStyles.txtLarger} fw-bold ${appStyles.txtPrimary}`}
                >
                  art
                </span>
              </h1>
              <h2>Discover great artists</h2>
              <div className="fs-5 d-flex flex-wrap justify-content-center mt-3">
                <Link
                  className={`${appStyles.btnAccentLight} ${appStyles.linkBtn} rounded me-3`}
                  to="/signin"
                  aria-label="Go to the sign in page"
                >
                  Sign In
                </Link>
                <Link
                  className={`${appStyles.btnPrimary} ${appStyles.linkBtn} rounded`}
                  to="/signup"
                  aria-label="Go to the sign up page"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </Row>
        </section>
      )}
      <section className={appStyles.bgAccentLight}>
        <Container fluid="xl" className="py-4">
          <h2>!!Trending:</h2>
          <Row xs={1} md={2} lg={4} className="m-0 py-3 g-2">
            <TrendingDisplay />
          </Row>
        </Container>
      </section>
      <section>
        <Container fluid="xl" className="py-4">
          <h2 className="mb-0 mt-3">Discover great art and artists</h2>
          <Discover />
        </Container>
      </section>
      {location.state?.needsProfileCompletion &&
        currentUser?.profile_name.startsWith("newuser") && (
          <UpdateProfileModal
            show={showModal}
            handleClose={handleClose}
            user={currentUser}
          />
        )}
    </main>
  );
};

export default DiscoverPage;
