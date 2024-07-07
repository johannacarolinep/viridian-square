import styles from "./App.module.css";
import NavBar from "./components/navbar/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Routes } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./containers/auth/SignUpForm";

function App() {
  return (
    <div className={styles.App}>
      <NavBar />
      <Container fluid className={styles.Main}>
        <Routes>
          <Route exact path="/" element={<h1>Discovery page</h1>} />
          <Route exact path="/signup" element={<SignUpForm />} />
          <Route exact path="/signin" element={<h1>Sign in page</h1>} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
