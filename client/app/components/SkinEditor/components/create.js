import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import ProgressButton from "react-progress-button";
import { withAlert } from "react-alert";
import Fade from "react-reveal/Fade";
// import axios from "axios";
// import { saveAs } from "file-saver/FileSaver";
const modalRoot = document.getElementById("modal-root");
class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonState: "",
      options: {
        variant: "00"
      }
    };
    this.el = document.createElement("div");
  }
  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };
  variantSelect = e => {
    this.setState({
      options: {
        ...this.state.options,
        variant: e.target.value
      }
    });
  };

  //! Backend doesn't take in multiple frames
  handleCreateCustom = e => {
    this.props.alert.error(
      "This function is turned off for development purposes."
    );
    this.props.onClose(e);
    // this.setState({ buttonState: "loading" });
    // axios({
    //   method: "POST",
    //   url: `http://${process.env.IP_ENV}:${process.env.PORT_ENV}/skineditor`,
    //   data: {
    //     frame_data: this.props.curState.frames,
    //     options: this.props.curState.options
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
    //       "skin.zip"
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
    e.preventDefault();
  };
  componentDidMount() {
    modalRoot.appendChild(this.el);
  }
  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }
  render() {
    var modalUI = (
      <Fade>
        <div className="backdrop">
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
                  value={this.state.options.variant}
                  className="form-control"
                  id="variant_select"
                  onChange={e => this.variantSelect(e)}
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
            <div>
              <ProgressButton
                onClick={e => this.handleCreateCustom(e)}
                state={this.state.buttonState}
              >
                Create Skin
              </ProgressButton>
              {this.state.buttonState != "loading" ? (
                <button onClick={e => this.onClose(e)} className="close-btn">
                  Cancel
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </Fade>
    );
    if (!this.props.show) {
      return null;
    }
    return ReactDOM.createPortal(modalUI, this.el);
  }
}

Create.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  curState: PropTypes.object.isRequired,
  alert: PropTypes.object.isRequired
};

export default withAlert(Create);
