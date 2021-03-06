import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

import real from "../services/real";

import './Messages/styles.css'

function SellConfirmation(props) {
  const [companyName] = useState(props.companyName);
  const [price] = useState(props.price);
  const [quantity] = useState(props.quantity);
  const [symbol] = useState(props.symbol);
  const [total] = useState(props.total);

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
            Confirmação de venda
          </Modal.Title>
        </Modal.Header>
        {quantity > 1 && (
          <>
            <Modal.Body>
              <p>
                Você vendeu {quantity} ações de {companyName} ({symbol}).
                <br />
                Cada ação foi vendida por {real(price)}. <br />
                Total: {real(total)}
              </p>
              <br />
              <p>
                Agora você será encaminhado para a página inicial do Simulador.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={props.onHide}>Ok</Button>
            </Modal.Footer>
          </>
        )}
        {quantity === 1 && (
          <>
            <Modal.Body>
              <p>
                Você vendeu {quantity} ação de {companyName} ({symbol}) por{" "}
                {real(price)}.
              </p>
              <br />
              <p>
                Agora você será encaminhado para a página inicial do Simulador.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={props.onHide}>Ok</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
}

export default SellConfirmation;