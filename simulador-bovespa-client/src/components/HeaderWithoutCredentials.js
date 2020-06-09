import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const HeaderWithoutCredentials = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/login"> Simulador Bovespa</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="/login">Login</Nav.Link>
        <Nav.Link href="/signup">Registre-se</Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default HeaderWithoutCredentials;
