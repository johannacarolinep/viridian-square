import React from "react";
import { useRedirect } from "../../hooks/useRedirect";

const EnquiriesPage = () => {
  useRedirect("loggedOut", "/");
  return <main>EnquiriesPage</main>;
};

export default EnquiriesPage;
