import React from "react";
import { Link } from "react-router-dom";

// Material UI stuff
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

const HeaderWithCredentials = () => {
  return (
    <>
      <AppBar>
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Início
          </Button>
          <Button color="inherit" component={Link} to="/buy">
            Compra
          </Button>
          <Button color="inherit" component={Link} to="/sell">
            Venda
          </Button>
          <Button color="inherit" component={Link} to="/history">
            Histórico
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default HeaderWithCredentials;
