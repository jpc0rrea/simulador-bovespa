import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

// import { library } from "@fortawesome/fontawesome-svg-core";
// import { fab } from "@fortawesome/free-brands-svg-icons";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

// Pages
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Buy from "./pages/buy";
import Sell from "./pages/sell";
import History from "./pages/history";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#5e646b",
      main: "#343a40",
      dark: "#0e141a",
      contrastText: "#fff",
    },
    secondary: {
      light: "#d1d9ff",
      main: "#9fa8da",
      dark: "#6f79a8",
      contrastText: "#fff",
    },
  },
});

// library.add(fab);

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/buy" component={Buy} />
            <Route exact path="/sell" component={Sell} />
            <Route exact path="/history" component={History} />
          </Switch>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
