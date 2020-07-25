import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

import HeaderWithCredentials from "../../components/HeaderWithCredentials";
import ExpiredSessionMessage from "../../components/ExpiredSessionMessage";

import api from "../../services/api";
import real from "../../services/real";

const History = ({ history }) => {
  const [userHistory, setUserHistory] = useState([]);
  const [display, setDisplay] = useState(false);
  const [expiredSession, setExpiredSession] = useState(false);
  const [caixa, setCaixa] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setExpiredSession(true);
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    api
      .get("caixa", {
        headers,
      })
      .then((response) => {
        const userCaixa = response.data.caixa;
        setCaixa(userCaixa);
      })
      .catch((err) => {
        console.error(err);
        if (err.response.data.code === "auth/id-token-expired") {
          // Usuário fez login a mais de 1 hora
          // Hora de renovar o token dele
          setExpiredSession(true);
        } else if (err.response.data.code === "auth/argument-error") {
          // ainda não tem nenhum token na session do usuário
          setExpiredSession(true);
        }
      });
    api
      .get("getAllTransactions", {
        headers,
      })
      .then((response) => {
        setUserHistory(response.data);
        setDisplay(true);
      })
      .catch((err) => {
        console.error(err);
        if (err.response.data.code === "auth/id-token-expired") {
          // Usuário fez login a mais de 1 hora
          // Hora de renovar o token dele
          setExpiredSession(true);
        } else if (err.response.data.code === "auth/argument-error") {
          // ainda não tem nenhum token na session do usuário
          setExpiredSession(true);
        }
      });
  }, []);
  return (
    <>
      <HeaderWithCredentials caixa={real(caixa)}/>
      {expiredSession && <ExpiredSessionMessage history={history} />}
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
                const date = new Date(transaction.transactedAt);
                const year = date.getFullYear();
                const month =
                  date.getMonth() + 1 < 10
                    ? "0" + (date.getMonth() + 1)
                    : date.getMonth() + 1 === 13
                    ? "01"
                    : date.getMonth() + 1;
                const day =
                  date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                const hours = date.getHours();
                const minutes =
                  date.getMinutes() < 10
                    ? "0" + date.getMinutes()
                    : date.getMinutes();
                return (
                  <tr key={index}>
                    <td>{transaction.symbol}</td>
                    <td>{transaction.companyName}</td>
                    <td>{transaction.quantity}</td>
                    <td>{real(transaction.price)}</td>
                    <td>{real(transaction.total)}</td>
                    <td>{real(transaction.type)}</td>
                    <td>{`${day}/${month}/${year} - ${hours}:${minutes}`}</td>
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
