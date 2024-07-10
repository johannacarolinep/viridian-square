import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";

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
    <div>
      ArtpiecePage:
      <p>{artpiece.title}</p>
    </div>
  );
};

export default ArtpiecePage;
