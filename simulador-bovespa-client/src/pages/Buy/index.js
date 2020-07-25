import React, { useEffect, useState } from "react";
import HeaderWithCredentials from "../../components/HeaderWithCredentials";
import { Form, Button, Spinner, Alert } from "react-bootstrap";

import Autocomplete from "../../components/Autocomplete";
import BuyConfirmation from "../../components/BuyConfirmation";
import ExpiredSessionMessage from "../../components/ExpiredSessionMessage";

import api from "../../services/api";

import "./styles.css";
import real from "../../services/real";

const Buy = ({ history }) => {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    symbol: "",
    quantity: 0,
  });
  const [headers, setHeaders] = useState({});
  const [buyData, setBuyData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [expiredSession, setExpiredSession] = useState(false);
  const [caixa, setCaixa] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const newHeaders = {
      Authorization: `Bearer ${token}`,
    };
    // Se não tiver token já da o aviso que a sessão expirou
    if (!token) {
      setExpiredSession(true);
    }
    setHeaders(newHeaders);
    api.get("companies").then((bovespaCompanies) => {
      setCompanies(bovespaCompanies.data);
    });
    api
      .get("caixa", {
        headers: newHeaders,
      })
      .then((response) => {
        const userCaixa = response.data.caixa;
        setCaixa(userCaixa);
      })
      .catch((err) => {
        console.error(err);
        if (err.response.data.code === "auth/id-token-expired") {
          // Usuário fez login a mais de 1 hora
          // Hora de renovar o token dele
          setExpiredSession(true);
        } else if (err.response.data.code === "auth/argument-error") {
          // ainda não tem nenhum token na session do usuário
          setExpiredSession(true);
        }
      });
  }, []);

  function handleInputChange(event) {
    var { name, value } = event.target;
    if (name === "quantity") {
      value = parseInt(value);
    }
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    const completeSymbol = formData.symbol.trim();
    const newSymbol = formData.symbol.split(" - ")[0].trim();
    const newFormData = {
      ...formData,
      symbol: newSymbol,
    };
    setFormData(newFormData);
    console.log(newFormData);
    // Validar que o que foi digitado é inteiro e maior que zero
    // E validar se a empresa é uma das opções

    let newErrors = {
      symbol: "Por favor, selecione uma das opções listadas.",
    };

    companies.forEach((company) => {
      if (company.symbol === completeSymbol || company.symbol === newSymbol) {
        newErrors = {};
      }
    });

    // primeiro conferindo se é inteiro
    if (parseInt(newFormData.quantity) === NaN) {
      newErrors.quantity = "Deve ser um número inteiro e positivo.";
    } else if (
      newFormData.quantity <= 0 ||
      newFormData.quantity === undefined
    ) {
      // conferindo se é maior que zero
      newErrors.quantity = "Deve ser um número inteiro e positivo.";
    }

    if (newFormData.symbol === "") {
      // conferindo se o campo symbol está vazio
      newErrors.symbol = "Esse campo não pode estar vazio";
    }
    setErrors(newErrors);
    // Pegar cada elemento da tela (input da empresa e da quantidade)
    // Para poder estilizar ele com erro (caso tenha ocorrido)
    const symbolInputElement = document.getElementById(
      "symbolAutocompleteInput"
    );
    const symbolLabelElement = document.getElementById("symbol-label");
    const quantityInputElement = document.getElementById(
      "formInputSymbolQuantity"
    );
    const quantityLabelElement = document.getElementById("quantity-label");

    if (newErrors.quantity) {
      quantityInputElement.classList.add("error");
      quantityLabelElement.classList.add("error");
    } else {
      quantityInputElement.classList.remove("error");
      quantityLabelElement.classList.remove("error");
    }

    if (newErrors.symbol) {
      symbolInputElement.classList.add("error");
      symbolLabelElement.classList.add("error");
    } else {
      symbolInputElement.classList.remove("error");
      symbolLabelElement.classList.remove("error");
    }
    if (!newErrors.symbol && !newErrors.quantity) {
      api
        .post("buySymbol", newFormData, {
          headers: headers,
        })
        .then((response) => {
          console.log(response.data);
          setBuyData(response.data);
        })
        .catch((err) => {
          console.error(err);
          if (err.response.data.code === "auth/id-token-expired") {
            // Usuário fez login a mais de 1 hora
            // Hora de renovar o token dele
            setExpiredSession(true);
          } else if (err.response.data.code === "auth/argument-error") {
            // ainda não tem nenhum token na session do usuário
            setExpiredSession(true);
          }
        });
    }
    setLoading(false);
  }

  function handleModal() {
    history.push("/");
  }

  return (
    <>
      <HeaderWithCredentials caixa={real(caixa)} />
      {buyData.price && (
        <BuyConfirmation
          companyName={buyData.companyName}
          price={buyData.price}
          quantity={buyData.quantity}
          symbol={buyData.symbol}
          total={buyData.total}
          onHide={handleModal}
        />
      )}
      {expiredSession && <ExpiredSessionMessage history={history} />}
      <div className="loginForm">
        <h1 className="formTitle">Escolha qual ativo você quer comprar</h1>
        <Form onSubmit={handleSubmit}>
          <Autocomplete
            label="Ativo"
            placeholder="Digite o ativo aqui"
            options={companies}
            controlId="autocompleteInput"
            onUserTyping={handleInputChange}
            name="symbol"
            controlId="symbolAutocompleteInput"
            labelId="symbol-label"
          />
          {errors.symbol && (
            <div className="inputError">
              <p>{errors.symbol}</p>
            </div>
          )}

          <Form.Group controlId="formInputSymbolQuantity">
            <Form.Label id="quantity-label">Quantidade de cotas</Form.Label>
            <Form.Control
              type="number"
              min="0"
              name="quantity"
              placeholder="Digite quantas cotas quer comprar"
              onChange={handleInputChange}
            />
          </Form.Group>
          {errors.quantity && (
            <div className="inputError">
              <p>{errors.quantity}</p>
            </div>
          )}
          <div className="buttonAndSpinner">
            <Button variant="outline-info" type="submit">
              Comprar
            </Button>
            {loading && (
              <Spinner
                animation="border"
                variant="outline-info"
                role="status"
                className="progressSpinner"
                aria-hidden="true"
              />
            )}
          </div>
        </Form>
      </div>
    </>
  );
};

export default Buy;
