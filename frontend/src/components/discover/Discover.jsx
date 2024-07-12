import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { axiosReq } from "../../api/axiosDefaults";
import { Button, Col, Row } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import ArtpieceSimple from "../artpiece_simple/ArtpieceSimple";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const Discover = ({ likesFilter = "" }) => {
  const [artpieces, setArtpieces] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const currentUser = useCurrentUser();

  const [query, setQuery] = useState("");
  const [filterMedium, setFilterMedium] = useState("");
  const [filterForSale, setFilterForSale] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const handleToggleForSale = () => {
    setFilterForSale((prevFilter) => (prevFilter === "" ? "1" : ""));
  };

  useEffect(() => {
    const fetchArtpieces = async () => {
      try {
        const { data } = await axiosReq.get(
          `/artpieces/?${likesFilter}search=${query}&art_medium=${filterMedium}&for_sale=${filterForSale}&ordering=${sortOrder}`
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
  }, [query, filterMedium, filterForSale, sortOrder, currentUser]);

  return (
    <>
      <Container fluid="xl">
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

          <Form.Control
            as="select"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="">Sort by</option>
            <option value="likes_count">Most Liked</option>
            <option value="-created_on">Newest to Oldest</option>
            <option value="created_on">Oldest to Newest</option>
          </Form.Control>
        </Form>

        {hasLoaded ? (
          <>
            {artpieces.results.length ? (
              <InfiniteScroll
                dataLength={artpieces.results.length}
                next={() => fetchMoreData(artpieces, setArtpieces)}
                hasMore={!!artpieces.next}
                loader={<p>Loading...</p>}
                endMessage={<p>No more results</p>}
              >
                <Row xs={1} md={2} lg={2} className="g-5 mt-2">
                  {artpieces.results.map((artpiece) => (
                    <Col key={artpiece.id} className="h-100">
                      <ArtpieceSimple
                        {...artpiece}
                        setArtpieces={setArtpieces}
                      />
                    </Col>
                  ))}
                </Row>
              </InfiniteScroll>
            ) : (
              <Container>
                <p>No results</p>
              </Container>
            )}
          </>
        ) : (
          <Container>
            <p>Has not loaded...</p>
          </Container>
        )}
      </Container>
    </>
  );
};

export default Discover;
