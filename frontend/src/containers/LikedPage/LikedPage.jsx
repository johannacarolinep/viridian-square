import React from "react";
import Discover from "../../components/discover/Discover";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import appStyles from "../../App.module.css";
import styles from "./LikedPage.module.css";

const LikedPage = () => {
  const currentUser = useCurrentUser();

  return (
    <main>
      <section className={`${appStyles.bgPrimary} ${styles.HeroSection} fs-1`}>
        <h1 className={`fw-bold mb-0`}>Your liked artpieces </h1>
        <i
          className={`fa-solid fa-heart ${appStyles.txtWhite} ${appStyles.txtLarger}`}
        ></i>
      </section>
      <Discover likesFilter={`likes__owner=${currentUser?.pk || ""}&`} />
    </main>
  );
};

export default LikedPage;
