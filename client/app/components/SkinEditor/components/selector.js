import React from "react";
import PropTypes from "prop-types";
import { frame_names } from "../info/frames";
const Selector = props => (
  <section id="selector">
    {frame_names.map((name, idx) => {
      return (
        <button
          key={idx}
          id={idx}
          onClick={() => props.changeActive(idx)}
          className={
            "button button-block button-rounded button-3d " +
            (props.curState.frames[idx].image.length < 1 ? "nf" : "hf")
          }
        >
          {name}
        </button>
      );
    })}
    <button
      onClick={props.showModal}
      className="button button-3d button-rounded button-action"
    >
      Create Skin
    </button>
  </section>
);

Selector.propTypes = {
  changeActive: PropTypes.func.isRequired,
  curState: PropTypes.object.isRequired,
  showModal: PropTypes.func.isRequired
};
export default Selector;
