import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../../assets/images/logo.webp';
import styles from './NavBar.module.css';

const NavBar = () => {
  return (
    <Navbar expand="lg" fixed="top" className={styles.NavBar}>
      <Container fluid="xl">
        <Navbar.Brand href="#home">
        <img src={logo} alt="Viridian Square logo" height="40"/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto text-start">
            <Nav.Link className={styles.NavLink} activeClassName={styles.Active}><i class="fa-solid fa-magnifying-glass"></i>Discover</Nav.Link>
            <Nav.Link className={styles.NavLink} activeClassName={styles.Active}><i class="fa-solid fa-right-to-bracket"></i>Sign in</Nav.Link>
            <Nav.Link className={styles.NavLink} activeClassName={styles.Active}><i class="fa-solid fa-user-plus"></i>Sign up</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar