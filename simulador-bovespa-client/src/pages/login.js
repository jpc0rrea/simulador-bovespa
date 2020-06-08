import React, { Component } from "react";
import HeaderWithoutCredentials from "../components/HeaderWithoutCredentials";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class login extends Component {
  render() {
    return (
      <>
        <HeaderWithoutCredentials />
        <div className="loginForm">
          <h1 className="formTitle">
            Faça login no <strong>Simulador Bovespa</strong>
          </h1>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>E-mail</Form.Label>
              <Form.Control type="email" placeholder="Digite o seu e-mail" />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Senha</Form.Label>
              <Form.Control type="password" placeholder="Senha"></Form.Control>
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
  }
}

export default login;
