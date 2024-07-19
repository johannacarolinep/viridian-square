import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import ArtpieceDetailed from "../../components/artpiece_detailed/ArtpieceDetailed";
import { Container } from "react-bootstrap";
import appStyles from "../../App.module.css";
import Asset from "../../components/asset/Asset";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const ArtpiecePage = () => {
  const { id } = useParams();
  const [artpiece, setArtpiece] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const currentUser = useCurrentUser();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/artpieces/${id}`);
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
