import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Fade from "react-reveal/Fade";

import Custom from "./modalUI/Custom";
import Confirmation from "./modalUI/Confirmation";
// import axios from "axios";
// import { saveAs } from "file-saver/FileSaver";
const modalRoot = document.getElementById("modal-root");
class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        skinName: "",
        variant: "00"
      }
    };
    this.el = document.createElement("div");
  }
  onClose = (code, e) => {
    this.props.onClose && this.props.onClose(code, e);
  };
  variantSelect = e => {
    this.setState({
      options: {
        ...this.state.options,
        variant: e.target.value
      }
    });
  };
  componentDidMount() {
    modalRoot.appendChild(this.el);
  }
  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }
  changeModalUI = () => {
    switch (this.props.modalState) {
      case 468:
        return (
          <Custom
            onClose={this.props.onClose}
            variantSelect={this.variantSelect}
            variant={this.state.options.variant}
            clearAll={this.props.clearAll}
          />
        );
      case 599:
        return (
          <Confirmation
            onClose={this.props.onClose}
            code={this.props.modalState}
            clearAll={this.props.clearAll}
          />
        );
      // case 958:
      //   return (
      //     <Custom
      //       onClose={this.props.onClose}
      //       variantSelect={this.variantSelect}
      //       variant={this.state.options.variant}
      //     />
      //   );
    }
  };

  render() {
    var modalUI = (
      <Fade>
        <div className="backdrop">{this.changeModalUI()}</div>
      </Fade>
    );
    if (!this.props.show) {
      return null;
    }
    return ReactDOM.createPortal(modalUI, this.el);
  }
}
Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  clearAll: PropTypes.func.isRequired,
  modalState: PropTypes.number
};

export default Modal;
