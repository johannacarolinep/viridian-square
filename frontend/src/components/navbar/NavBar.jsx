import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import logo from "../../assets/images/logo.webp";
import styles from "./NavBar.module.css";
import { NavLink } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";
import axios from "axios";
import useClickOutsideToggle from "../../hooks/useClickOutsideToggle";
import Avatar from "../avatar/Avatar";
import { removeTokenTimestamp } from "../../utils/utils";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const handleSignOut = async () => {
    try {
      await axios.post("/dj-rest-auth/logout/");
      setCurrentUser(null);
      removeTokenTimestamp();
    } catch (err) {
      // console.log(err);
    }
  };

  const loggedInOptions = (
    <>
      <NavLink
        to="/create"
        className={({ isActive }) =>
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
        aria-label="Go to page to create artpieces and collections"
      >
        <i className="fa-solid fa-paintbrush"></i>Create
      </NavLink>
      <NavLink
        to="/enquiries"
        className={({ isActive }) =>
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
        aria-label="Go to the enquiries page"
      >
        <i className="fa-regular fa-envelope"></i>Enquiries
      </NavLink>
      <NavLink
        to="/liked"
        className={({ isActive }) =>
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
        aria-label="Go to the liked page"
      >
        <i className="fa-regular fa-heart"></i>Liked
      </NavLink>
      <NavLink
        to="/"
        className={styles.NavLink}
        onClick={handleSignOut}
        aria-label="Sign out"
      >
        <i className="fa-solid fa-right-from-bracket"></i>Sign out
      </NavLink>
      <NavLink
        to={`/profiles/${currentUser?.profile_id}`}
        className={styles.NavLink}
        aria-label="Go to your profile page"
      >
        <Avatar src={currentUser?.profile_image} text="Profile" height={40} />
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
        aria-label="Go to the sign in page"
      >
        <i className="fa-solid fa-right-to-bracket"></i>Sign in
      </NavLink>
      <NavLink
        to="/signup"
        className={({ isActive }) =>
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
        aria-label="Go to the sign up page"
      >
        <i className="fa-solid fa-user-plus"></i>Sign up
      </NavLink>
    </>
  );

  return (
    <Navbar
      expanded={expanded}
      expand="lg"
      fixed="top"
      className={styles.NavBar}
    >
      <Container fluid="xl">
        <NavLink to="/" aria-label="Logo linking to discovery page">
          <Navbar.Brand>
            <Image src={logo} alt="Viridian Square logo" height="40" />
          </Navbar.Brand>
        </NavLink>
        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto text-start">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${styles.NavLink} ${isActive ? styles.Active : ""}`
              }
              aria-label="Go to the Discovery page"
            >
              <i className="fa-solid fa-magnifying-glass"></i>Discover
            </NavLink>
            {currentUser ? loggedInOptions : loggedOutOptions}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
