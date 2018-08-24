import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { withAlert } from "react-alert";
import Fade from "react-reveal/Fade";

import Custom from "./modalUI/Custom";
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
          />
        );
      case 599:
        return (
          <Custom
            onClose={this.props.onClose}
            variantSelect={this.variantSelect}
            variant={this.state.options.variant}
          />
        );
      case 958:
        return (
          <Custom
            onClose={this.props.onClose}
            variantSelect={this.variantSelect}
            variant={this.state.options.variant}
          />
        );
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
  alert: PropTypes.object.isRequired,
  modalState: PropTypes.number
};

export default withAlert(Modal);
