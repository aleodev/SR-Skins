export const change_all = {
  all_custom: function(event) {
    if (event.target.files[0]) {
      let reader = new FileReader()
      reader.onload = (e) => {
        let img = new Image()
        img.onload = () => {
          let transCustomData = this.state.frames.map(data => {
            return Object.assign({}, data, {
              image: e.target.result
            })
          })
          this.setState({frames: transCustomData})
        }
        img.src = reader.result
      }
      reader.readAsDataURL(event.target.files[0])
    }
  },
  all_transparent: function(event) {
    let transData = this.state.frames.map(data => {
      return Object.assign({}, data, {image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAQAAACWCLlpAAAA3klEQVR42u3QQREAAAwCoNm/9Cr49iACOWpRIEuWLFmyZCmQJUuWLFmyFMiSJUuWLFkKZMmSJUuWLAWyZMmSJUuWAlmyZMmSJUuBLFmyZMmSpUCWLFmyZMlSIEuWLFmyZCmQJUuWLFmyFMiSJUuWLFkKZMmSJUuWLAWyZMmSJUuWAlmyZMmSJUuBLFmyZMmSpUCWLFmyZMlSIEuWLFmyZCmQJUuWLFmyFMiSJUuWLFkKZMmSJUuWLAWyZMmSJUuWAlmyZMmSJUuBLFmyZMmSpUCWLFmyZMlSIEuWLFmbHrcjAJdeLWiCAAAAAElFTkSuQmCC"})
    })
    this.setState({frames: transData})
  }
}
