import React, { Component } from "react";
export default class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  handleClose = () => {
    this.setState({ show: false });
  };

  handleShow = () => {
    this.setState({ show: true });
  };

  render() {
    return <div />;
  }
}
// const Tasks = (props) => (<section id="tasks">
//   <button onClick={props.taskHandle1}>Change All -> Transparent</button>
//   <div className="upload-btn-wrapper">
//     <button className="btn-custom">Change All -> Custom Image Upload</button>
//     <input onChange={props.taskHandle.all_custom.bind(this)} name="Select File" type="file"/>
//   </div>
//   <select value={props.curState.options.variant} onChange={props.taskHandle.variant_select.bind(this)}>
//     <option defaultValue="defaultValue" value="00">Variant 00</option>
//     <option value="01">Variant 01</option>
//     <option value="02">Variant 02</option>
//     <option value="03">Variant 03</option>
//   </select>
//   <button onClick={props.taskHandle.make_skin.bind(this)}>Create Skin</button>
// </section>
// )
// export default Create
