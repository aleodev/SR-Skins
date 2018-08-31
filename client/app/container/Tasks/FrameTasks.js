import React from "react";
import PropTypes from "prop-types";
import { frame_names } from "../data/frames";
const FrameTasks = props => (
  <div className="selector-left">
    {frame_names.map((name, idx) => {
      return (
        <button
          key={idx}
          id={idx}
          onClick={() => props.changeActive(idx)}
          className={
            "button button-block button-rounded button-3d " +
            (props.frameData[idx].image.length < 1 ? "nf" : "hf")
          }
        >
          {name}
        </button>
      );
    })}
  </div>
);

FrameTasks.propTypes = {
  changeActive: PropTypes.func.isRequired,
  frameData: PropTypes.array.isRequired
};
export default FrameTasks;
