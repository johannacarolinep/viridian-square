import React from "react";
import Discover from "../../components/discover/Discover";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import appStyles from "../../App.module.css";
import styles from "./LikedPage.module.css";
import { useRedirect } from "../../hooks/useRedirect";
import { Container } from "react-bootstrap";

const LikedPage = () => {
  useRedirect("loggedOut", "/");
  const currentUser = useCurrentUser();

  return (
    <main>
      <section className={`${appStyles.bgPrimary} ${styles.HeroSection} fs-1`}>
        <h1 className={`fw-bold mb-0`}>Your liked artpieces </h1>
        <i
          className={`fa-solid fa-heart ${appStyles.txtWhite} ${appStyles.txtLarger}`}
        ></i>
      </section>
      <section>
        <Container fluid="xl" className="py-4">
          <h2 className="mb-0 mt-3">Your liked artpieces:</h2>
          <Discover likesFilter={`likes__owner=${currentUser?.pk || ""}&`} />
        </Container>
      </section>
    </main>
  );
};

export default LikedPage;
