import React, { useEffect, useState } from "react";
import HeaderWithCredentials from "../../components/HeaderWithCredentials";
import { Form, Button } from "react-bootstrap";
import Autocomplete from "../../components/Autocomplete";

import api from "../../services/api";
import real from "../../services/real";

import "./styles.css";

const Quote = () => {
  const [companies, setCompanies] = useState([]);
  const [showPrice, setShowPrice] = useState(false);
  const [price, setPrice] = useState(0);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");

  useEffect(() => {
    api.get("companies").then((bovespaCompanies) => {
      setCompanies(bovespaCompanies.data);
    });
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const inputedCompany = document.getElementById("autocompleteInput");
    const company = inputedCompany.value.split(" - ")[0].trim();
    // Verificar por possiveis erros de escrita
    api
      .post("quote", {
        symbol: company,
      })
      .then((response) => {
        const responsePrice = response.data.price;
        const responseName = response.data.name;
        const responseSymbol = response.data.symbol;
        setShowPrice(true);
        setPrice(responsePrice);
        setName(responseName);
        setSymbol(responseSymbol);
        inputedCompany.value = "";
      });
    // Pegar a empresa que o usuário digitou e fazer uma busca na api
    // Retornar as informações na DOM
  }

  return (
    <>
      <HeaderWithCredentials />
      <div className="loginForm">
        <h1 className="formTitle">Escolha qual ativo você quer cotar</h1>
        <Form onSubmit={handleSubmit}>
          <Autocomplete
            label="Ativo"
            placeholder="Digite qual ativo você quer"
            options={companies}
            controlId="autocompleteInput"
            onUserTyping={() => {}}
          />
          <Button variant="outline-info" type="submit">
            Cotar
          </Button>
        </Form>
        <div className="quoteResponse">
          {showPrice && (
            <p>
              Uma cota de <strong>{name}</strong> ({symbol}) está custando {' '}
              <strong>{real(price)}</strong>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Quote;
