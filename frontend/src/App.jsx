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
          path="/create-collection"
          element={<CreateCollectionPage />}
        />
        <Route exact path="/artpieces/:id" element={<ArtpiecePage />} />
        <Route exact path="/profiles/:id" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

export default App;
