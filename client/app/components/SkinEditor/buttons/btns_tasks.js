import axios from "axios";
import { saveAs } from "file-saver/FileSaver";
export const task_btn_handlers = {
  make_skin: function(e) {
    function noImage(imageValue) {
      return imageValue.image !== "";
    }
    if (this.state.frames.every(noImage) != true) {
      console.log("You forgot to include at least 22 images.");
    } else {
      axios({
        method: "POST",
        url: `http://${process.env.IP_ENV}:${process.env.PORT_ENV}/skineditor`,
        data: {
          frame_data: this.state.frames,
          options: this.state.options
        },
        headers: {
          "Content-Type": "application/json"
        },
        responseType: "blob"
      })
        .then(response => {
          console.log(response);
          saveAs(
            new Blob([response.data], { type: "application/zip" }),
            "skin.zip"
          );
        })
        .catch(error => {
          if (error.response.status === 403) {
            console.log("Not allowed to request 2 things at a time.");
          } else {
            console.log(error.response);
          }
        });
    }
    e.preventDefault();
  },
  all_custom: function(event) {
    if (event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = e => {
        let img = new Image();
        img.onload = () => {
          let transCustomData = this.state.frames.map(data => {
            return Object.assign({}, data, {
              image: e.target.result
            });
          });
          this.setState({ frames: transCustomData });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  },
  all_transparent: function(event) {
    // let transData = this.state.frames.map(data => {
    //   return Object.assign({}, data, {image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAQAAACWCLlpAAAA3klEQVR42u3QQREAAAwCoNm/9Cr49iACOWpRIEuWLFmyZCmQJUuWLFmyFMiSJUuWLFkKZMmSJUuWLAWyZMmSJUuWAlmyZMmSJUuBLFmyZMmSpUCWLFmyZMlSIEuWLFmyZCmQJUuWLFmyFMiSJUuWLFkKZMmSJUuWLAWyZMmSJUuWAlmyZMmSJUuBLFmyZMmSpUCWLFmyZMlSIEuWLFmyZCmQJUuWLFmyFMiSJUuWLFkKZMmSJUuWLAWyZMmSJUuWAlmyZMmSJUuBLFmyZMmSpUCWLFmyZMlSIEuWLFmbHrcjAJdeLWiCAAAAAElFTkSuQmCC"})
    // })
    // this.setState({frames: transData})
    console.log("cunt");
  },
  variant_select: function(event) {
    this.setState({
      options: {
        ...this.state.options,
        variant: event.target.value
      }
    });
  }
};
