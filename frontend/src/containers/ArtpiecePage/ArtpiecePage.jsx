import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import ArtpieceDetailed from "../../components/artpiece_detailed/ArtpieceDetailed";
import { Container } from "react-bootstrap";
import appStyles from "../../App.module.css";

const ArtpiecePage = () => {
  const { id } = useParams();
  const [artpiece, setArtpiece] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/artpieces/${id}`);
        setArtpiece(data);
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [id]);

  return (
    <main className={appStyles.bgWhite}>
      <Container fluid="xl">
        <ArtpieceDetailed {...artpiece} setArtpiece={setArtpiece} />
      </Container>
    </main>
  );
};

export default ArtpiecePage;
