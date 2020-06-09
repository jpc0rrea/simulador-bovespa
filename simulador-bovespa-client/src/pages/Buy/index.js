import React, { useEffect, useState } from "react";
import HeaderWithCredentials from "../../components/HeaderWithCredentials";
import { Form, Button } from "react-bootstrap";

import api from "../../services/api";

import "./styles.css";

const Buy = () => {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    symbol: "",
    quantity: 0,
  });

  useEffect(() => {
    api.get("companies").then((bovespaCompanies) => {
      setCompanies(bovespaCompanies.data);
    });
  }, []);

  function handleInputChange(event) {
    var { name, value } = event.target;
    if (name === "quantity") {
        value = parseInt(value)
    }
    setFormData({ ...formData, [name]: value });
    console.log(formData)
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Oi");
  }

  return (
    <>
      <HeaderWithCredentials />
      <div className="loginForm">
        <h1 className="formTitle">Escolha qual ativo você quer comprar</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formInputSymbol">
            <Form.Label>Ativo</Form.Label>
            <Form.Control
              type="text"
              name="symbol"
              placeholder="Digite o ativo aqui"
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formInputSymbolQuantity">
            <Form.Label>Quantidade de cotas</Form.Label>
            <Form.Control
              type="number"
              min="0"
              name="quantity"
              placeholder="Digite quantas cotas quer comprar"
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="outline-info" type="submit">
            Comprar
          </Button>
        </Form>
      </div>
    </>
  );
};

export default Buy;
