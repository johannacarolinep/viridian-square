import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../assets/images/logo.webp";
import styles from "./NavBar.module.css";
import { NavLink } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const NavBar = () => {
  const currentUser = useCurrentUser();

  const loggedInOptions = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
      >
        <i class="fa-solid fa-paintbrush"></i>Create
      </NavLink>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
      >
        <i class="fa-regular fa-envelope"></i>Enquiries
      </NavLink>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
      >
        <i class="fa-regular fa-heart"></i>Liked
      </NavLink>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
      >
        <i class="fa-solid fa-right-from-bracket"></i>Sign out
      </NavLink>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
      >
        Profile
      </NavLink>
    </>
  );
  const loggedOutOptions = (
    <>
      <NavLink
        to="/signin"
        className={({ isActive }) =>
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
      >
        <i class="fa-solid fa-right-to-bracket"></i>Sign in
      </NavLink>
      <NavLink
        to="/signup"
        className={({ isActive }) =>
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
      >
        <i class="fa-solid fa-user-plus"></i>Sign up
      </NavLink>
    </>
  );

  return (
    <Navbar expand="lg" fixed="top" className={styles.NavBar}>
      <Container fluid="xl">
        <NavLink to="/">
          <Navbar.Brand>
            <img src={logo} alt="Viridian Square logo" height="40" />
          </Navbar.Brand>
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto text-start">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${styles.NavLink} ${isActive ? styles.Active : ""}`
              }
            >
              <i class="fa-solid fa-magnifying-glass"></i>Discover
            </NavLink>
            {currentUser ? loggedInOptions : loggedOutOptions}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
