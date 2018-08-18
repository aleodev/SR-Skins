import React from "react";
import PropTypes from "prop-types";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Fade from "react-reveal/Fade";

const App = ({ children }) => (
  <React.Fragment>
    <Fade big>
      <Header />

      <main>{children}</main>

      <Footer />
    </Fade>
  </React.Fragment>
);

App.propTypes = {
  children: PropTypes.element
};
export default App;
