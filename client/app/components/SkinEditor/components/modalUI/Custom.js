import React, { Component } from "react";
import PropTypes from "prop-types";
import ProgressButton from "react-progress-button";
import { withAlert } from "react-alert";
//! Backend doesn't take in multiple frames

class Custom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonState: ""
    };
  }
  handleCreateCustom = e => {
    e.preventDefault();
    this.props.alert.error(
      "This function is turned off for development purposes."
    );
    this.props.onClose(0, e);
    // this.setState({ buttonState: "loading" });
    // axios({
    //   method: "POST",
    //   url: `http://${process.env.IP_ENV}:${process.env.PORT_ENV}/skineditor`,
    //   data: {
    //     frame_data: this.props.frameData,
    //     variant: this.state.options.variant
    //   },
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   responseType: "blob"
    // })
    //   .then(response => {
    //     this.setState({ buttonState: "success" });
    //     saveAs(
    //       new Blob([response.data], { type: "application/zip" }),
    //       `${this.state.options.skinName}.zip`
    //     );
    //   })
    //   .catch(error => {
    //     if (error.response.status === 403) {
    //       this.setState({ buttonState: "error" }, () => {
    //         setTimeout(() => {
    //           this.setState({ buttonState: "" });
    //         }, 2000);
    //       });
    //       console.log("Not allowed to request 2 things at a time.");
    //     } else {
    //       this.setState({ buttonState: "error" }, () => {
    //         setTimeout(() => {
    //           this.setState({ buttonState: "" });
    //         }, 2000);
    //       });
    //       console.log(error.response);
    //     }
    //   });
  };
  render() {
    return (
      <div className="create-modal">
        <form>
          <div className="form-group">
            <label htmlFor="name">Skin Name</label>
            <input
              type="name"
              className="form-control"
              id="name"
              aria-describedby="nameHelp"
              placeholder="Enter name"
            />
            <small id="nameHelp" className="form-text text-muted">
              e.g., Superman.zip
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="exampleSelect1">Variant</label>
            <select
              value={this.props.variant}
              className="form-control"
              id="variant_select"
              onChange={e => this.props.variantSelect(e)}
            >
              <option defaultValue="defaultValue" value="00">
                00
              </option>
              <option>01</option>
              <option>02</option>
              <option>03</option>
            </select>
            <small id="variantHelp" className="form-text text-muted">
              e.g., animation_atlas_variant”00/01/02/03”.xnb
            </small>
          </div>
        </form>
        <ProgressButton
          onClick={e => this.handleCreateCustom(e)}
          state={this.state.buttonState}
        >
          Create Skin
        </ProgressButton>
        {this.state.buttonState != "loading" ? (
          <button
            onClick={e => this.props.onClose(468, e)}
            className="close-btn"
          >
            Cancel
          </button>
        ) : null}
      </div>
    );
  }
}

Custom.propTypes = {
  onClose: PropTypes.func.isRequired,
  variantSelect: PropTypes.func.isRequired,
  variant: PropTypes.string.isRequired,
  alert: PropTypes.object.isRequired
};
export default withAlert(Custom);
