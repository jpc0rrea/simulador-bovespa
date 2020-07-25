import React, { useEffect, useState } from "react";
import HeaderWithCredentials from "../../components/HeaderWithCredentials";
import { Form, Button, Spinner } from "react-bootstrap";

import Autocomplete from "../../components/Autocomplete";
import SellConfirmation from "../../components/SellConfirmation";
import ExpiredSessionMessage from "../../components/ExpiredSessionMessage";

import api from "../../services/api";
import real from "../../services/real";

const Sell = ({ history }) => {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    symbol: "",
    quantity: 0,
  });
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [errors, setErrors] = useState({});
  const [headers, setHeaders] = useState({});
  const [loading, setLoading] = useState(false);
  const [sellData, setSellData] = useState({});
  const [expiredSession, setExpiredSession] = useState(false);
  const [caixa, setCaixa] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Se não tiver token já da o aviso que a sessão expirou
    if (!token) {
      setExpiredSession(true);
    }
    const newHeaders = {
      Authorization: `Bearer ${token}`,
    };

    setHeaders(newHeaders);

    api
      .get("", {
        headers: newHeaders,
      })
      .then((response) => {
        const userCaixa = response.data.caixa;
        setCaixa(userCaixa);
        const portfoliObject = response.data.data;
        // Convertendo a resposta (objeto) em array
        const portfolioArray = [];
        for (let company in portfoliObject) {
          portfolioArray.push({
            symbol: company,
            name: portfoliObject[company].name,
            fullName: `${company} - ${portfoliObject[company].name}`,
            price: portfoliObject[company].price,
            quantity: portfoliObject[company].quantity,
            total: portfoliObject[company].total,
            averagePrice: portfoliObject[company].averagePrice,
            profitLoss:
              portfoliObject[company].total -
              portfoliObject[company].averagePrice *
                portfoliObject[company].quantity,
          });
        }
        // Ordenando por nome
        portfolioArray.sort((a, b) =>
          a.symbol > b.symbol ? 1 : b.symbol > a.symbol ? -1 : 0
        );
        setCompanies(portfolioArray);
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
    console.log(event.target);
    console.log(name);
    if (name === "quantity") {
      value = parseInt(value);
    }
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    // Conferir se o symbol que o usuário digitou está na carteira dele
    // Conferir se a quantidade é a que está na carteira dele
    const completeSymbol = formData.symbol.trim();
    const newSymbol = formData.symbol.split(" - ")[0].trim();
    const newFormData = {
      ...formData,
      symbol: newSymbol,
    };
    setFormData(newFormData);
    let newErrors = {
      symbol: "Por favor, selecione uma das opções listadas",
    };

    // Vou começar o objeto de erros já com o erro que a opção não está na lista
    // Se ela estiver na lista, eu removo esse erro
    let newMaxQuantity = 0;
    companies.forEach((company) => {
      if (company.symbol === completeSymbol || company.symbol === newSymbol) {
        newErrors = {};
        newMaxQuantity = company.quantity;
        setMaxQuantity(newMaxQuantity);
        // Pegar a quantidade de ações que eu tenho em carteira
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

    // conferindo se a quantidade é maior do total de ações
    if (newFormData.quantity > newMaxQuantity) {
      newErrors.quantity = `Você tem ${newMaxQuantity} ações de ${newFormData.symbol}`;
    }

    if (newFormData.symbol === "") {
      // conferindo se o campo symbol está vazio
      newErrors.symbol = "Esse campo não pode estar vazio";
    }
    setErrors(newErrors);

    // Pegar cada elemento da tela (input da empresa e da quantidade )
    // para poder estilizar em caso de erro
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
        .post("sellSymbol", newFormData, {
          headers: headers,
        })
        .then((response) => {
          console.log(response.data);
          setSellData(response.data);
        })
        .catch((err) => {
          console.error(err);
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
      {sellData.price && (
        <SellConfirmation
          companyName={sellData.companyName}
          price={sellData.price}
          quantity={sellData.quantity}
          symbol={sellData.symbol}
          total={sellData.total}
          onHide={handleModal}
        />
      )}
      {expiredSession && <ExpiredSessionMessage history={history} />}
      <div className="loginForm">
        <h1 className="formTitle">Escolha qual ativo você quer vender</h1>
        <Form onSubmit={handleSubmit}>
          <Autocomplete
            label="Ativo"
            placeholder="Digite qual ativo você quer."
            options={companies}
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
              placeholder="Digite quantas cotas quer vender"
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
              Vender
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

export default Sell;
