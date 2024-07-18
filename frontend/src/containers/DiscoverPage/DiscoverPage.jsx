import React from "react";
import Discover from "../../components/discover/Discover";
import appStyles from "../../App.module.css";
import styles from "./DiscoverPage.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import TrendingDisplay from "../../components/trending_display/TrendingDisplay";

const DiscoverPage = () => {
  const currentUser = useCurrentUser();
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
                >
                  Sign In
                </Link>
                <Link
                  className={`${appStyles.btnPrimary} ${appStyles.linkBtn} rounded`}
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
          <h2>Trending:</h2>
          <Row xs={2} md={4} className="m-0 py-3 g-2">
            <TrendingDisplay />
          </Row>
        </Container>
      </section>
      <Discover />
    </main>
  );
};

export default DiscoverPage;
