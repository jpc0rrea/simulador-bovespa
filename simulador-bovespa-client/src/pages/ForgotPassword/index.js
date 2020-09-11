import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

import HeaderWithoutCredentials from "../../components/HeaderWithoutCredentials";
import SentEmailMessage from "../../components/SentEmailMessage";
import api from "../../services/api";

import "./styles.css";

const ForgotPassword = ({ history }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailMessage, setShowEmailMessage] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    api
      .post("changepassword", {
        email,
      })
      .then((response) => {
        setLoading(false);
        setShowEmailMessage(true);
      })
      .catch((err) => {
        setLoading(false);
        alert(err.code);
      });
  };
  return (
    <>
      <HeaderWithoutCredentials />
      {showEmailMessage && (
        <SentEmailMessage email={email} onHide={() => history.push("/")} />
      )}
      <div className="forgotPasswordForm">
        <h1 className="formTitle">
          Digite o e-mail cadastrado na sua conta do{" "}
          <strong>Simulador Bovespa</strong>
        </h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label id="email-label">E-mail</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Digite o e-mail cadastrado no simulador"
              onChange={(event) => setEmail(event.target.value)}
            />
          </Form.Group>
          <div className="buttonAndSpinner">
            <Button
              variant="outline-info"
              type="submit"
              className="loginButton"
              disabled={loading}
            >
              Enviar e-mail para troca de senha
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

export default ForgotPassword;
