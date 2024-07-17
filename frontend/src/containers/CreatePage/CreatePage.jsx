import React from "react";
import { Link } from "react-router-dom";
import { useRedirect } from "../../hooks/useRedirect";

const CreatePage = () => {
  useRedirect("loggedOut", "/");

  return (
    <main>
      <Link to="/create-collection">New collection</Link>
      <Link to="/create-artpiece">New artpiece</Link>
    </main>
  );
};

export default CreatePage;
