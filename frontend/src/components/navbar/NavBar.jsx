import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../assets/images/logo.webp";
import styles from "./NavBar.module.css";
import { NavLink } from "react-router-dom";

const NavBar = () => {
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
              className={styles.NavLink}
              activeClassName={styles.Active}
            >
              <i class="fa-solid fa-magnifying-glass"></i>Discover
            </NavLink>
            <NavLink
              to="/signin"
              className={styles.NavLink}
              activeClassName={styles.Active}
            >
              <i class="fa-solid fa-right-to-bracket"></i>Sign in
            </NavLink>
            <NavLink
              to="/signup"
              className={styles.NavLink}
              activeClassName={styles.Active}
            >
              <i class="fa-solid fa-user-plus"></i>Sign up
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
