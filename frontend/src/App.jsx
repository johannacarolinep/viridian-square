import styles from "./App.module.css";
import NavBar from "./components/navbar/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Routes } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpPage from "./containers/SignUpPage/SignUpPage";
import SignInPage from "./containers/SignInPage/SignInPage";

function App() {
  return (
    <div className={styles.App}>
      <NavBar />
      <Container fluid className={styles.Main}>
        <Routes>
          <Route exact path="/" element={<h1>Discovery page</h1>} />
          <Route exact path="/signup" element={<SignUpPage />} />
          <Route exact path="/signin" element={<SignInPage />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
