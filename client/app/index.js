import React from "react";
import { render } from "react-dom";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import App from "./components/App/App";
import NotFound from "./components/App/NotFound";

import Home from "./components/Home/Home";

import Portal from "./components/SkinEditor/Portal";

import SkinEditor from "./components/SkinEditor/SkinEditor";

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
          <Route exact path="/skineditor" component={Portal} />
          <Route exact path="/skineditor/custom" component={SkinEditor} />
          <Route component={NotFound} />
        </Switch>
      </App>
    </Router>
  </AlertProvider>,
  document.getElementById("app")
);
