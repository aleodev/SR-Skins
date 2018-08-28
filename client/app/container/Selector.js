import React from "react";
import PropTypes from "prop-types";
import { frame_names } from "./data/frames";
const Selector = props => (
  <section id="selector">
    <div className="selector-right">
      <button
        onClick={e => props.showModal(468, e)}
        className="button button-3d button-rounded button-action create-btn"
      >
        Create Skin
      </button>
      <button
        onClick={e => props.showModal(599, e)}
        className="button button-3d button-rounded button-danger clear-btn"
      >
        Reset
      </button>
      <div className="change-all-frame-button-wrapper">
        <label
          htmlFor="change-all"
          className="button button-3d button-rounded button-info upload-btn"
        >
          Single Upload All
        </label>
        <input
          id="change-all"
          className="custom-all-input"
          onChange={e => props.alter(e, "custom")}
          name="Select File"
          type="file"
        />
      </div>
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
    </div>
  </section>
);

Selector.propTypes = {
  changeActive: PropTypes.func.isRequired,
  frameData: PropTypes.array.isRequired,
  showModal: PropTypes.func.isRequired,
  alter: PropTypes.func.isRequired
};
export default Selector;
