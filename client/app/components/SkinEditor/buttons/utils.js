export const utils = {
variant_select: function(event) {
  this.setState({
    options: {
      ...this.state.options,
      variant: event.target.value
    }
  })
}
}
