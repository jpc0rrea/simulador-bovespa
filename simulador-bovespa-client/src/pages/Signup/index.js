import React, { useState } from "react";
import HeaderWithoutCredentials from "../../components/HeaderWithoutCredentials";
import { Form, Button, Spinner, Alert } from "react-bootstrap";

import "./styles.css";

import api from "../../services/api";

const Signup = ({ history }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    lastName: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  function handleInput(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    api
      .post("signup", formData)
      .then((response) => {
        setLoading(false);
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          history.push("/");
        }
      })
      .catch((err) => {
        // Vou conferir cada um dos possíveis erros e atualizar na tela
        const newErrors = err.response.data;
        console.log(newErrors);
        setErrors(newErrors);

        // conferindo erros relacionados ao email
        const emailInputElement = document.getElementById("formBasicEmail");
        const emailLabelElement = document.getElementById("email-label");
        if (newErrors.email) {
          emailInputElement.classList.add("error");
          emailLabelElement.classList.add("error");
        } else {
          console.log(emailInputElement.classList);
          emailInputElement.classList.remove("error");
          emailLabelElement.classList.remove("error");
        }

        // conferindo erros relacionados a senha
        const passwordInputElement = document.getElementById(
          "formBasicPassword"
        );
        const passwordLabelElement = document.getElementById("password-label");
        if (newErrors.password) {
          passwordInputElement.classList.add("error");
          passwordLabelElement.classList.add("error");
        } else {
          passwordInputElement.classList.remove("error");
          passwordLabelElement.classList.remove("error");
        }

        // conferindo erros relacionados ao nome
        const nameInputElement = document.getElementById("formBasicName");
        const nameLabelElement = document.getElementById("name-label");
        if (newErrors.name) {
          nameInputElement.classList.add("error");
          nameLabelElement.classList.add("error");
        } else {
          nameInputElement.classList.remove("error");
          nameLabelElement.classList.remove("error");
        }

        // conferindo erros relacionados ao sobrenome
        const lastNameInputElement = document.getElementById(
          "formBasicLastName"
        );
        const lastNameLabelElement = document.getElementById("lastName-label");
        if (newErrors.lastName) {
          lastNameInputElement.classList.add("error");
          lastNameLabelElement.classList.add("error");
        } else {
          lastNameInputElement.classList.remove("error");
          lastNameLabelElement.classList.remove("error");
        }

        // conferindo erros relacionados a confirmação de senha
        const confirmPasswordInputElement = document.getElementById(
          "formBasicConfirmPassword"
        );
        const confirmPasswordLabelElement = document.getElementById(
          "confirmPassword-label"
        );
        if (newErrors.confirmPassword) {
          confirmPasswordInputElement.classList.add("error");
          confirmPasswordLabelElement.classList.add("error");
        } else {
          confirmPasswordInputElement.classList.remove("error");
          confirmPasswordLabelElement.classList.remove("error");
        }
        if (newErrors.message) {
          setShowErrorAlert(true);
        }
        setLoading(false);
      });
  }

  return (
    <>
      <HeaderWithoutCredentials />
      {showErrorAlert && (
        <Alert
          variant="danger"
          onClose={() => setShowErrorAlert(false)}
          dismissible
        >
          {errors.message}
        </Alert>
      )}
      <div className="loginForm">
        <h1 className="formTitle">
          Registre-se no <strong>Simulador Bovespa</strong>
        </h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label id="email-label">E-mail</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Digite o seu e-mail"
              onChange={handleInput}
            />
          </Form.Group>
          {errors.email && (
            <div className="inputError">
              <p>{errors.email}</p>
            </div>
          )}

          <Form.Group controlId="formBasicName">
            <Form.Label id="name-label">Nome</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Digite seu nome"
              onChange={handleInput}
            ></Form.Control>
          </Form.Group>
          {errors.name && (
            <div className="inputError">
              <p>{errors.name}</p>
            </div>
          )}

          <Form.Group controlId="formBasicLastName">
            <Form.Label id="lastName-label">Sobrenome</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              placeholder="Digite seu sobrenome"
              onChange={handleInput}
            ></Form.Control>
          </Form.Group>
          {errors.lastName && (
            <div className="inputError">
              <p>{errors.lastName}</p>
            </div>
          )}

          <Form.Group controlId="formBasicPassword">
            <Form.Label id="password-label">Senha</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Senha"
              onChange={handleInput}
            ></Form.Control>
          </Form.Group>
          {errors.password && (
            <div className="inputError">
              <p>{errors.password}</p>
            </div>
          )}

          <Form.Group controlId="formBasicConfirmPassword">
            <Form.Label id="confirmPassword-label">
              Confirmação da senha
            </Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirme sua senha"
              onChange={handleInput}
            ></Form.Control>
          </Form.Group>
          {errors.confirmPassword && (
            <div className="inputError">
              <p>{errors.confirmPassword}</p>
            </div>
          )}

          <div className="buttonAndSpinner">
            <Button
              variant="outline-info"
              type="submit"
              className="signupButton"
              disabled={loading}
            >
              Registrar
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

export default Signup;
