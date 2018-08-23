import React, { Component } from "react";
import { Link } from "react-router-dom";
import Fade from "react-reveal/Fade";
import Tilt from "react-tilt";
export default class Portal extends Component {
  render() {
    return (
      <Fade big>
        <section id="portal">
          <div className="col-6">
            <Link to="/editor/custom">
              <Tilt
                className="Tilt"
                options={{ max: 25, perspective: 1000, reset: true }}
              >
                <div className="movie">
                  <div className="movie__card">
                    <div className="layer-1" />
                    <div className="layer-2" />
                    <div className="layer-3" />
                  </div>
                </div>
              </Tilt>
            </Link>
          </div>

          <div className="col-6" style={{ overflow: "hidden" }}>
            <Tilt
              className="Tilt"
              options={{ max: 25, perspective: 1000, reset: true }}
            >
              <div className="movie">
                <div className="movie__card">
                  <div className="layer-4" />
                  <div className="layer-5" />
                  <div className="layer-6" />
                </div>
              </div>
            </Tilt>
          </div>
        </section>
      </Fade>
    );
  }
}
