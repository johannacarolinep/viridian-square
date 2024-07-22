import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import appStyles from "../../App.module.css";
import styles from "./Footer.module.css";

/**
 * Footer component displays the footer of the website.
 *
 * Features:
 * - Shows copyright information and contact email.
 * - Includes links to the creator's Github and LinkedIn profiles with corresponding icons.
 */
const Footer = () => {
  return (
    <footer className={`${appStyles.bgDark} ${appStyles.txtWhite}`}>
      <Container fluid="xl" className={"py-3"}>
        <Row className="align-items-top">
          <Col xs={12} lg={9} className="text-center text-lg-start">
            <p>© Copyright 2024 Viridian Sq</p>
            <p>info@viridiansq.com</p>
          </Col>
          <Col lg className="text-center text-lg-end">
            <p>
              This project was created for educational purposes only by Johanna
              Petersson
            </p>
            <p className="fw-bold mb-0">Get in touch!</p>
            <a
              href="https://github.com/johannacarolinep"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit my Github page. Link will open in a new tab."
              className={`text-decoration-none ${appStyles.txtWhite} ${styles.Icon} fs-2 me-3`}
            >
              <i className="fa-brands fa-github"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/johannapetersson/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit my Linkedin profile. Link will open in a new tab."
              className={`text-decoration-none ${appStyles.txtWhite} fs-2 ${styles.Icon}`}
            >
              <i className="fa-brands fa-linkedin"></i>
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
