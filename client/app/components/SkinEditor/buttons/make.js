import axios from 'axios'
import {saveAs} from 'file-saver/FileSaver'
export const make = {
  skin: function(e) {
    function noImage(imageValue) {
      return imageValue.image !== ''
    }
    if (this.state.frames.every(noImage) != true) {
      console.log('You forgot to include at least 22 images.')
    } else {
      axios({
        method: 'POST',
        url: `http://${process.env.IP_ENV}:${process.env.PORT_ENV}/skineditor`,
        data: {
          frame_data: this.state.frames,
          options: this.state.options
        },
        headers: {
          'Content-Type': 'application/json'
        },
        responseType: 'blob'
      }).then(response => {
        console.log(response)
        saveAs(new Blob([response.data], {type: "application/zip"}), "skin.zip")
      }).catch(error => {
        if (error.response.status === 403) {
           console.log('Not allowed to request 2 things at a time.')
        } else {
           console.log(error.response)
        }
      })
    }
    e.preventDefault()
  }
}
