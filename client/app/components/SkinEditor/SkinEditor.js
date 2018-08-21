import React, { Component } from "react";
import Fade from "react-reveal/Fade";
import update from "immutability-helper";
// Data
import { frame_names } from "./info/frames";
// Components
import Create from "./components/create";
import Editor from "./components/editor";
import Selector from "./components/selector";
// Alerts
import { withAlert } from "react-alert";
//PropTypes
import PropTypes from "prop-types";
// import openSocket from 'socket.io-client'

// const socket = openSocket(`http://${process.env.IP_ENV}:${process.env.PORT_ENV}`)
// ! Add sockets to remove data folder not being used
// ! Add a button group on the top of the editor, to remove all frame and add single custom image to all frames
// ! Add algorithm to check for entire packed image dimensions, and ask pop for max to decline past max
// ! Fix double-jump-fall width button on selector
class SkinEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frames: frame_names.map(names => ({ name: names, image: [] })),
      active: null,
      modal: false
    };
  }
  addFrame = e => {
    e.preventDefault();
    let file = e.target.files[0],
      reader = new window.FileReader();
    if (file)
      reader.onload = e => {
        let type = e.target.result.match(/:\s*(.*?)\s*;/g).pop(),
          fixedType = type.substring(1, type.length - 1);
        fixedType == "image/png" || fixedType == "image/jpeg"
          ? this.setState({
              frames: update(this.state.frames, {
                [this.state.active]: { image: { $push: [e.target.result] } }
              })
            })
          : this.props.alert.error(
              `The ${fixedType} format is not supported. Please upload a png or jpg file.`
            );
      };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  removeFrame = idx => {
    this.setState({
      frames: update(this.state.frames, {
        [this.state.active]: { image: { $splice: [[idx, 1]] } }
      })
    });
  };

  moveFrame = (idx, dir) => {
    let actIdx = this.state.active,
      actImgs = this.state.frames[actIdx].image,
      nextIdx = dir == "l" ? idx-- : idx++;
    function swap(a, i, j) {
      a = a.slice();
      [a[i], a[j]] = [a[j], a[i]];
      return a;
    }
    if (actImgs[idx] != null) {
      this.setState({
        frames: update(this.state.frames, {
          [actIdx]: {
            image: {
              $set: swap(actImgs, idx, nextIdx)
            }
          }
        })
      });
    }
  };
  changeFrame = (e, idx) => {
    e.preventDefault();
    let file = e.target.files[0],
      reader = new window.FileReader();
    if (file)
      reader.onload = e => {
        let type = e.target.result.match(/:\s*(.*?)\s*;/g).pop(),
          fixedType = type.substring(1, type.length - 1);
        fixedType == "image/png" || fixedType == "image/jpeg"
          ? this.setState({
              frames: update(this.state.frames, {
                [this.state.active]: {
                  image: { [idx]: { $set: [e.target.result] } }
                }
              })
            })
          : this.props.alert.error(
              `The ${fixedType} format is not supported. Please upload a png or jpg/jpeg file.`
            );
      };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  deleteActiveFrames = () => {
    this.setState({
      frames: update(this.state.frames, {
        [this.state.active]: { image: { $set: [] } }
      })
    });
  };

  addTransparent = () => {
    this.props.alert.show("This button is currently not working.");
  };

  handleActive = idx => {
    this.setState({ active: idx });
  };

  testFillBtn = () => {
    this.setState(state => ({
      frames: state.frames.map(object => ({
        image: object.image.concat(
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAQAAACWCLlpAAAA3klEQVR42u3QQREAAAwCoNm/9Cr49iACOWpRIEuWLFmyZCmQJUuWLFmyFMiSJUuWLFkKZMmSJUuWLAWyZMmSJUuWAlmyZMmSJUuBLFmyZMmSpUCWLFmyZMlSIEuWLFmyZCmQJUuWLFmyFMiSJUuWLFkKZMmSJUuWLAWyZMmSJUuWAlmyZMmSJUuBLFmyZMmSpUCWLFmyZMlSIEuWLFmyZCmQJUuWLFmyFMiSJUuWLFkKZMmSJUuWLAWyZMmSJUuWAlmyZMmSJUuBLFmyZMmSpUCWLFmyZMlSIEuWLFmbHrcjAJdeLWiCAAAAAElFTkSuQmCC"
        )
      }))
    }));
  };
  showModal = e => {
    e.preventDefault();
    if (this.state.modal) {
      this.setState({ modal: !this.state.modal });
    } else if (!this.state.frames.every(x => x.image[0])) {
      this.props.alert.error(
        "Warning: Your skin will not work if you leave an animation empty."
      );
    } else {
      this.setState({ modal: !this.state.modal });
    }
  };

  render() {
    return (
      <React.Fragment>
        <Fade big>
          <div className="wrapper">
            <button onClick={this.testFillBtn}>Dev BTN</button>
            <Create
              curState={this.state}
              show={this.state.modal}
              onClose={this.showModal}
            />
            <Editor
              curState={this.state}
              addFrame={this.addFrame}
              removeFrame={this.removeFrame}
              moveFrame={this.moveFrame}
              changeFrame={this.changeFrame}
              addTransparent={this.addTransparent}
              deleteActiveFrames={this.deleteActiveFrames}
            />
            <Selector
              curState={this.state}
              changeActive={this.handleActive}
              showModal={this.showModal}
            />
          </div>
        </Fade>
      </React.Fragment>
    );
  }
}
SkinEditor.propTypes = {
  alert: PropTypes.object.isRequired
};
export default withAlert(SkinEditor);
