import React from "react";
import { Navbar, Nav } from "react-bootstrap";

import "./Headers/styles.css";

const HeaderWithoutCredentials = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="/login"> Simulador Bovespa</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/login">Login</Nav.Link>
          <Nav.Link href="/signup">Registre-se</Nav.Link>
          <Nav.Link href="/quote">Cotar ativos</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default HeaderWithoutCredentials;
