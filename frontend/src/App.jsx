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

function App() {
  return (
    <div className={styles.App}>
      <NavBar />
      <Container fluid className={styles.Main}>
        <Routes>
          <Route exact path="/" element={<h1>Discovery page</h1>} />
          <Route exact path="/signup" element={<SignUpPage />} />
          <Route exact path="/signin" element={<SignInPage />} />
          <Route exact path="/create" element={<CreatePage />} />
          <Route
            exact
            path="/create-artpiece"
            element={<CreateArtpiecePage />}
          />
          <Route
            exact
            path="/create-collection"
            element={<CreateCollectionPage />}
          />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
