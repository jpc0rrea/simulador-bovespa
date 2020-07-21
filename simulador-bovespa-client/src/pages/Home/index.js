import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

import HeaderWithCredentials from "../../components/HeaderWithCredentials";

import api from "../../services/api";
// import useApiGet from "../../services/useApiGet";
// import useApiPost from "../../services/useApiPost";
import real from "../../services/real";

import "./styles.css";

const Home = ({ history }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [caixa, setCaixa] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
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
        let newTotalInvested = 0
        for (let company in portfoliObject) {
          portfolioArray.push({
            symbol: company,
            name: portfoliObject[company].name,
            price: portfoliObject[company].price,
            quantity: portfoliObject[company].quantity,
            total: portfoliObject[company].total,
          });
          newTotalInvested += portfoliObject[company].total
        }
        setTotalInvested(newTotalInvested);
        setPortfolio(portfolioArray);
        setDisplay(true);
      })
      .catch((err) => {
        // console.log(err.response.data);
        console.error(err)
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
          </tr>
        </thead>
        {display && (
          <>
            <tbody>
              {portfolio.map((symbolInPortfolio, index) => {
                return (
                  <tr key={index}>
                    <td>{symbolInPortfolio.symbol}</td>
                    <td>{symbolInPortfolio.name}</td>
                    <td>{symbolInPortfolio.quantity}</td>
                    <td>{real(symbolInPortfolio.price)}</td>
                    <td>{real(symbolInPortfolio.total)}</td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={4}>Caixa</td>
                <td>{real(caixa)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}>
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
