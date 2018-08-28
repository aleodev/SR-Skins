import React from "react";
import { render } from "react-dom";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import App from "./components/App";
import NotFound from "./components/NotFound";

import Home from "./components/Home";

import Portal from "./components/Portal";

import SkinEditor from "./container/SkinEditor";

import "./styles/styles.scss";

import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-oldschool-dark";
const options = {
  position: "bottom center",
  timeout: 5000,
  offset: "30px",
  transition: "scale"
};

render(
  <AlertProvider template={AlertTemplate} {...options}>
    <Router>
      <App>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/editor" component={Portal} />
          <Route exact path="/editor/custom" component={SkinEditor} />
          <Route component={NotFound} />
        </Switch>
      </App>
    </Router>
  </AlertProvider>,
  document.getElementById("app")
);
