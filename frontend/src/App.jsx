import styles from "./App.module.css";
import NavBar from "./components/navbar/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Routes } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpPage from "./containers/SignUpPage/SignUpPage";
import SignInPage from "./containers/SignInPage/SignInPage";
import CreatePage from "./containers/CreatePage/CreatePage";
import CreateArtpiecePage from "./containers/CreateArtpiecePage/CreateArtpiecePage";
import CreateCollectionPage from "./containers/CreateCollectionPage/CreateCollectionPage";
import DiscoverPage from "./containers/DiscoverPage/DiscoverPage";
import ArtpiecePage from "./containers/ArtpiecePage/ArtpiecePage";
import ProfilePage from "./containers/ProfilePage/ProfilePage";
import LikedPage from "./containers/LikedPage/LikedPage";
import EditArtpiecePage from "./containers/EditArtpiecePage/EditArtpiecePage";
import EditProfilePage from "./containers/EditProfilePage/EditProfilePage";
import AccountPage from "./containers/AccountPage/AccountPage";
import EditCollectionPage from "./containers/EditCollectionPage/EditCollectionPage";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<DiscoverPage />} />
        <Route exact path="/signup" element={<SignUpPage />} />
        <Route exact path="/signin" element={<SignInPage />} />
        <Route exact path="/create" element={<CreatePage />} />
        <Route exact path="/create-artpiece" element={<CreateArtpiecePage />} />
        <Route
          exact
          path="/artpieces/:id/edit"
          element={<EditArtpiecePage />}
        />
        <Route
          exact
          path="/create-collection"
          element={<CreateCollectionPage />}
        />
        <Route
          exact
          path="/collections/:id/edit"
          element={<EditCollectionPage />}
        />
        <Route
          exact
          path="/collections/:id/edit/new"
          element={<EditCollectionPage newCollection="y" />}
        />
        <Route exact path="/artpieces/:id" element={<ArtpiecePage />} />
        <Route exact path="/liked" element={<LikedPage />} />
        <Route exact path="/profiles/:id" element={<ProfilePage />} />
        <Route exact path="/profiles/:id/edit" element={<EditProfilePage />} />
        <Route exact path="/account" element={<AccountPage />} />
      </Routes>
    </>
  );
}

export default App;
