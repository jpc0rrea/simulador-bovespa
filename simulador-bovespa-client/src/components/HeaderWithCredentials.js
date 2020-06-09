import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { LogOut } from "react-feather";


const HeaderWithCredentials = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">Simulador Bovespa</Navbar.Brand>
        <Nav className="mr-auto">
            <Nav.Link href="/">Início</Nav.Link>
            <Nav.Link href="/quote">Cotar ativo</Nav.Link>
            <Nav.Link href="/buy">Comprar</Nav.Link>
            <Nav.Link href="/sell">Vender</Nav.Link>
            <Nav.Link href="/history">Histórico</Nav.Link>
        </Nav>
        <Navbar className="mr-sm-2">
            <Nav.Link href="/login">
                <LogOut className="logout"/>
                Sair
            </Nav.Link>
        </Navbar>
      </Navbar>
    </>
  );
};

export default HeaderWithCredentials;
