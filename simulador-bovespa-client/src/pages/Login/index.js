import React, { useState } from "react";
import HeaderWithoutCredentials from "../../components/HeaderWithoutCredentials";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

import api from "../../services/api";

import "./styles.css";

const Login = ({ history }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    api
      .post("login", formData)
      .then((response) => {
        setLoading(false);
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          history.push("/");
        } else {
          console.log(response.data);
        }
      })
      .catch((err) => {
        const newErrors = err.response.data;
        console.log(newErrors);
        setErrors(newErrors);
        const emailInputElement = document.getElementById("formBasicEmail");
        const emailLabelElement = document.getElementById("email-label");
        const passwordInputElement = document.getElementById(
          "formBasicPassword"
        );
        const passwordLabelElement = document.getElementById("password-label");
        if (newErrors.email) {
          emailInputElement.classList.add("error");
          emailLabelElement.classList.add("error");
        } else {
          console.log(emailInputElement.classList);
          emailInputElement.classList.remove("error");
          emailLabelElement.classList.remove("error");
        }
        if (newErrors.password) {
          passwordInputElement.classList.add("error");
          passwordLabelElement.classList.add("error");
        } else {
          passwordInputElement.classList.remove("error");
          passwordLabelElement.classList.remove("error");
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
          Senha incorreta ou usuário na encontrado. Por favor, tente de novo.
        </Alert>
      )}
      <div className="loginForm">
        <h1 className="formTitle">
          Faça login no <strong>Simulador Bovespa</strong>
        </h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label id="email-label">E-mail</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Digite o seu e-mail"
              onChange={handleInputChange}
            />
          </Form.Group>
          {errors.email && (
            <div className="inputError">
              <p>{errors.email}</p>
            </div>
          )}

          <Form.Group controlId="formBasicPassword">
            <Form.Label id="password-label">Senha</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Senha"
              onChange={handleInputChange}
            ></Form.Control>
          </Form.Group>
          {errors.password && (
            <div className="inputError">
              <p>{errors.password}</p>
            </div>
          )}
          <div className="buttonAndSpinner">
            <Button
              variant="outline-info"
              type="submit"
              className="loginButton"
              disabled={loading}
            >
              Entrar
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
          <br />
          <small>
            Não tem uma conta? Cadastre-se <Link to="/signup">aqui</Link>
          </small>
          {/* <div className="loginWithGoogleAndFacebook">
              <Form.Text className="text-muted">Ou faça login com:</Form.Text>
              <div className="socialForms">
                <button className="socialForm Google"></button>

                <button className="socialForm">
                  <FontAwesomeIcon icon={["fab", "facebook"]} />
                  <p>Login com Facebook</p>
                </button>
              </div>
            </div> */}
        </Form>
      </div>
    </>
  );
};

export default Login;
