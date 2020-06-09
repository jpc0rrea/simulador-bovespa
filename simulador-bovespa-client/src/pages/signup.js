import React, { useState } from "react";
import HeaderWithoutCredentials from "../components/HeaderWithoutCredentials";
import { Form, Button } from "react-bootstrap";

import api from "../services/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    lastName: "",
  });

  function handleInput(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await api.post("signup", formData).then((response) => {
      console.log(`Usuário criado com sucesso! Token: ${response.data.token}`);
      alert(`Usuário criado com sucesso! Token: ${response.data.token}`);
    });
  }

  return (
    <>
      <HeaderWithoutCredentials />
      <div className="loginForm">
        <h1 className="formTitle">
          Registre-se no <strong>Simulador Bovespa</strong>
        </h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>E-mail</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Digite o seu e-mail"
              onChange={handleInput}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Senha"
              onChange={handleInput}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Confirmação da senha</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirme sua senha"
              onChange={handleInput}
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Digite seu nome"
              onChange={handleInput}
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Sobrenome</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              placeholder="Digite seu sobrenome"
              onChange={handleInput}
            ></Form.Control>
          </Form.Group>

          <Button variant="outline-info" type="submit">
            Registrar
          </Button>
        </Form>
      </div>
    </>
  );
};

export default Signup;
