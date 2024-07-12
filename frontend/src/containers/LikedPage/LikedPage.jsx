import React from "react";
import Discover from "../../components/discover/Discover";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const LikedPage = () => {
  const currentUser = useCurrentUser();

  return (
    <main>
      <h1>LikedPage</h1>
      <Discover likesFilter={`likes__owner=${currentUser?.pk || ""}&`} />
    </main>
  );
};

export default LikedPage;
