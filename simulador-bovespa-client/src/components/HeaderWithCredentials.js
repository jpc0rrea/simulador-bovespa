import React, { useState, useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { LogOut } from "react-feather";

import "./Headers/styles.css";

const HeaderWithCredentials = (props) => {
  const [caixa, setCaixa] = useState(props.caixa);

  useEffect(() => {
    setCaixa(props.caixa);
  }, [props.caixa]);

  function handleLogout() {
    localStorage.removeItem("token");
  }

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">Simulador Bovespa</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">Início</Nav.Link>
            <Nav.Link href="/quote">Cotar ativo</Nav.Link>
            <Nav.Link href="/buy">Comprar</Nav.Link>
            <Nav.Link href="/sell">Vender</Nav.Link>
            <Nav.Link href="/history">Histórico</Nav.Link>
          </Nav>
          <Navbar className="mr-sm-2">
            <Navbar.Text>Caixa: {caixa}</Navbar.Text>
            <Nav.Link href="/login" onClick={handleLogout}>
              <LogOut className="logout" />
              Sair
            </Nav.Link>
          </Navbar>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default HeaderWithCredentials;
