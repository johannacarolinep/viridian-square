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
import ArtpieceSimple from "../../components/artpiece_simple/ArtpieceSimple";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";

const ProfilePage = () => {
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const [profile, setProfile] = useState([]);
  const [artpieces, setArtpieces] = useState({ results: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: profileData } = await axiosReq.get(`/profiles/${id}`);
        setProfile(profileData);
        const { data: artpieceData } = await axiosReq.get(
          `/artpieces/?owner=${profileData.owner}`
        );
        setArtpieces(artpieceData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/profiles/${profile.id}/edit`);
  };

  const handleAccountChange = () => {
    navigate(`/account`);
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
                <MoreDropdown
                  handleEdit={handleEdit}
                  handleAccountChange={handleAccountChange}
                />
              </div>
            )}
            <p>{profile.description}</p>
            <p>Artpieces: {profile.artpiece_count}</p>
            <p>Collections: {profile.collection_count}</p>
            <p>Location: {profile.location}</p>
            {profile.for_sale_count !== 0 && (
              <Badge pill bg="dark">
                Has artpieces for sale
              </Badge>
            )}
          </Col>
        </Row>
        <Row>
          {artpieces.results.length ? (
            <InfiniteScroll
              dataLength={artpieces.results.length}
              next={() => fetchMoreData(artpieces, setArtpieces)}
              hasMore={!!artpieces.next}
              loader={<p>Loading...</p>}
              endMessage={<p>No more results</p>}
            >
              <Row xs={2} md={3} lg={4} className="g-1 mt-1">
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
              <p>No results</p>
            </Container>
          )}
        </Row>
      </Container>
    </main>
  );
};

export default ProfilePage;
