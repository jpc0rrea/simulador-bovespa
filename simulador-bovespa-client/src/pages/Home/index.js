import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

import HeaderWithCredentials from "../../components/HeaderWithCredentials";
import ExpiredSessionMessage from "../../components/ExpiredSessionMessage";

import api from "../../services/api";
import real from "../../services/real";
// import useApiGet from "../../services/useApiGet";
// import useApiPost from "../../services/useApiPost";

import "./styles.css";

const Home = ({ history }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [caixa, setCaixa] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [display, setDisplay] = useState(false);
  const [expiredSession, setExpiredSession] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setExpiredSession(true);
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    api
      .get("", {
        headers: headers,
      })
      .then((response) => {
        const userCaixa = response.data.caixa;
        setCaixa(userCaixa);
        const portfoliObject = response.data.data;

        // Convertendo a resposta (objeto) em array
        const portfolioArray = [];
        let newTotalInvested = 0;
        for (let company in portfoliObject) {
          portfolioArray.push({
            symbol: company,
            name: portfoliObject[company].name,
            price: portfoliObject[company].price,
            quantity: portfoliObject[company].quantity,
            total: portfoliObject[company].total,
            averagePrice: portfoliObject[company].averagePrice,
            profitLoss:
              portfoliObject[company].total -
              portfoliObject[company].averagePrice *
                portfoliObject[company].quantity,
          });
          newTotalInvested += portfoliObject[company].total;
        }
        // ordenar o array por total em carteira
        portfolioArray.sort(
          (a, b) => parseFloat(b.total) - parseFloat(a.total)
        );
        setTotalInvested(newTotalInvested);
        setPortfolio(portfolioArray);
        setDisplay(true);
      })
      .catch((err) => {
        // console.log(err.response.data);
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
      <HeaderWithCredentials caixa={real(caixa)} />
      {expiredSession && <ExpiredSessionMessage history={history} />}
      <Table responsive>
        <thead>
          <tr>
            <th>Ação</th>
            <th>Nome</th>
            <th>Quantidade</th>
            <th>Preço Médio</th>
            <th>Preço atual</th>
            <th>Total</th>
            <th>Lucro/ Prejuízo</th>
          </tr>
        </thead>
        {display && (
          <>
            <tbody>
              {portfolio.map((symbolInPortfolio, index) => {
                return (
                  <tr
                    key={index}
                    className={
                      symbolInPortfolio.profitLoss < 0 ? "loss" : "profit"
                    }
                  >
                    <td>{symbolInPortfolio.symbol}</td>
                    <td>{symbolInPortfolio.name}</td>
                    <td>{symbolInPortfolio.quantity}</td>
                    <td>{real(symbolInPortfolio.averagePrice)}</td>
                    <td>{real(symbolInPortfolio.price)}</td>
                    <td>{real(symbolInPortfolio.total)}</td>
                    <td>{real(symbolInPortfolio.profitLoss)}</td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={6}>Caixa</td>
                <td>{real(caixa)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className={totalInvested + caixa < 10000 ? "loss" : "profit"}>
                <td colSpan={6}>
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>{real(totalInvested + caixa)}</strong>
                </td>
              </tr>
            </tfoot>
          </>
        )}
      </Table>
    </>
  );
};

export default Home;
