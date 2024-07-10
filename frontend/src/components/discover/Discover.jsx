import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { axiosReq } from "../../api/axiosDefaults";
import { Button } from "react-bootstrap";

const Discover = () => {
  const [artpieces, setArtpieces] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

  const [query, setQuery] = useState("");
  const [filterMedium, setFilterMedium] = useState("");
  const [filterForSale, setFilterForSale] = useState("");

  const handleToggleForSale = () => {
    setFilterForSale((prevFilter) => (prevFilter === "" ? "1" : ""));
  };

  useEffect(() => {
    const fetchArtpieces = async () => {
      try {
        const { data } = await axiosReq.get(
          `/artpieces/?search=${query}&art_medium=${filterMedium}&for_sale=${filterForSale}`
        );
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
  }, [query, filterMedium, filterForSale]);

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
        <Form.Control
          as="select"
          value={filterMedium}
          onChange={(event) => setFilterMedium(event.target.value)}
        >
          <option value="">All mediums</option>
          <option value="oil">Oil</option>
          <option value="watercolour">Watercolour</option>
          <option value="gouache">Gouache</option>
          <option value="acrylic">Acrylic</option>
          <option value="charcoal">Charcoal</option>
          <option value="chalk">Chalk</option>
          <option value="photography">Photography</option>
          <option value="mixedmedia">Mixed media</option>
          <option value="other">Other</option>
        </Form.Control>

        <Button onClick={handleToggleForSale}>
          {filterForSale === "1" ? "Show all" : "For sale"}
        </Button>
      </Form>

      {hasLoaded ? (
        <>
          {artpieces.results.length ? (
            artpieces.results.map((artpiece) => (
              <div>
                <h3>{artpiece.title}</h3>
                <p>{artpiece.for_sale}</p>
                <p>{artpiece.art_medium}</p>
                <p>{artpiece.hashtags}</p>
              </div>
            ))
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
