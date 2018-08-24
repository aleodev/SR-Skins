import React, { Component } from "react";
import PropTypes from "prop-types";
import { BlockPicker } from "react-color";
import { frame_names } from "../data/frames";
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
    return (
      <section id="editor" className="row row-eq-height">
        <div
          style={{
            backgroundColor: this.state.editorColor
          }}
          className="configure col-sm-12 col-md-12 col-lg-12 col-xl-9"
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
                      Delete Row
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
                              onChange={e => this.props.changeFrame(e, idx)}
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
              {this.props.frameData[this.props.active].image.length >= 6 ? (
                <div />
              ) : (
                <div className="new-frame-button-wrapper">
                  <label
                    htmlFor="newFrame"
                    id="new-frame-button"
                    className="button button-glow button-circle button-action button-jumbo"
                  >
                    <i className="fas fa-plus" />
                  </label>
                  <input
                    id="newFrame"
                    className="custom-file-input"
                    onChange={e => this.props.addFrame(e)}
                    name="Select File"
                    type="file"
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <div
          className="playback col-sm-12 col-md-12 col-lg-12 col-xl-3"
          style={{
            backgroundColor: this.state.editorColor
          }}
        >
          {this.props.active == null ? (
            <div className="not-active align-middle">Nothing Active</div>
          ) : (
            <div className="btn-group" role="group" aria-label="Basic example">
              <button type="button" className="btn btn-secondary">
                <i className="fas fa-chevron-left" />
              </button>
              <button type="button" className="btn btn-secondary">
                <i className="fas fa-play" />
              </button>
              <button type="button" className="btn btn-secondary">
                <i className="fas fa-stop" />
              </button>
              <button type="button" className="btn btn-secondary">
                <i className="fas fa-chevron-right" />
              </button>
            </div>
          )}
        </div>
        <div className="clearfix" />
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
  changeFrame: PropTypes.func.isRequired,
  removeFrame: PropTypes.func.isRequired,
  addFrame: PropTypes.func.isRequired
};
