import React, { Component } from "react";
import PropTypes from "prop-types";
import ProgressButton from "react-progress-button";
import { withAlert } from "react-alert";
import { character_names } from "../data/characters";
import axios from "axios";
var CancelToken = axios.CancelToken;
var cancel;
import { saveAs } from "file-saver/FileSaver";
// import openSocket from 'socket.io-client'
// const socket = openSocket(`http://${process.env.IP_ENV}:${process.env.PORT_ENV}`)
// ! Add sockets to remove data folder not being used
class Custom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonState: "",
      options: {
        skinName: "anything",
        variant: "00",
        character: "Speedrunner",
        characterIdx: 34
      }
    };
  }
  onUnload = event => {
    // the method that will be used for both add and remove event
    event.preventDefault();
    cancel();
  };
  beforeUnload = event => {
    // the method that will be used for both add and remove event
    event.returnValue = "sss";
  };

  componentDidMount() {
    window.addEventListener("onunload", this.onUnload);
  }

  componentWillUnmount() {
    window.removeEventListener("onunload", this.onUnload);
  }
  characterChange = e => {
    this.setState({
      options: {
        ...this.state.options,
        character: e.target.value,
        characterIdx:
          character_names[
            character_names.findIndex(obj => obj.name == e.target.value)
          ].id
      }
    });
  };
  variantChange = e => {
    this.setState({
      options: {
        ...this.state.options,
        variant: e.target.value
      }
    });
  };

  nameChange = e => {
    this.setState({
      options: {
        ...this.state.options,
        skinName: e.target.value
      }
    });
  };
  handleCreateCustom = e => {
    // this.props.alert.error(
    //   "This function is turned off for development purposes."
    // );
    // this.props.onClose(0, e);
    this.setState({ buttonState: "loading" });
    axios({
      method: "POST",
      url: `${process.env.IP_ENV}`,
      data: {
        frame_data: this.props.frameData,
        options: this.state.options
      },
      headers: {
        "Content-Type": "application/json"
      },
      responseType: "blob",
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c;
      })
    })
      .then(response => {
        this.setState({ buttonState: "success" });
        saveAs(
          new Blob([response.data], { type: "application/zip" }),
          `${this.state.options.skinName}.zip`
        );
      })
      .catch(error => {
        if (error.response.status === 403) {
          this.setState({ buttonState: "error" }, () => {
            setTimeout(() => {
              this.setState({ buttonState: "" });
            }, 2000);
          });
          console.log("Not allowed to request 2 things at a time.");
        } else {
          this.setState({ buttonState: "error" }, () => {
            setTimeout(() => {
              this.setState({ buttonState: "" });
            }, 2000);
          });
          console.log(error.response);
        }
      });
    e.preventDefault();
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
              onChange={e => this.nameChange(e)}
            />
            <small id="nameHelp" className="form-text text-muted">
              {this.state.options.skinName}
              .zip
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="exampleSelect1">Variant</label>
            <select
              value={this.state.options.variant}
              className="form-control"
              id="variant_select"
              onChange={e => this.variantChange(e)}
            >
              <option defaultValue="defaultValue" value="00">
                00
              </option>
              <option>01</option>
              <option>02</option>
              <option>03</option>
            </select>
            <small id="variantHelp" className="form-text text-muted">
              animation_atlas_variant
              {this.state.options.variant}
              .xnb
              <br />
              animation_variant
              {this.state.options.variant}
              .xnb
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="exampleSelect1">Character</label>
            <select
              value={this.state.options.character}
              className="form-control"
              id="character_select"
              onChange={e => this.characterChange(e)}
            >
              {character_names.map((character, idx) => {
                return (
                  <option data-index={character.id} key={idx}>
                    {character.name}
                  </option>
                );
              })}
            </select>
            <small id="variantHelp" className="form-text text-muted">
              Your skin will be made for: {this.state.options.character}
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
          <button onClick={e => this.props.onClose(0, e)} className="close-btn">
            Cancel
          </button>
        ) : null}
      </div>
    );
  }
}

Custom.propTypes = {
  onClose: PropTypes.func.isRequired,
  alert: PropTypes.object.isRequired,
  frameData: PropTypes.array.isRequired
};
export default withAlert(Custom);
