import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import ProgressButton from "react-progress-button";
import axios from "axios";
var CancelToken = axios.CancelToken;
var source = CancelToken.source();
import { saveAs } from "file-saver/FileSaver";
const modalRoot = document.getElementById("modal-root");
const textMuted = { color: "rgb(179, 179, 179)" };
export default class Create extends Component {
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
    source.cancel();
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
    axios({
      method: "POST",
      url: `http://${process.env.IP_ENV}:${process.env.PORT_ENV}/skineditor`,
      data: {
        frame_data: this.props.curState.frames,
        options: this.props.curState.options
      },
      headers: {
        "Content-Type": "application/json"
      },
      responseType: "blob",
      cancelToken: source.token
    })
      .then(response => {
        this.setState({ buttonState: "success" });
        saveAs(
          new Blob([response.data], { type: "application/zip" }),
          "skin.zip"
        );
      })
      .catch(error => {
        if (axios.isCancel(error)) {
          console.log("post cancelled ");
          this.setState({ buttonState: "error" }, () => {
            setTimeout(() => {
              this.setState({ buttonState: "" });
            }, 2000);
          });
        }
        // else if (error.response.status === 403) {
        //   this.setState({ buttonState: "error" }, () => {
        //     setTimeout(() => {
        //       this.setState({ buttonState: "" });
        //     }, 2000);
        //   });
        //   console.log("Not allowed to request 2 things at a time.");
        // } else {
        //   this.setState({ buttonState: "error" }, () => {
        //     setTimeout(() => {
        //       this.setState({ buttonState: "" });
        //     }, 2000);
        //   });
        //   // console.log(error.response);
        //   console.log("Internal Error");
        // }
      });
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
              <small id="nameHelp" style={textMuted} className="form-text">
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
              <small id="variantHelp" style={textMuted} className="form-text">
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
            <button onClick={e => this.onClose(e)} className="close-btn">
              Cancel
            </button>
            <div className="clearfix" />
          </div>
        </div>
      </div>
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
  curState: PropTypes.object.isRequired
};
