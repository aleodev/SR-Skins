import React, { Component } from "react";
import Fade from "react-reveal/Fade";
import update from "immutability-helper";
// Data
import { frame_names } from "./data/frames";
// Components
import Modal from "./Modal";
import Editor from "./Editor";
import Selector from "./Selector";
// Alerts
import { withAlert } from "react-alert";
//PropTypes
import PropTypes from "prop-types";
class SkinEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frames: frame_names.map(names => ({ name: names, image: [] })),
      active: null,
      modal: false,
      modalState: null
    };
  }
  componentDidMount() {
    console.log(frame_names);
  }
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

  fillAll = () => {
    this.setState(state => ({
      frames: state.frames.map((object, idx) => ({
        ...state.frames[idx],
        image: object.image.concat(
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAQAAACWCLlpAAAA3klEQVR42u3QQREAAAwCoNm/9Cr49iACOWpRIEuWLFmyZCmQJUuWLFmyFMiSJUuWLFkKZMmSJUuWLAWyZMmSJUuWAlmyZMmSJUuBLFmyZMmSpUCWLFmyZMlSIEuWLFmyZCmQJUuWLFmyFMiSJUuWLFkKZMmSJUuWLAWyZMmSJUuWAlmyZMmSJUuBLFmyZMmSpUCWLFmyZMlSIEuWLFmyZCmQJUuWLFmyFMiSJUuWLFkKZMmSJUuWLAWyZMmSJUuWAlmyZMmSJUuBLFmyZMmSpUCWLFmyZMlSIEuWLFmbHrcjAJdeLWiCAAAAAElFTkSuQmCC"
        )
      }))
    }));
  };
  alterFrameInput = (e, action, activeImg) => {
    e.preventDefault();
    let file = e.target.files[0],
      reader = new window.FileReader();
    if (file)
      // ! add img onload to give error on images about 150 height and 150 width
      reader.onload = e => {
        // var img = new Image();
        // img.src = e.target.result;
        // img.onload = () => {
        let type = e.target.result.match(/:\s*(.*?)\s*;/g).pop(),
          fixedType = type.substring(1, type.length - 1);
        if (fixedType == "image/png" || fixedType == "image/jpeg") {
          // if (img.width > 130 || img.height > 130) {
          //   this.props.alert.show(
          //     "The recommended height and width is 130x130."
          //   );
          // }
          switch (action) {
            case "custom":
              this.setState(state => ({
                frames: state.frames.map((object, idx) => ({
                  ...state.frames[idx],
                  image: object.image.concat(e.target.result)
                }))
              }));
              break;
            case "change":
              this.setState({
                frames: update(this.state.frames, {
                  [this.state.active]: {
                    image: {
                      [activeImg]: {
                        $set: e.target.result
                      }
                    }
                  }
                })
              });
              // this.setState(state => ({
              //   frames: state.frames.map((frame, frIdx) => {
              //     if (frIdx !== this.state.active) return frame;
              //     return {
              //       image: frame.image.map((image, imgIdx) => {
              //         if (imgIdx !== activeImg) return image;
              //         return e.target.result;
              //       })
              //     };
              //   })
              // }));

              break;
            case "add":
              this.setState({
                frames: update(this.state.frames, {
                  [this.state.active]: { image: { $push: [e.target.result] } }
                })
              });
            // this.setState(state => ({
            //   frames: state.frames.map((frame, frIdx) => {
            //     if (frIdx !== this.state.active) return frame;
            //     return {
            //       image: frame.image.concat(e.target.result)
            //     };
            //   })
            // }));
          }
        } else {
          this.props.alert.error(
            `The ${fixedType} format is not supported. Please upload a png or jpg/jpeg file.`
          );
        }
        // };
      };
    reader.readAsDataURL(file);
    e.target.value = null;
  };
  clearAll = () => {
    this.setState(state => ({
      frames: state.frames.map((object, idx) => ({
        ...state.frames[idx],
        image: []
      }))
    }));
  };

  showModal = (code, e) => {
    const modalCodes = [468, 599, 0];
    // 458 Custom Skin
    // 599 Clear All
    // 0 Close Modal
    e.preventDefault();
    if (modalCodes.includes(code)) {
      switch (code) {
        case 468:
          return !this.state.frames.every(x => x.image[0])
            ? this.props.alert.error(
                "Warning: Your skin will not work if you leave an animation empty."
              )
            : this.setState({
                modal: !this.state.modal,
                modalState: code
              });
        case 599:
          return this.setState({
            modal: !this.state.modal,
            modalState: code
          });
        case 0:
          return this.setState({
            modal: !this.state.modal,
            modalState: code
          });
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <Fade big>
          <div className="wrapper">
            <button onClick={this.fillAll}>Dev BTN</button>
            <Modal
              frameData={this.state.frames}
              show={this.state.modal}
              onClose={this.showModal}
              modalState={this.state.modalState}
              clearAll={this.clearAll}
            />
            <Editor
              frameData={this.state.frames}
              active={this.state.active}
              removeFrame={this.removeFrame}
              moveFrame={this.moveFrame}
              addTransparent={this.addTransparent}
              deleteActiveFrames={this.deleteActiveFrames}
              alter={this.alterFrameInput}
            />
            <Selector
              alter={this.alterFrameInput}
              frameData={this.state.frames}
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
