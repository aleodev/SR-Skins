import React from "react";
import PropTypes from "prop-types";
const ImpTasks = props => (
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
    {props.frameData.every(x => x.image.length < 9) ? (
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
    ) : null}
  </div>
);

ImpTasks.propTypes = {
  alter: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired,
  frameData: PropTypes.array.isRequired
};
export default ImpTasks;
