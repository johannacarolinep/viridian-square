import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { axiosReq } from "../../api/axiosDefaults";
import { Button, Col, Row } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import ArtpieceSimple from "../artpiece_simple/ArtpieceSimple";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import appStyles from "../../App.module.css";
import styles from "./Discover.module.css";
import Asset from "../asset/Asset";
import NoResults from "../../assets/images/noresults.webp";

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
      <Row className="m-0 p-0 g-1">
        <Form className="mt-4 p-0" onSubmit={(event) => event.preventDefault()}>
          <Row className="m-0 g-3">
            <Col sm={12} lg={6} className="ps-0">
              <div className={`${styles.Search} ps-2 h-100`}>
                <i class="fa-solid fa-magnifying-glass"></i>
                <Form.Control
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="search"
                  className={styles.SearchInput}
                  placeholder="Search and you shall find"
                />
              </div>
            </Col>

            <Col sm={4} lg={2} className="ps-0 ps-lg-2">
              <Form.Select
                value={filterMedium}
                onChange={(event) => setFilterMedium(event.target.value)}
                className={`h-100 ${styles.Select}`}
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
              </Form.Select>
            </Col>
            <Col sm={4} lg={2}>
              <Form.Select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className={`h-100 ${styles.Select}`}
              >
                <option value="">Sort by</option>
                <option value="likes_count">Most Liked</option>
                <option value="-created_on">Newest to Oldest</option>
                <option value="created_on">Oldest to Newest</option>
              </Form.Select>
            </Col>
            <Col sm={4} lg={2}>
              <Button
                variant="dark"
                onClick={handleToggleForSale}
                className={`h-100`}
              >
                {filterForSale === "1"
                  ? "Showing: For sale"
                  : "Incl. 'Not for sale'"}
              </Button>
            </Col>
          </Row>
        </Form>
        <div className={`${appStyles.dividerPrimary} mt-4`}></div>
      </Row>
      {hasLoaded ? (
        <>
          {artpieces.results.length ? (
            <InfiniteScroll
              dataLength={artpieces.results.length}
              next={() => fetchMoreData(artpieces, setArtpieces)}
              hasMore={!!artpieces.next}
              loader={<Asset spinner />}
              endMessage={<p>No more results</p>}
            >
              <Row xs={1} md={2} lg={2} className="g-4 m-0 mt-1">
                {artpieces.results.map((artpiece) => (
                  <Col key={artpiece.id}>
                    <ArtpieceSimple
                      className="h-100"
                      {...artpiece}
                      setArtpieces={setArtpieces}
                    />
                  </Col>
                ))}
              </Row>
            </InfiniteScroll>
          ) : (
            <Container>
              <Asset src={NoResults} message={"Nothing to display"} />
            </Container>
          )}
        </>
      ) : (
        <Container>
          <Asset spinner />
        </Container>
      )}
    </>
  );
};

export default Discover;
