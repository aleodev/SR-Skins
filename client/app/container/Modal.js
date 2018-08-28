import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Fade from "react-reveal/Fade";

import Custom from "./ModalUI/Custom";
import Confirmation from "./ModalUI/Confirmation";
const modalRoot = document.getElementById("modal-root");
export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
  }
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
            frameData={this.props.frameData}
            onClose={this.props.onClose}
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
  frameData: PropTypes.array.isRequired,
  modalState: PropTypes.number
};
