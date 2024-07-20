import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import ArtpieceDetailed from "../../components/artpiece_detailed/ArtpieceDetailed";
import Container from "react-bootstrap/Container";
import appStyles from "../../App.module.css";
import Asset from "../../components/asset/Asset";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

/**
 * ArtpiecePage Container
 *
 * The ArtpiecePage container is responsible for displaying detailed information about a specific art piece.
 * It fetches the data from the backend API using the provided art piece ID from the URL parameters and renders the
 * detailed view of the art piece once the data is loaded. If the data is still being loaded, it shows a loading spinner.
 *
 * Features:
 * - Fetch detailed information about a specific art piece based on the URL parameter.
 * - Display the detailed information using the ArtpieceDetailed component.
 * - Show a loading spinner while the data is being fetched.
 *
 * State:
 * - artpiece: Holds the data of the art piece fetched from the API.
 * - hasLoaded: A boolean indicating whether the data has been successfully loaded.
 *
 * Hooks:
 * - useParams: Retrieves the art piece ID from the URL parameters.
 * - useEffect: Fetches the art piece data when the component mounts or when the art piece ID or currentUser changes.
 * - useCurrentUser: Retrieves the current user's information.
 *
 * API Calls:
 * - axiosReq.get(`/artpieces/${id}/`): Fetches the detailed information of the art piece with the given art piece ID.
 *
 * @returns {JSX.Element} The ArtpiecePage component.
 */
const ArtpiecePage = () => {
  const { id } = useParams();
  const [artpiece, setArtpiece] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const currentUser = useCurrentUser();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/artpieces/${id}/`);
        setArtpiece(data);
        setHasLoaded(true);
      } catch (err) {
        // console.log(err);
      }
    };

    handleMount();
    setHasLoaded(false);
  }, [id, currentUser]);

  return (
    <main className={appStyles.bgWhite}>
      <Container fluid="xl">
        {hasLoaded ? (
          <ArtpieceDetailed {...artpiece} setArtpiece={setArtpiece} />
        ) : (
          <Asset spinner />
        )}
      </Container>
    </main>
  );
};

export default ArtpiecePage;
