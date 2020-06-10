import React, { useEffect, useState } from "react";
import HeaderWithCredentials from "../../components/HeaderWithCredentials";
import { Form, Button } from "react-bootstrap";
import Autocomplete from "../../components/Autocomplete";

import api from "../../services/api";

const Sell = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    api.get("companies").then((bovespaCompanies) => {
      setCompanies(bovespaCompanies.data);
    });
  }, []);

  function handleInputChange(event) {
    console.log(event.target);
  }

  function handleSubmit(event) {
    event.preventDefault();
    // Pegar a empresa que o usuário digitou e fazer uma busca na api
    // Retornar as informações na DOM
  }

  return (
    <>
      <HeaderWithCredentials />
      <div className="loginForm">
        <h1 className="formTitle">Escolha qual ativo você quer vender</h1>
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
          {companies.length > 0 && (
            <Autocomplete
              label="Ativo Autocomplete"
              placeholder="Digite quantos ativos você quer."
              options={companies}
            />
          )}

          <Form.Group controlId="formInputSymbolQuantity">
            <Form.Label>Quantidade de cotas</Form.Label>
            <Form.Control
              type="number"
              min="0"
              name="quantity"
              placeholder="Digite quantas cotas quer vender"
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

export default Sell;
