import React, { useEffect, useState } from "react";
import axios from "axios";
import Col from "react-bootstrap/Col";
import Asset from "../asset/Asset";
import NoResults from "../../assets/images/noresults.webp";
import ArtpieceSimple from "../artpiece_simple/ArtpieceSimple";
import Row from "react-bootstrap/esm/Row";

const TrendingDisplay = () => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [artpieces, setArtpieces] = useState({ results: [] });

  useEffect(() => {
    const fetchArtpieces = async () => {
      try {
        const { data } = await axios.get(`/artpieces/trending/`);
        setArtpieces(data);
        setHasLoaded(true);
      } catch (err) {
        // console.log(err);
      }
    };

    setHasLoaded(false);
    fetchArtpieces();
  }, []);

  return (
    <>
      {hasLoaded ? (
        <>
          {artpieces.results.length ? (
            <>
              {artpieces.results.map((artpiece) => (
                <Col key={artpiece.id}>
                  <ArtpieceSimple
                    className="h-100"
                    {...artpiece}
                    setArtpieces={setArtpieces}
                  />
                </Col>
              ))}
            </>
          ) : (
            <Asset src={NoResults} />
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </>
  );
};

export default TrendingDisplay;
