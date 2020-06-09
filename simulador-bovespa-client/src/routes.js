import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Buy from "./pages/Buy";
import Sell from "./pages/Sell";
import History from "./pages/History";

const Routes = () => {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/buy" component={Buy} />
      <Route exact path="/sell" component={Sell} />
      <Route exact path="/history" component={History} />
    </Router>
  );
};

export default Routes
