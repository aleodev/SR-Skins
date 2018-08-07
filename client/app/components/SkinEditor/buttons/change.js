export const change = {
  all_custom: function(event) {
    if (event.target.files[0]) {
      let reader = new FileReader()
      reader.onload = (e) => {
        let img = new Image()
        img.onload = () => {
          let transCustomData = this.state.frames.map(data => {
            return Object.assign({}, data, {
              image: e.target.result,
              width: img.width,
              height: img.height
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
  },
  selected_custom: function(event) {
    if (event.target.files[0]) {
      let reader = new FileReader()
      var idx = event.target.id
      reader.onload = (e) => {
        let img = new Image()
        img.onload = () => {
          this.state.frames[idx] = {
            name: this.state.frames[idx].name,
            image: e.target.result,
            width: img.width,
            height: img.height
          }
          this.setState({update: 1})
        }
        img.src = reader.result
      }
      reader.readAsDataURL(event.target.files[0])
    }
  },
  variant_select: function(event) {
    this.setState({
      options: {
        ...this.state.options,
        variant: event.target.value
      }
    })
  }
}
