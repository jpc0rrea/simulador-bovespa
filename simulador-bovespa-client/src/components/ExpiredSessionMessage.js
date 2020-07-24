import React from "react";
import { Modal, Button } from "react-bootstrap";

function ExpiredSessionMessage(props) {
  function handleCloseButton() {
    localStorage.removeItem("token");
    props.history.push("/login");
  }
  return (
    <>
      <Modal
        show={true}
        onHide={handleCloseButton}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Sessão expirou!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Sua sessão expirou (limite de 1 hora). Você terá que fazer login
            novamente para continuar operando no Simulador.
          </p>
          <br />
          <p>Agora você será encaminhado para a página de login.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseButton}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ExpiredSessionMessage;
