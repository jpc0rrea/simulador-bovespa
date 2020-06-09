import React, { useState } from "react";
import HeaderWithoutCredentials from "../../components/HeaderWithoutCredentials";
import { Form, Button } from "react-bootstrap";

import api from "../../services/api";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("Enviei!", formData);

    await api
      .post("login", formData)
      .then((response) => {
        console.log("Usuário logado com sucesso! Token: ", response.data);
        alert(
          `Usuário logado com sucesso. O login dele é: ${response.data.token}`
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <>
      <HeaderWithoutCredentials />
      <div className="loginForm">
        <h1 className="formTitle">
          Faça login no <strong>Simulador Bovespa</strong>
        </h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>E-mail</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Digite o seu e-mail"
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Senha"
              onChange={handleInputChange}
            ></Form.Control>
          </Form.Group>

          <Button variant="outline-info" type="submit">
            Entrar
          </Button>
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
