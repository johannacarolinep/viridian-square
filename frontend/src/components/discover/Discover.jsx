import React, { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import ArtpieceSimple from "../artpiece_simple/ArtpieceSimple";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import appStyles from "../../App.module.css";
import styles from "./Discover.module.css";
import Asset from "../asset/Asset";
import NoResults from "../../assets/images/noresults.webp";

/**
 * Discover component displays a list of art pieces with filtering and sorting options.
 *
 * Props:
 * - likesFilter: String used to filter art pieces based on likes.
 *
 * Features:
 * - Allows users to search for art pieces by title or description.
 * - Provides filtering options by art medium and sale status.
 * - Allows sorting of results by most liked, newest to oldest, or oldest to newest.
 * - Implements infinite scrolling to load more art pieces as the user scrolls.
 * - Displays a loading spinner while fetching data and a message if no results are found.
 *
 * State:
 * - artpieces: Stores the list of art pieces and pagination data.
 * - hasLoaded: Boolean indicating whether the data has been loaded.
 * - query: Search query for filtering art pieces.
 * - filterMedium: Filter for art medium used.
 * - filterForSale: Filter for sale status.
 * - sortOrder: Sorting order of the results.
 *
 * Hooks:
 * - useEffect: Fetches art pieces from the API based on the current filters and search query.
 *
 * Dependencies:
 * - Uses axios for API requests.
 * - Uses react-bootstrap for UI components.
 * - Uses InfiniteScroll for infinite scrolling functionality.
 */
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
        // Ignoring the error intentionally
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchArtpieces();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [query, filterMedium, filterForSale, sortOrder, currentUser, likesFilter]);

  return (
    <>
      <Row className="m-0 p-0 g-1">
        <Form className="mt-4 p-0" onSubmit={(event) => event.preventDefault()}>
          <Row className="m-0 g-3">
            <Col sm={12} lg={6} className="ps-0">
              <div className={`${styles.Search} ps-2 h-100`}>
                <i className="fa-solid fa-magnifying-glass"></i>
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
              <Form.Label htmlFor="formFilterMedium" className="sr-only">
                Filter results by art medium used
              </Form.Label>
              <Form.Select
                id="formFilterMedium"
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
              <Form.Label htmlFor="formFilterOrder" className="sr-only">
                Select sort order
              </Form.Label>
              <Form.Select
                id="formFilterOrder"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className={`h-100 ${styles.Select}`}
              >
                <option value="">Sort by</option>
                <option value="-likes_count">Most Liked</option>
                <option value="-created_on">Newest to Oldest</option>
                <option value="created_on">Oldest to Newest</option>
              </Form.Select>
            </Col>
            <Col sm={4} lg={2}>
              <Button
                variant="dark"
                onClick={handleToggleForSale}
                className={"h-100"}
                aria-label="Toggle between artpieces that are for sale, and artpieces regardless of sale status"
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
            <div className={`${appStyles.bgWhite} w-100 rounded mt-3`}>
              <Asset
                src={NoResults}
                message={"Sorry, no artpieces to display."}
              />
            </div>
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
