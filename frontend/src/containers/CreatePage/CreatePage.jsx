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

const CreatePage = () => {
  useRedirect("loggedOut", "/");

  return (
    <main className={`d-flex align-items-center ${appStyles.bgWhite}`}>
      <Container fluid="xl">
        <Row className={`g-3 g-md-0 m-0 my-2 my-md-4`}>
          <Col xs={12} md={6} className={`h-100 d-flex justify-content-center`}>
            <Link to="/create-artpiece" className={styles.LinkCard}>
              <div className={`${styles.ImgContainer}`}>
                <Image src={Frame} />
              </div>
              <div className="fs-3 mt-3 fw-bold">New artpiece</div>
            </Link>
          </Col>
          <Col xs={12} md={6} className={`h-100 d-flex justify-content-center`}>
            <Link to="/create-collection" className={styles.LinkCard}>
              <div className={`${styles.ImgContainer}`}>
                <Image src={Collection} />
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
