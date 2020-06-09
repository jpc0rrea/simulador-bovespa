import React from "react";
import HeaderWithCredentials from "../../components/HeaderWithCredentials";
import { Form, Button } from "react-bootstrap";

const Buy = () => {
  function handleSubmit(event) {
    console.log("Oi");
  }

  return (
    <>
      <HeaderWithCredentials />
      <div className="loginForm">
        <h1 className="formTitle">Escolha qual ação você quer comprar</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBuySymbol">
            <Form.Label>Ativo</Form.Label>
            <Form.Control
              type="text"
              name="symbol"
              placeholder="Digite o ativo aqui"
            />
          </Form.Group>
        </Form>
      </div>
    </>
  );
};

export default Buy;
