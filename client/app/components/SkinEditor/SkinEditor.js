import React, {Component} from 'react'
import {frame_names} from './info/frames'
import {change_frame} from './buttons/change_frame'
import {change_all} from './buttons/change_all'
import {utils} from './buttons/utils'
import {make} from './buttons/make'
import FrameUploader from './components/frameUploader'
import $ from 'jquery'

// import 'react-accessible-accordion/dist/fancy-example.css';

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
      this.state.frames.push({name: names, image: []})
    })
  }
  componentDidMount() {
    $(document).on('click', '#new-frame-button', function(){
          $(this).closest('div').find('input').click()
    })
  }
  render() {
    return (
      <React.Fragment>
        <div className="bootstrap-wrapper">
          <div className="editorSide col-md-5">
            <div className="button-sticky">

              <button onClick={change_all.all_transparent.bind(this)}>Change All -> Transparent</button>
              <div className="upload-btn-wrapper">
                <button className="btn-custom">Change All -> Custom Image Upload</button>
                <input onChange={change_all.all_custom.bind(this)} name="Select File" type="file"/>
              </div>
              <select value={this.state.options.variant} onChange={utils.variant_select.bind(this)}>
                <option defaultValue="defaultValue" value="00">Variant 00</option>
                <option value="01">Variant 01</option>
                <option value="02">Variant 02</option>
                <option value="03">Variant 03</option>
              </select>
              <button onClick={make.skin.bind(this)}>Create Skin</button>
            </div>
          </div>
          <div className="frameSide col-md-7">
            <FrameUploader data_names={frame_names} data={this.state.frames} change={change_frame.add_frame.bind(this)}/>
            </div>
          </div>
        </React.Fragment>)
      }
  }

export default SkinEditor
