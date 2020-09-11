import React, {useState} from "react";
import { Modal, Button } from "react-bootstrap";

import "./styles.css";

function SentEmailMessage(props) {
  const [email] = useState(props.email);
  return (
    <>
      <Modal
        show={true}
        onHide={props.onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            E-mail de redefinição de senha enviado
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Enviamos um e-mail de redefinição de senha para {email}
          </p>
          <br />
          <p>Agora você será encaminhado para a página inicial do Simulador.</p>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={props.onHide}>Ok</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SentEmailMessage
