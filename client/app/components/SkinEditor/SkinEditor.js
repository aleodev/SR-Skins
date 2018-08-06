import React, { Component } from 'react'
// import $ from 'jquery'
import {frame_names} from './info/frames'
import {change} from './buttons/change'
import {make} from './buttons/make'
// import openSocket from 'socket.io-client'
// const socket = openSocket(`http://${process.env.IP_ENV}:${process.env.PORT_ENV}`)

class SkinEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      frames: [],
      options: {
        variant: '00'
      }
    }
  }
  componentWillMount() {
    frame_names.map((names) => {
      this.state.frames.push({name: names, image: '', width: 0, height: 0})
    })
  }
  render() {
    return (<>
    <div className = "bootstrap-wrapper">
    <div className="editorSide col-md-6"></div>
    <div className="frameSide col-md-6">
      <button onClick={change.all_transparent.bind(this)}>Change All -> Transparent</button>
      <div className="upload-btn-wrapper">
        <button className="btn-custom">Change All -> Custom Image Upload</button>
        <input onChange={change.all_custom.bind(this)} name="Select File" type="file"/>
      </div>
      {
        frame_names.map((name, idx) => {
          return (<div className="frameHolder" key={idx}>{name}
            <div className="choose_file">
              <input id={idx} key={idx} onChange={change.selected_custom.bind(this)} name="Select File" type="file"/>
              <img src={this.state.frames[idx].image}/>
            </div>
          </div>)
        })
      }
      <button onClick={make.skin.bind(this)}></button>
    </div>
  </div>
</>)
      }
  }

export default SkinEditor
