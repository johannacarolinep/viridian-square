import React from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import appStyles from "../../App.module.css";
import styles from "./LikedPage.module.css";
import { useRedirect } from "../../hooks/useRedirect";
import Container from "react-bootstrap/Container";
import Discover from "../../components/discover/Discover";

/**
 * LikedPage container
 *
 * The LikedPage container is responsible for displaying the user's liked art pieces.
 * It uses the Discover component to list all art pieces liked by the current user.
 * If the user is not logged in, they are redirected to the home page.
 *
 * Features:
 * - Redirect logged-out users to the home page using the useRedirect hook.
 * - Display a hero section with a title and a heart icon.
 * - Use the Discover component to fetch and display art pieces liked by the current user.
 *
 * Hooks:
 * - useRedirect: Redirects logged-out users to the specified route.
 * - useCurrentUser: Retrieves the current user's information.
 *
 * Components:
 * - Discover: A component that fetches and displays art pieces based on the provided filter.
 *
 * @returns {JSX.Element} The LikedPage component.
 */
const LikedPage = () => {
  useRedirect("loggedOut", "/");
  const currentUser = useCurrentUser();

  return (
    <main>
      <section className={`${appStyles.bgPrimary} ${styles.HeroSection} fs-1`}>
        <h1 className={"fw-bold mb-0"}>Your liked artpieces </h1>
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
