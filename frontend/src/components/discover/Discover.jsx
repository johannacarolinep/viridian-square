import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { axiosReq } from "../../api/axiosDefaults";

const Discover = () => {
  const [artpieces, setArtpieces] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchArtpieces = async () => {
      try {
        const { data } = await axiosReq.get(`/artpieces/?search=${query}`);
        setArtpieces(data);
        setHasLoaded(true);
      } catch (err) {
        // console.log(err);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchArtpieces();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <>
      <Form onSubmit={(event) => event.preventDefault()}>
        <Form.Control
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="text"
          className="mr-sm-2"
          placeholder="Search posts"
        />
      </Form>

      {hasLoaded ? (
        <>
          {artpieces.results.length ? (
            artpieces.results.map((artpiece) => <p>{artpiece.title}</p>)
          ) : (
            <Container>
              <p>No results</p>
            </Container>
          )}
        </>
      ) : (
        <Container>
          <p>Loading</p>
        </Container>
      )}
    </>
  );
};

export default Discover;
