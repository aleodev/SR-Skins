import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import Footer from "./Footer";
import Fade from "react-reveal/Fade";

const App = ({ children }) => (
  <React.Fragment>
    <Fade>
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
