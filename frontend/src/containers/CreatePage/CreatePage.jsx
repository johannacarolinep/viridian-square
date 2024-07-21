import React from "react";
import { Link } from "react-router-dom";
import { useRedirect } from "../../hooks/useRedirect";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Frame from "../../assets/images/frame.webp";
import Collection from "../../assets/images/collection.webp";
import appStyles from "../../App.module.css";
import styles from "./CreatePage.module.css";

/**
 * CreatePage Component
 *
 * The CreatePage component provides users with options to create new art pieces or collections.
 * It displays two link cards, each leading to a respective creation page.
 *
 * Features:
 * - Redirects logged-out users to the home page using the useRedirect hook.
 * - Displays two link cards: one for creating a new art piece and one for creating a new collection.
 * - Uses Bootstrap's grid system to arrange the link cards responsively.
 *
 * Hooks:
 * - useRedirect: Redirects logged-out users to the specified route.
 *
 * @returns {JSX.Element} The CreatePage component.
 */
const CreatePage = () => {
  useRedirect("loggedOut", "/");

  return (
    <main className={`d-flex align-items-center ${appStyles.bgWhite}`}>
      <Container fluid="xl">
        <Row className={"g-3 g-md-0 m-0 my-2 my-md-4"}>
          <Col xs={12} md={6} className={"h-100 d-flex justify-content-center"}>
            <Link to="/create-artpiece" className={styles.LinkCard}>
              <div className={`${styles.ImgContainer}`}>
                <Image
                  src={Frame}
                  alt="One frame, symbolising option to create an artpiece"
                />
              </div>
              <div className="fs-3 mt-3 fw-bold">New artpiece</div>
            </Link>
          </Col>
          <Col xs={12} md={6} className={"h-100 d-flex justify-content-center"}>
            <Link to="/create-collection" className={styles.LinkCard}>
              <div className={`${styles.ImgContainer}`}>
                <Image
                  src={Collection}
                  alt="Several frames, symbolising option to create a collection"
                />
              </div>
              <div className="fs-3 mt-3 fw-bold">New collection</div>
            </Link>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default CreatePage;
