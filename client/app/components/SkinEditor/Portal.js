import React, { Component } from "react";
import { Link } from "react-router-dom";
import Fade from "react-reveal/Fade";
import Tilt from "react-tilt";
class Portal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
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

          <div className="col-6">
            <Tilt
              className="Tilt"
              options={{ max: 25, perspective: 500, reset: true }}
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
          {/* <div className="project-list">
          <div className="project">
            <div className="project__card">
              <a href="" className="project__image">
                <img src="http://unsplash.it/600/400?image=189" alt="" />
              </a>
              <div className="project__detail">
                <h2 className="project__title">
                  <a href="#">Project Name</a>
                </h2>
                <small className="project__category">
                  <a href="#">Photography</a>
                </small>
              </div>
            </div>
          </div> */}
        </section>
      </Fade>
    );
  }
}

export default Portal;
