import React, { Component } from "react";
import PropTypes from "prop-types";
import { withAlert } from "react-alert";
class Confirmation extends Component {
  constructor(props) {
    super(props);
  }
  clear = e => {
    e.preventDefault();
    if (document.getElementById("check-clear").value == "speed") {
      this.props.clearAll();
      this.props.onClose(0, e);
      this.props.alert.show("Your animations have been cleared!");
    } else {
      this.props.onClose(0, e);

      this.props.alert.error(
        '"speed" must be entered to clear all of your frames.'
      );
    }
  };
  render() {
    return (
      <div className="create-modal">
        <form>
          <div className="form-group">
            <label htmlFor="name">
              Please enter the word &#34;
              <span style={{ color: "red" }}>speed</span>
              &#34;.
            </label>
            <input
              type="name"
              className="form-control"
              id="check-clear"
              placeholder="Enter &#34;speed&#34;"
            />
            <small id="nameHelp" className="form-text text-muted">
              Just to make sure you <b>REALLY</b> want to clear everything...
            </small>
          </div>
        </form>
        <button onClick={e => this.clear(e)} className="open-btn">
          Reset
        </button>
        <button onClick={e => this.props.onClose(0, e)} className="close-btn">
          Cancel
        </button>
      </div>
    );
  }
}
Confirmation.propTypes = {
  onClose: PropTypes.func.isRequired,
  clearAll: PropTypes.func.isRequired,
  code: PropTypes.number.isRequired,
  alert: PropTypes.object.isRequired
};
export default withAlert(Confirmation);
