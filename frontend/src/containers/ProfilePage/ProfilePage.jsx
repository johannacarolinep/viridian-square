import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";

const ProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/profiles/${id}`);
        setProfile(data);
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [id]);

  return (
    <div>
      ProfilePage
      <p>{profile.name}</p>
    </div>
  );
};

export default ProfilePage;
