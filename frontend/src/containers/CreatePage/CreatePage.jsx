import React from "react";
import { Link } from "react-router-dom";

const CreatePage = () => {
  return (
    <>
      <Link to="/create-collection">New collection</Link>
      <Link to="/create-artpiece">New artpiece</Link>
    </>
  );
};

export default CreatePage;
