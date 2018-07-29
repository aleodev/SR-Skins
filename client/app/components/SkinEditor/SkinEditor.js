import React from 'react';
import $ from 'jquery'
import update from 'immutability-helper';
import axios from 'axios';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8080');

class SkinEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frames: [],
      frameNames: ['321GO', 'Double-Jump-Fall', 'Double-Jump', 'Flip', 'Grabbed', 'Hookshot', 'Stand', 'Long-Fall', 'Long-Jump', 'Roll',
    'Run', 'Running-Hook', 'Skid', 'Slide', 'Sliding', 'Straight-Fall', 'Straight-Jump', 'Swing', 'Taunt', 'Spiked', 'Tumble', 'Wall-Hang', 'Run']
    }

  }
componentWillMount() {
  this.state.frameNames.map((names) => {
    this.state.frames.push({
      name: names,
      // xcord: 0,
      // ycord: 0,
      width: 0,
      height: 0,
      image: ''
    })
  })
}
onImageChange(event) {
  if (event.target.files[0]) {
    let reader = new FileReader();
    var idx = event.target.id
    reader.onload = (e) => {
      let img = new Image();
      img.onload = () => {
        this.state.frames[idx] = {
          name: this.state.frames[idx].name,
          image: e.target.result,
          width: img.width,
          height: img.height
        }
        this.setState({update: 1})
      }
      img.src = reader.result;
    }
    reader.readAsDataURL(event.target.files[0])
  }
}
transDefault(event) {
  let transData = this.state.frames.map(data => {
    return Object.assign({}, data, {image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAQAAACWCLlpAAAA3klEQVR42u3QQREAAAwCoNm/9Cr49iACOWpRIEuWLFmyZCmQJUuWLFmyFMiSJUuWLFkKZMmSJUuWLAWyZMmSJUuWAlmyZMmSJUuBLFmyZMmSpUCWLFmyZMlSIEuWLFmyZCmQJUuWLFmyFMiSJUuWLFkKZMmSJUuWLAWyZMmSJUuWAlmyZMmSJUuBLFmyZMmSpUCWLFmyZMlSIEuWLFmyZCmQJUuWLFmyFMiSJUuWLFkKZMmSJUuWLAWyZMmSJUuWAlmyZMmSJUuBLFmyZMmSpUCWLFmyZMlSIEuWLFmbHrcjAJdeLWiCAAAAAElFTkSuQmCC"})
  })
  this.setState({frames: transData})
}
transCustom(event) {
  if (event.target.files[0]) {
    let reader = new FileReader();
    reader.onload = (e) => {
      let transCustomData = this.state.frames.map(data => {
        return Object.assign({}, data, {image: e.target.result})
      })
      this.setState({frames: transCustomData})
    }
    reader.readAsDataURL(event.target.files[0])
  }
}
sendSprites(e) {
  function noImage(imageValue){s
    return imageValue.image !== '';
  }
  if(this.state.frames.every(noImage)){
  fetch('/sendframes', {
    method: 'POST',
    body: JSON.stringify(this.state.frames),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).then(json => {
    console.log(json)
  });
}else {
  console.log('cucked')
}
}
render() {
      return (
        <>
         <div className="bootstrap-wrapper">
           <div>{socket.id}</div>
           <div className="editorSide col-md-6">
           </div>
           <div className="frameSide col-md-6">
             <button onClick={this.transDefault.bind(this)}>Change All - Transparent</button>
             <div className="upload-btn-wrapper">
                 <button className="btn-custom">Change All - Custom Image Upload</button>
                 <input onChange={this.transCustom.bind(this)} name="Select File" type="file" />
             </div>
             {
               this.state.frameNames.map((name, idx) => {
                 return (<div className="frameHolder" key={idx}>{name}
                 <div className="choose_file">
                   <input id={idx} key={idx} onChange={this.onImageChange.bind(this)} name="Select File" type="file" />
                   <img src={this.state.frames[idx].image}/>
                 </div>
               </div>)
                 })
             }
             <button onClick={this.sendSprites.bind(this)}></button>
           </div>
         </div>
        </>)
      }
  }

export default SkinEditor;
     // <input type="file" onChange={this.onImageChange} className="filetype" id="group_image"/>
     // <img src={this.state.image}/>
