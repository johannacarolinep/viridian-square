import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import styles from "./ProfilePage.module.css";
import Avatar from "../../components/avatar/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { MoreDropdown } from "../../components/moredropdown/MoreDropdown";
import ArtpieceSimple from "../../components/artpiece_simple/ArtpieceSimple";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import CollectionsDisplay from "../CollectionsDisplay/CollectionsDisplay";
import CollectionCard from "../../components/collection_card/CollectionCard";

const ProfilePage = () => {
  const { id } = useParams();
  const { search } = useLocation();
  const currentUser = useCurrentUser();
  const [profile, setProfile] = useState([]);
  const [artpieces, setArtpieces] = useState({ results: [] });
  const navigate = useNavigate();
  const [displayContent, setDisplayContent] = useState("artpieces");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: profileData } = await axiosReq.get(`/profiles/${id}`);
        setProfile(profileData);
        const { data: artpieceData } = await axiosReq.get(
          `/artpieces/?owner=${profileData.owner}`
        );
        setArtpieces(artpieceData);
        const queryParams = new URLSearchParams(search);
        const collectionId = queryParams.get("collectionId");

        if (collectionId) {
          const { data: collectionData } = await axiosReq.get(
            `/collections/${collectionId}`
          );
          if (collectionData.owner === profileData.owner) {
            setDisplayContent(collectionData);
          }
        }
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

  const handleDisplayContentChange = (content) => {
    setDisplayContent(content);
    console.log("CONTENT ", content);
  };

  return (
    <main className={appStyles.bgAccentLight}>
      <Container fluid="xl" className={`my-xl-4 pb-3 ${appStyles.bgWhite}`}>
        <section className="p-lg-3">
          <Row className={`m-0 g-4`}>
            <Col md={4} lg={3}>
              <div
                className={`${appStyles.ImageCover} ${appStyles.Round} ${styles.ProfileImage}`}
              >
                <Image
                  src={profile?.profile_image_url}
                  alt={`${profile?.name}'s profile image`}
                />
              </div>
            </Col>
            <Col md={8} lg={9}>
              <div className="d-flex justify-content-between">
                <h1 className="mb-3">{profile?.name}</h1>
                {profile.is_owner && (
                  <MoreDropdown
                    handleEdit={handleEdit}
                    handleAccountChange={handleAccountChange}
                  />
                )}
              </div>
              {profile?.description && <p>{profile.description}</p>}
              {profile?.location && (
                <p>
                  <i class="fa-solid fa-location-dot ps-0"></i>{" "}
                  {profile.location}
                </p>
              )}
              <div className="fs-4 mt-4">
                {profile?.artpiece_count !== 0 && (
                  <Badge pill className={`me-1 my-1 ${appStyles.bgDark}`} bg="">
                    #Artpieces: {profile.artpiece_count}
                  </Badge>
                )}
                {profile?.collection_count !== 0 && (
                  <Badge
                    pill
                    className={`me-1 my-1 ${appStyles.bgPrimary}`}
                    bg=""
                  >
                    #Collections: {profile.collection_count}
                  </Badge>
                )}
                {profile?.for_sale_count !== 0 && (
                  <Badge
                    pill
                    className={`me-1 my-1 ${appStyles.bgAccentDark}`}
                    bg=""
                  >
                    Has artpieces for sale
                  </Badge>
                )}
              </div>
            </Col>
          </Row>
        </section>
        <section className={`${appStyles.bgAccentDark} mt-3 p-2 rounded`}>
          <Row className="m-0">
            <div className={`${appStyles.bgLight} p-0 d-flex flex-wrap`}>
              <Button
                onClick={() => handleDisplayContentChange("artpieces")}
                className={
                  displayContent === "artpieces"
                    ? styles.TabButtonSelected
                    : styles.TabButton
                }
              >
                Artpieces
              </Button>

              <Button
                onClick={() => handleDisplayContentChange("collections")}
                className={
                  displayContent === "collections"
                    ? styles.TabButtonSelected
                    : styles.TabButton
                }
              >
                Collections
              </Button>
              {displayContent !== "artpieces" &&
                displayContent !== "collections" && (
                  <div className={`${styles.Tab} ${styles.TabButtonSelected}`}>
                    {displayContent.title}
                  </div>
                )}
            </div>
          </Row>
          <Row className="m-0">
            {displayContent === "artpieces" ? (
              <div className="p-0">
                {artpieces.results.length ? (
                  <InfiniteScroll
                    dataLength={artpieces.results.length}
                    next={() => fetchMoreData(artpieces, setArtpieces)}
                    hasMore={!!artpieces.next}
                    loader={<p>Loading...</p>}
                  >
                    <Row xs={2} md={3} lg={4} className="g-1 m-0 mt-1">
                      {artpieces.results.map((artpiece) => (
                        <Col key={artpiece.id}>
                          <ArtpieceSimple
                            className="h-100"
                            basic
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
              </div>
            ) : displayContent === "collections" ? (
              <CollectionsDisplay
                owner={profile.owner}
                handleDisplayContentChange={handleDisplayContentChange}
              />
            ) : (
              <div className={`p-0 mt-2 ${appStyles.bgLight}`}>
                <Row className="m-0 pt-2 px-3">
                  <CollectionCard
                    collection={displayContent}
                    handleDisplayContentChange={handleDisplayContentChange}
                  />
                </Row>
                {displayContent.artpieces.length ? (
                  <Row xs={2} md={3} lg={4} className="g-1 m-0 px-3 my-1">
                    {artpieces.results
                      .filter((artpiece) =>
                        displayContent.artpieces.includes(artpiece.id)
                      )
                      .map((artpiece) => (
                        <Col key={artpiece.id}>
                          <ArtpieceSimple
                            className="h-100"
                            basic
                            {...artpiece}
                            setArtpieces={setArtpieces}
                          />
                        </Col>
                      ))}
                  </Row>
                ) : (
                  <Container>
                    <p>No results</p>
                  </Container>
                )}
              </div>
            )}
          </Row>
        </section>
      </Container>
    </main>
  );
};

export default ProfilePage;
