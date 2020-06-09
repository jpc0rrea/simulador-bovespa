import React from "react";
import { Navbar, Nav } from "react-bootstrap";


const HeaderWithCredentials = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">Simulador Bovespa</Navbar.Brand>
        <Nav className="mr-auto">
            <Nav.Link href="/">Início</Nav.Link>
            <Nav.Link href="/buy">Comprar</Nav.Link>
            <Nav.Link href="/sell">Vender</Nav.Link>
            <Nav.Link href="/history">Histórico</Nav.Link>
        </Nav>
      </Navbar>
    </>
  );
};

export default HeaderWithCredentials;
