import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import HeaderWithCredentials from "../../components/HeaderWithCredentials";

import api from "../../services/api";
import real from "../../services/real";

const History = ({ history }) => {
  const [userHistory, setUserHistory] = useState([]);
  const [display, setDisplay] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    api
      .get("getAllTransactions", {
        headers,
      })
      .then((response) => {
        console.log(response.data);
        setUserHistory(response.data);
        setDisplay(true);
      })
      .catch((err) => {
        console.error(err);
        if (err.response.data.code === "auth/id-token-expired") {
          // Usuário fez login a mais de 1 hora
          // Hora de renovar o token dele
          localStorage.removeItem("token");
          history.push("/login");
        } else if (err.response.data.code === "auth/argument-error") {
          // ainda não tem nenhum token na session do usuário
          history.push("/login");
        }
      });
  }, []);
  return (
    <>
      <HeaderWithCredentials />
      <Table responsive>
        <thead>
          <tr>
            <th>Ação</th>
            <th>Nome</th>
            <th>Quantidade</th>
            <th>Preço</th>
            <th>Total</th>
            <th>Tipo</th>
            <th>Data</th>
          </tr>
        </thead>
        {display && (
          <>
            <tbody>
              {userHistory.map((transaction, index) => {
                return (
                  <tr key={index}>
                    <td>{transaction.symbol}</td>
                    <td>{transaction.name}</td>
                    <td>{transaction.quantity}</td>
                    <td>{real(transaction.price)}</td>
                    <td>{real(transaction.total)}</td>
                    <td>{real(transaction.type)}</td>
                    <td>{real(transaction.transactedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </>
        )}
      </Table>
    </>
  );
};

export default History;
