import React from "react";
import { revData } from "./data/revs";
import Fade from "react-reveal/Fade";
const Home = () => (
  <>
    <Fade>
      <section id="home">
        <hr />
        {revData.map((data, idx) => {
          return (
            <div className="rev-card" key={idx}>
              <div className="rev-header">{data.title}</div>
              <div className="rev-body">
                <div className="rev-body-title">{data.bodyTitle}</div>
                {data.body}
                {"- "}
                {data.date}
              </div>
            </div>
          );
        })}
      </section>
    </Fade>
  </>
);

export default Home;
