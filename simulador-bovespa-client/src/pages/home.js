import React, { Component } from "react";
import { HeaderWithoutCredentials } from "../components/HeaderWithoutCredentials";

export class home extends Component {
  render() {
    return (
      <div>
        <HeaderWithoutCredentials />
        <h1>Home page</h1>
      </div>
    );
  }
}

export default home;
