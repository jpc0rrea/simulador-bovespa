import React from "react";

import HeaderWithCredentials from "../../components/HeaderWithCredentials";
import HeaderWithoutCredentials from "../../components/HeaderWithoutCredentials";
import api from "../../services/api";

const Home = ({ history }) => {
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
      console.log(response.data);
    })
    .catch((err) => {
      console.log(err.response.data);
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
  return (
    <>
      <HeaderWithCredentials />
      <h1>Home page</h1>
    </>
  );
};

export default Home;
