import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  Image,
  Row,
} from "react-bootstrap";
import appStyles from "../../App.module.css";
import Avatar from "../../components/avatar/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { MoreDropdown } from "../../components/moredropdown/MoreDropdown";

const ProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState({ results: [] });
  const navigate = useNavigate();

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

  const handleEdit = () => {
    navigate(`/profiles/${profile.id}/edit`);
  };

  return (
    <main>
      <Container fluid="xl" className={`my-4 ${appStyles.bgWhite}`}>
        <Row className={`m-0`}>
          <Col xl={3}>
            <Avatar src={profile.profile_image_url} height={150} />
          </Col>
          <Col xl={9}>
            <h1>{profile.name}</h1>
            {profile.is_owner && (
              <div className="d-flex align-items-center">
                <MoreDropdown handleEdit={handleEdit} />
              </div>
            )}
            <p>{profile.description}</p>
            <p>Artpieces: {profile.artpiece_count}</p>
            <p>Collections: {profile.collection_count}</p>
            {profile.for_sale_count !== 0 && (
              <Badge pill bg="dark">
                Has artpieces for sale
              </Badge>
            )}
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ProfilePage;
