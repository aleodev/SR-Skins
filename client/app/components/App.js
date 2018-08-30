import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import Footer from "./Footer";

const App = ({ children }) => (
  <React.Fragment>
    <Header />

    <main>{children}</main>

    <Footer />
  </React.Fragment>
);

App.propTypes = {
  children: PropTypes.element
};
export default App;
