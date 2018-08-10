import update from 'immutability-helper';
import {frame_names} from '../info/frames'
export const change_frame = {
  add_frame: function(e) {
    e.preventDefault()
    if (e.target.files[0]) {
      let reader = new FileReader()
      var idx = e.target.id
      reader.onloadend = (theFile) => {
        let img = new Image()
        img.onload = () => {
          this.setState({
            frames: update(this.state.frames,  {[idx]: {image: {$push: [{width: img.width,height: img.height , data: theFile.target.result}]}}})
        },() => {
          console.log(this.state)
        })
      }
        img.src = reader.result
      }
      reader.readAsDataURL(e.target.files[0])
    }
    e.target.value = null
  }
}
