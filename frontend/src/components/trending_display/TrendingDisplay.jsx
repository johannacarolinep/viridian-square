import React, { useEffect, useState } from "react";
import axios from "axios";
import Col from "react-bootstrap/Col";
import Asset from "../asset/Asset";
import NoResults from "../../assets/images/noresults.webp";
import ArtpieceSimple from "../artpiece_simple/ArtpieceSimple";
import appStyles from "../../App.module.css";

/**
 * TrendingDisplay component fetches and displays trending art pieces.
 *
 * Features:
 * - Fetches trending art pieces from the API.
 * - Displays a list of trending art pieces using the ArtpieceSimple component.
 *
 * State:
 * - hasLoaded: Boolean indicating whether the data has been loaded.
 * - artpieces: Object containing the list of trending art pieces and related data.
 *
 * Hooks:
 * - useEffect: Fetches trending art pieces when the component mounts.
 *
 */
const TrendingDisplay = () => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [artpieces, setArtpieces] = useState({ results: [] });

  useEffect(() => {
    const fetchArtpieces = async () => {
      try {
        const { data } = await axios.get("/artpieces/trending/");
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
            <div className={`${appStyles.bgWhite} w-100 rounded`}>
              <Asset
                src={NoResults}
                message={"Sorry! No trending artpieces to display right now."}
              />
            </div>
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </>
  );
};

export default TrendingDisplay;
