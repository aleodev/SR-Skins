import React, { Component } from "react";
const revData = [
  {
    title: (
      <p>
        Rev 0.1
        <span className="badge badge-info">Major Update</span>
      </p>
    ),
    bodyTitle: "Introducting SpeedSkins",
    body: (
      <p>
        Welcome to beginning of speedskins. This tool is essentially a
        SpeedRunners custom skin creator, that has the ability to take images as
        frames from your selected animation, packs them all into an XNB and
        ATLAS.
        {/* Me &#40;
        <span style={{ color: "red" }}> Slevero//Syrian Limabean</span> &#41;
        &amp; <span style={{ color: "red" }}>pop4959 </span> */}{" "}
        We&#39;re going to try to update the app as frequent as possible, and
        make your user experience as good as possible. <br />
        <span style={{ color: "lightgreen" }}>
          If you want to leave any feedback/suggestions on the app, please
          follow{" "}
          <a
            href="https://goo.gl/forms/sl1zZ7LD4ErzENjs2"
            rel="noopener noreferrer"
            target="_blank"
          >
            this
          </a>{" "}
          link for a form.
        </span>
        {/* It uses technologies such as :
        <ul>
          <li style={{ color: "lightblue" }}>React</li>
          <li style={{ color: "lightgreen" }}>JSZip</li>
          <li style={{ color: "antiquewhite" }}>Gamefroot Texture Packer</li>
          <li style={{ color: "blueviolet" }}>
            <span style={{ color: "red" }}>pop4959&#39;s</span> Atlas-Generator
          </li>
          <li>
            <span>Sullerandras&#39;s</span>
            png-to-xnb
          </li>
        </ul> */}
      </p>
    )
  }
];
class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <section id="home">
          <hr />
          {revData.map((data, idx) => {
            return (
              <div className="rev-card" key={idx}>
                <div className="rev-header">{data.title}</div>
                <div className="rev-body">
                  <div className="rev-body-title">{data.bodyTitle}</div>
                  {data.body}
                </div>
              </div>
            );
          })}
        </section>
      </>
    );
  }
}

export default Home;
