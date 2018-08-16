import React from "react";
import PropTypes from "prop-types";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

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
