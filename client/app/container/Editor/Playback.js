import React, { Component } from "react";
import PropTypes from "prop-types";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
// import clone from "clone";

export default class Playback extends Component {
  iteration = 0;
  constructor(props) {
    super(props);
    this.state = {
      playback: this.props.frameData,
      activeImage: 0,
      isPlaying: false,
      speed: 50
    };
  }

  componentDidUpdate() {
    if (this.state.isPlaying) {
      setTimeout(this.playing, this.state.speed);
    }
  }
  playing = () => {
    let arrLength = this.props.frameData[this.props.active].image.length;
    if (this.iteration >= arrLength - 1) {
      this.iteration = 0;
      this.setState({ isPlaying: false });
      return;
    }
    this.iteration += 1;
    this.setState({ rand: Math.random() });
  };
  playFrames = () => {
    if (this.state.isPlaying) return;
    this.setState({
      isPlaying: true
    });
  };

  stepFrame = dir => {
    let arrLength = this.props.frameData[this.props.active].image.length;
    dir == "left"
      ? this.iteration - 1 < 0
        ? (this.iteration = arrLength - 1)
        : (this.iteration -= 1)
      : this.iteration + 1 == arrLength
        ? (this.iteration = 0)
        : (this.iteration += 1);
    this.setState({ rand: Math.random() });
  };
  changeSpeed = value => {
    this.setState({
      speed: value
    });
  };
  render() {
    const { speed } = this.state;
    const horizontalLabels = {
      50: "60fps",
      80: "40fps",
      110: "20fps"
    };
    if (this.props.frameData[this.props.active].image.length > 0) {
      return (
        <div
          className="playback col-sm-12 col-md-12 col-lg-12 col-xl-3"
          style={{
            backgroundColor: this.props.editorColor
          }}
        >
          <div>
            <div className="btn-group" role="group" aria-label="Basic example">
              <button
                onClick={() => this.stepFrame("left")}
                type="button"
                className="btn btn-secondary"
              >
                <i className="fas fa-chevron-left" />
              </button>
              <button
                onClick={this.playFrames}
                type="button"
                className="btn btn-secondary"
              >
                <i className="fas fa-play" />
              </button>
              <button
                onClick={() => this.stepFrame("right")}
                type="button"
                className="btn btn-secondary"
              >
                <i className="fas fa-chevron-right" />
              </button>
            </div>
            <div className="img-container">
              <img
                src={
                  this.props.frameData[this.props.active].image[this.iteration]
                }
              />
            </div>
            <div
              className="slider custom-labels"
              style={{ padding: "20px 0 30px" }}
            >
              <Slider
                min={50}
                max={110}
                value={speed}
                labels={horizontalLabels}
                tooltip={false}
                onChange={this.changeSpeed}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div
          className="playback col-sm-12 col-md-12 col-lg-12 col-xl-3"
          style={{
            backgroundColor: this.props.editorColor
          }}
        >
          <div className="not-active align-middle">Animation Empty</div>
        </div>
      );
    }
  }
}
Playback.defaultProps = {
  active: null
};
Playback.propTypes = {
  frameData: PropTypes.array.isRequired,
  active: PropTypes.number,
  editorColor: PropTypes.string.isRequired
};
