import React from "react";
import PropTypes from "prop-types";
import FrameTasks from "./FrameTasks";
import ImpTasks from "./ImpTasks";
const Tasks = props => (
  <section id="selector">
    <ImpTasks
      frameData={props.frameData}
      showModal={props.showModal}
      alter={props.alter}
    />
    <FrameTasks frameData={props.frameData} changeActive={props.changeActive} />
  </section>
);

Tasks.propTypes = {
  changeActive: PropTypes.func.isRequired,
  frameData: PropTypes.array.isRequired,
  showModal: PropTypes.func.isRequired,
  alter: PropTypes.func.isRequired
};
export default Tasks;
