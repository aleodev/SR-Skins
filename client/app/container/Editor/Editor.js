import React, { Component } from "react";
import PropTypes from "prop-types";
import { BlockPicker } from "react-color";
import { frame_names } from "../data/frames";
import Playback from "./Playback";
// import ReactTooltip from "react-tooltip";
const popover = {
  position: "absolute",
  zIndex: "2"
};
const cover = {
  position: "fixed",
  top: "0px",
  right: "0px",
  bottom: "0px",
  left: "0px"
};

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorColor: "#697689"
    };
  }
  openPicker = () => {
    this.setState({ displayPicker: true });
  };
  closePicker = () => {
    this.setState({ displayPicker: false });
  };
  changeColor = color => {
    this.setState({ editorColor: color.hex });
  };
  render() {
    const maxFrames = 9;
    return (
      <section id="editor" className="row row-eq-height">
        <div
          style={{
            backgroundColor: this.state.editorColor
          }}
          className={`configure col-12 ${
            this.props.active !== null ? "col-xl-9" : "col-xl-12"
          }`}
        >
          {this.props.active == null ? (
            <div className="notactive align-middle">Nothing Active</div>
          ) : (
            <div>
              <p className="h3">{frame_names[this.props.active]}</p>
              <div
                className="options btn-group"
                role="group"
                aria-label="Button group with nested dropdown"
              >
                <input
                  id="newFrame"
                  className="custom-file-input"
                  onChange={e => this.props.alter(e, "add")}
                  name="Select File"
                  type="file"
                />
                {/* <ReactTooltip place="top" type="light" effect="solid" /> */}
                {this.props.frameData[this.props.active].image.length >=
                maxFrames ? (
                  <label type="button" className="btn btn-success disabled">
                    Add Frame
                  </label>
                ) : (
                  <label
                    type="button"
                    className="btn btn-success"
                    htmlFor="newFrame"
                    // data-tip="Max Frames: <span style={{color: 'red'}}></span>"
                  >
                    Add Frame
                  </label>
                )}

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={this.openPicker}
                >
                  BG Color
                </button>
                {this.state.displayPicker ? (
                  <div style={popover}>
                    <div style={cover} onClick={this.closePicker} />
                    <BlockPicker
                      color={this.state.editorColor}
                      onChangeComplete={this.changeColor}
                    />
                  </div>
                ) : null}
                <div className="btn-group" role="group">
                  <button
                    id="btnGroupDrop1"
                    type="button"
                    className="btn btn-secondary dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Frames
                  </button>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="btnGroupDrop1"
                  >
                    <a
                      className="dropdown-item"
                      onClick={this.props.deleteActiveFrames}
                    >
                      Clear All
                    </a>
                    <a
                      className="dropdown-item"
                      onClick={this.props.addTransparent}
                    >
                      Add Transparent
                    </a>
                  </div>
                </div>
              </div>
              <hr />
              <div id="frames">
                {this.props.frameData[this.props.active].image.map(
                  (img, idx) => {
                    return (
                      <div key={idx} data-key={idx} className="frameHolder">
                        <div
                          className="btn-group-sm"
                          role="group"
                          aria-label="Basic example"
                        >
                          <button
                            type="button"
                            className="sideBtn btn-sm btn-primary"
                            onClick={() => this.props.moveFrame(idx, "l")}
                          >
                            <i className="fas fa-arrow-left" />
                          </button>
                          <button
                            type="button"
                            className="sideBtn btn-sm btn-primary"
                            onClick={() => this.props.moveFrame(idx, "r")}
                          >
                            <i className="fas fa-arrow-right" />
                          </button>
                        </div>
                        <img src={img} />
                        <div
                          className="btn-group-sm"
                          role="group"
                          aria-label="Basic example"
                        >
                          <div className="change-frame-button-wrapper">
                            <label
                              htmlFor={"upload-" + idx}
                              className="btn btn-info"
                            >
                              <i className="fas fa-file" />
                            </label>
                            <input
                              id={"upload-" + idx}
                              className="custom-file-input"
                              onChange={e => this.props.alter(e, "change", idx)}
                              name="Select File"
                              type="file"
                            />
                          </div>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => this.props.removeFrame(idx)}
                          >
                            <i className="fas fa-trash-alt" />
                          </button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>
        {this.props.active !== null ? (
          <Playback
            editorColor={this.state.editorColor}
            active={this.props.active}
            frameData={this.props.frameData}
          />
        ) : null}
      </section>
    );
  }
}
Editor.defaultProps = {
  active: null
};
Editor.propTypes = {
  frameData: PropTypes.array.isRequired,
  active: PropTypes.number,
  deleteActiveFrames: PropTypes.func.isRequired,
  addTransparent: PropTypes.func.isRequired,
  moveFrame: PropTypes.func.isRequired,
  removeFrame: PropTypes.func.isRequired,
  alter: PropTypes.func.isRequired
};
