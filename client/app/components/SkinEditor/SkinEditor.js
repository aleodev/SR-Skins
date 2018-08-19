import React, { Component } from "react";
import Fade from "react-reveal/Fade";
import update from "immutability-helper";
// Data
import { frame_names } from "./info/frames";
// Buttons
// import {task_btn_handlers} from './buttons/btns_tasks'
// Components
// import FrameUploader from './components/frameUploader'
import Create from "./components/create";
import Editor from "./components/editor";
import Selector from "./components/selector";
// import openSocket from 'socket.io-client'

// const socket = openSocket(`http://${process.env.IP_ENV}:${process.env.PORT_ENV}`)

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
        this.setState({
          frames: update(this.state.frames, {
            [this.state.active]: { image: { $push: [e.target.result] } }
          })
        });
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
        this.setState({
          frames: update(this.state.frames, {
            [this.state.active]: {
              image: { [idx]: { $set: [e.target.result] } }
            }
          })
        });
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
    console.log("Not working.");
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
      console.log("Missed a frame");
    } else {
      this.setState({ modal: !this.state.modal });
    }
  };

  render() {
    return (
      <React.Fragment>
        <Fade big>
          <div className="wrapper">
            {/* <button onClick={this.testFillBtn}>CUNTAGE</button> */}
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

export default SkinEditor;
