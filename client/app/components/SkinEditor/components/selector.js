import React from "react";
import PropTypes from "prop-types";
import { frame_names } from "../data/frames";
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
            (props.frameData[idx].image.length < 1 ? "nf" : "hf")
          }
        >
          {name}
        </button>
      );
    })}
    <button
      onClick={e => props.showModal(468, e)}
      className="button button-3d button-rounded button-action"
    >
      Create Skin
    </button>
  </section>
);

Selector.propTypes = {
  changeActive: PropTypes.func.isRequired,
  frameData: PropTypes.array.isRequired,
  showModal: PropTypes.func.isRequired
};
export default Selector;
